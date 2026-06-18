import { schools, Stream } from "@/app/data/schools";
import SchoolCard from "@/app/components/SchoolCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const streamMap: Record<string, Stream> = {
  'science': 'Science', 'commerce': 'Commerce', 'humanities': 'Humanities', 'vocational': 'Vocational',
};

export function generateStaticParams() {
  return Object.keys(streamMap).map(stream => ({ stream }));
}

export async function generateMetadata({ params }: { params: Promise<{ stream: string }> }): Promise<Metadata> {
  const { stream } = await params;
  const s = streamMap[stream];
  if (!s) return {};
  const count = schools.filter(sc => sc.streams.includes(s)).length;
  return {
    title: `${s} Stream Schools Near Vatanappally | Plus Two ${s}`,
    description: `${count} schools near Vatanappally offering Plus Two ${s} stream. Compare CBSE and Kerala State Board options.`,
  };
}

export default async function StreamPage({ params }: { params: Promise<{ stream: string }> }) {
  const { stream } = await params;
  const s = streamMap[stream];
  if (!s) notFound();
  const filtered = schools.filter(sc => sc.streams.includes(s)).sort((a, b) => a.town.localeCompare(b.town));

  return (
    <>
      <section style={{ background: 'var(--ink)', borderBottom: '3px solid var(--lime)', padding: '56px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="kicker"><span className="kicker-rule" /><span className="kicker-text">Stream Filter</span></div>
          <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, letterSpacing: '-2px', color: '#fff', lineHeight: .95, marginBottom: '12px' }}>
            <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--lime)' }}>{s} stream</em> schools
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,.4)' }}>{filtered.length} schools offering Plus Two {s} · sorted by distance</p>
        </div>
      </section>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
          {filtered.map(sc => <SchoolCard key={sc.id} school={sc} />)}
        </div>
      </div>
    </>
  );
}
