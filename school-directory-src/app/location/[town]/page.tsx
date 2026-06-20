import { schools, towns } from "@/app/data/schools";
import SchoolCard from "@/app/components/SchoolCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
  return towns.map(town => ({ town: town.toLowerCase().replace(/ /g, '-') }));
}

export async function generateMetadata({ params }: { params: Promise<{ town: string }> }): Promise<Metadata> {
  const { town } = await params;
  const townName = towns.find(t => t.toLowerCase().replace(/ /g, '-') === town);
  if (!townName) return {};
  const count = schools.filter(s => s.town === townName).length;
  return {
    title: `Schools in ${townName} | Thrissur Schools Directory`,
    description: `${count} high school${count !== 1 ? 's' : ''} in ${townName}, Thrissur. CBSE and Kerala State Board schools with Plus Two streams.`,
  };
}

export default async function LocationPage({ params }: { params: Promise<{ town: string }> }) {
  const { town } = await params;
  const townName = towns.find(t => t.toLowerCase().replace(/ /g, '-') === town);
  if (!townName) notFound();

  const localSchools = schools.filter(s => s.town === townName);

  return (
    <>
      <section style={{ background: 'var(--ink)', borderBottom: '3px solid var(--lime)', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-grid"/>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '56px 40px', position: 'relative', zIndex: 1 }}>
          <Link href="/schools/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,.35)', marginBottom: '24px', letterSpacing: '.08em', textTransform: 'uppercase', textDecoration: 'none' }}>← All Schools</Link>
          <div className="kicker"><span className="kicker-rule"/><span className="kicker-text">Location · Coastal Thrissur</span></div>
          <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, letterSpacing: '-2px', color: '#fff', lineHeight: .95, marginBottom: '12px' }}>
            Schools in <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--lime)' }}>{townName}</em>
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,.4)' }}>{localSchools.length} {localSchools.length === 1 ? 'school' : 'schools'} in this panchayath</p>
        </div>
      </section>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '40px' }}>
          {localSchools.map(s => <SchoolCard key={s.id} school={s} />)}
        </div>
        <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', marginRight: '8px', alignSelf: 'center' }}>Other locations:</div>
          {towns.filter(t => t !== townName).map(t => (
            <Link key={t} href={`/location/${t.toLowerCase().replace(/ /g, '-')}/`} style={{ fontSize: '12px', fontWeight: 700, color: 'var(--lime-2)', textDecoration: 'none' }}>{t}</Link>
          ))}
        </div>
      </div>
    </>
  );
}
