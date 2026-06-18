import { schools } from "@/app/data/schools";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export function generateStaticParams() {
  return schools.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const school = schools.find(s => s.slug === slug);
  if (!school) return {};
  return {
    title: `${school.name} | Schools in ${school.town}, Thrissur`,
    description: `${school.description} ${school.board.join(', ')} school in ${school.town}, ${school.district}. Offers ${school.streams.join(', ')} streams for Plus Two.`,
  };
}

export default async function SchoolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const school = schools.find(s => s.slug === slug);
  if (!school) notFound();

  const boardCls = (b: string) => b === 'CBSE' ? 'chip-cbse' : b === 'Kerala State' ? 'chip-kerala' : 'chip-icse';
  const streamCls = (s: string) => ({ Science: 'chip-science', Commerce: 'chip-commerce', Humanities: 'chip-humanities', Vocational: 'chip-vocational' }[s] || '');

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "School",
    "name": school.name,
    "address": { "@type": "PostalAddress", "addressLocality": school.town, "addressRegion": "Kerala", "addressCountry": "IN", "streetAddress": school.address },
    "description": school.description,
    "foundingDate": String(school.established),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/schools/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">← All Schools</Link>

        <div style={{ background: 'var(--ink)' }} className="rounded-2xl p-8 mb-8">
          <p className="text-sm font-bold tracking-widest mb-3" style={{ color: 'var(--lime)' }}>
            {school.town} · {school.district} · Est. {school.established}
          </p>
          <h1 className="text-3xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>{school.name}</h1>
          <div className="flex flex-wrap gap-2">
            {school.board.map(b => <span key={b} className={`chip ${boardCls(b)}`}>{b}</span>)}
            {school.streams.map(s => <span key={s} className={`chip ${streamCls(s)}`}>{s}</span>)}
            <span className="chip" style={{ background: 'rgba(255,255,255,.1)', color: '#e5e7eb' }}>{school.type}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="school-card p-6">
            <h2 className="font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>School Details</h2>
            <dl className="space-y-3 text-sm">
              {[
                ['Board', school.board.join(', ')],
                ['Medium', school.medium],
                ['Type', school.type],
                ['Classes', school.classes],
                ['Established', school.established],
                ['Distance', `${school.distanceFromVatanappally} km from Vatanappally`],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between">
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="school-card p-6">
            <h2 className="font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Facilities</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {school.features.map(f => (
                <span key={f} style={{ background: 'var(--cream-2)' }} className="text-xs font-semibold px-3 py-1 rounded-full">{f}</span>
              ))}
            </div>
            <h3 className="font-bold text-sm mb-2">Streams Offered</h3>
            <div className="flex flex-wrap gap-2">
              {school.streams.map(s => <span key={s} className={`chip ${streamCls(s)}`}>{s}</span>)}
            </div>
          </div>
        </div>

        <div className="school-card p-6 mb-8">
          <h2 className="font-bold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>About {school.name}</h2>
          <p className="text-gray-600 leading-relaxed">{school.description}</p>
          <p className="text-sm text-gray-400 mt-3">📍 {school.address}</p>
        </div>

        <div style={{ background: 'var(--ink)' }} className="rounded-2xl p-6 text-center">
          <p className="text-white font-bold mb-2">Preparing for Plus Two at a school nearby?</p>
          <p className="text-gray-400 text-sm mb-4">SEHR Academy in Vatanappally offers Science stream coaching for students from all local schools.</p>
          <a href="https://sehracademy.com" className="sehr-btn">Explore SEHR Academy →</a>
        </div>
      </div>
    </>
  );
}
