import { MetadataRoute } from "next";
import { schools } from "@/app/data/schools";

export const dynamic = 'force-static';

const base = "https://avadavakedavra.github.io/school-directory";

export default function sitemap(): MetadataRoute.Sitemap {
  const schoolRoutes = schools.map(s => ({
    url: `${base}/schools/${s.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${base}/schools/`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${base}/admissions/`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${base}/compare/`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${base}/board/cbse/`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${base}/board/kerala-state/`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${base}/stream/science/`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${base}/stream/commerce/`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${base}/stream/humanities/`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    ...schoolRoutes,
  ];
}
