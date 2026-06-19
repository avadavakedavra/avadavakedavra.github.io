/**
 * Fetches Google Places ratings for each school and updates schools.ts.
 * Run via GitHub Actions or manually: node scripts/update-ratings.mjs
 *
 * Requires: GOOGLE_PLACES_API_KEY env var
 * Uses the Places API (New) Text Search endpoint.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const SCHOOLS_FILE = join(__dir, '../app/data/schools.ts');
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!API_KEY) {
  console.error('Missing GOOGLE_PLACES_API_KEY environment variable');
  process.exit(1);
}

// Schools to look up: [slug, searchQuery]
// Use the most unique query that will find the right place
const SCHOOL_QUERIES = [
  ['ghss-vatanappally', 'Government Higher Secondary School Vatanappally Thrissur'],
  ['knmvhss-vatanappally', 'KNMVHSS Vatanappally Thrissur'],
  ['madar-english-school-vatanappally', 'Madar English School Vatanappally'],
  ['csm-public-school-vatanappally', 'CSM Public School Vatanappally'],
  ['le-mer-public-school-triprayar', 'Le Mer Public School Triprayar Thrissur'],
  ['ghss-triprayar', 'Government Higher Secondary School Triprayar'],
  ['national-hss-engandiyur', 'National Higher Secondary School Engandiyur'],
  ['st-thomas-hss-engandiyur', 'St Thomas Higher Secondary School Engandiyur'],
  ['saraswathy-vidyanikethan-engandiyur', 'Saraswathy Vidyanikethan Engandiyur'],
  ['gvhss-thalikulam', 'Government Vocational Higher Secondary School Thalikulam'],
  ['blooming-buds-thalikulam', 'Blooming Buds English Medium School Thalikulam'],
  ['gvhss-valapad', 'Government Vocational Higher Secondary School Valapad'],
  ['snm-hss-valapad', 'SNM Higher Secondary School Valapad'],
  ['ghss-nattika', 'Government Higher Secondary School Nattika'],
  ['mount-carmel-hss-nattika', 'Mount Carmel HSS Nattika'],
  ['sree-sai-vidya-peedhom-kanjani', 'Sree Sai Vidya Peedhom Kanjani'],
  ['bvb-english-medium-school-kanjani', 'BVB English Medium School Kanjani'],
  ['snm-hss-chavakkad', 'SNM Higher Secondary School Chavakkad'],
  ['st-aloysius-hss-chavakkad', 'St Aloysius Higher Secondary School Chavakkad'],
  ['govt-boys-hss-chavakkad', 'Government Boys Higher Secondary School Chavakkad'],
  ['govt-girls-hss-chavakkad', 'Government Girls Higher Secondary School Chavakkad'],
  ['ghss-kandassankadavu', 'Government Higher Secondary School Kandassankadavu'],
  ['al-ameen-hss-kandassankadavu', 'Al Ameen Higher Secondary School Kandassankadavu'],
  ['ghss-anthikad', 'Government Higher Secondary School Anthikad'],
  ['st-peters-hss-anthikad', "St Peter's Higher Secondary School Anthikad"],
];

async function searchPlace(query) {
  const url = `https://places.googleapis.com/v1/places:searchText`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.rating,places.userRatingCount',
    },
    body: JSON.stringify({ textQuery: query, languageCode: 'en', maxResultCount: 1 }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Places API error for "${query}": ${resp.status} ${text}`);
  }

  const data = await resp.json();
  const place = data.places?.[0];
  if (!place) return null;

  return {
    placeId: place.id,
    rating: place.rating,
    ratingCount: place.userRatingCount,
    name: place.displayName?.text,
  };
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  let source = readFileSync(SCHOOLS_FILE, 'utf8');

  let updated = 0;
  let failed = 0;

  for (const [slug, query] of SCHOOL_QUERIES) {
    try {
      console.log(`Fetching: ${query}`);
      const result = await searchPlace(query);

      if (!result || result.rating == null) {
        console.log(`  → No rating found`);
        continue;
      }

      console.log(`  → ${result.name}: ${result.rating} (${result.ratingCount} reviews)`);

      // Update googleRating, googleRatingCount, googlePlaceId, ratingsLastUpdated
      // The slug appears in the source as: slug: 'ghss-vatanappally',
      // We look for the school block starting with that slug and update/insert the rating fields.

      // Strategy: find the school object by slug and update its rating fields.
      // We use a targeted regex for each field within the block following the slug.

      const slugPattern = new RegExp(
        `(slug:\\s*'${slug}',[^}]*?)(googleRating:\\s*[^,\\n]+,?\\n?)?(googleRatingCount:\\s*[^,\\n]+,?\\n?)?(googlePlaceId:\\s*[^,\\n]+,?\\n?)?(ratingsLastUpdated:\\s*[^,\\n]+,?\\n?)`,
        's'
      );

      if (slugPattern.test(source)) {
        // Remove existing rating fields then re-add
        source = source.replace(slugPattern, (_, pre) => {
          // Find insertion point: before the closing } of this school object
          // We'll inject after the pre block
          return pre +
            `googleRating: ${result.rating},\n    googleRatingCount: ${result.ratingCount},\n    googlePlaceId: '${result.placeId}',\n    ratingsLastUpdated: '${today}',\n    `;
        });
      } else {
        // Simpler approach: find distanceFromVatanappally line for this school and inject after
        const distPattern = new RegExp(
          `(slug:\\s*'${slug}'[\\s\\S]*?distanceFromVatanappally:\\s*[\\d.]+,)`,
          'm'
        );
        if (distPattern.test(source)) {
          source = source.replace(distPattern, (match) => {
            return match + `\n    googleRating: ${result.rating}, googleRatingCount: ${result.ratingCount}, googlePlaceId: '${result.placeId}', ratingsLastUpdated: '${today}',`;
          });
        } else {
          console.log(`  → Could not find slug in source, skipping`);
          failed++;
          continue;
        }
      }

      updated++;
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.error(`  → Error: ${err.message}`);
      failed++;
    }
  }

  writeFileSync(SCHOOLS_FILE, source);
  console.log(`\nDone. Updated: ${updated}, Failed/skipped: ${failed}`);
  console.log(`Ratings date: ${today}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
