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
  const streamCls = (s: string) => ({ Science: 'chip-science', Commerce: 'chip-commerce', Humanities: 'chip-humanities', Vocational: 'chip-vocational' }[s] || 'chip-type');

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

      {/* Hero */}
      <section style={{ background: 'var(--ink)', borderBottom: '3px solid var(--lime)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.04)1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04)1px,transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '56px 40px', position: 'relative', zIndex: 1 }}>
          <Link href="/schools/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,.35)', marginBottom: '24px', letterSpacing: '.08em', textTransform: 'uppercase', textDecoration: 'none' }}>← All Schools</Link>
          <div className="kicker"><span className="kicker-rule" /><span className="kicker-text">{school.town} · {school.district} · Est. {school.established}</span></div>
          <h1 style={{ fontSize: 'clamp(24px,4vw,52px)', fontWeight: 800, letterSpacing: '-2px', color: '#fff', lineHeight: .95, marginBottom: '20px', maxWidth: '760px' }}>{school.name}</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {school.board.map(b => <span key={b} className={`chip ${boardCls(b)}`}>{b}</span>)}
            {school.streams.map(s => <span key={s} className={`chip ${streamCls(s)}`}>{s}</span>)}
            <span className="chip chip-type">{school.type}</span>
            <span className="chip chip-type">{school.medium} medium</span>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          {/* Details */}
          <div style={{ background: 'var(--white)', border: '1.5px solid var(--cream-3)', borderLeft: '4px solid var(--lime)', borderRadius: '4px', padding: '28px', boxShadow: 'var(--sh)' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--pale)', marginBottom: '20px' }}>School Details</div>
            <dl style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                ['Board', school.board.join(', ')],
                ['Medium', school.medium],
                ['Type', school.type],
                ['Classes', school.classes],
                ['Established', String(school.established)],
                ['Distance', `${school.distanceFromVatanappally} km from Vatanappally`],
                ['Level', school.level],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--rule)', paddingBottom: '10px' }}>
                  <dt style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>{label}</dt>
                  <dd style={{ fontSize: '13px', fontWeight: 800, color: 'var(--ink)' }}>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Facilities */}
          <div style={{ background: 'var(--white)', border: '1.5px solid var(--cream-3)', borderLeft: '4px solid var(--lime-2)', borderRadius: '4px', padding: '28px', boxShadow: 'var(--sh)' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--pale)', marginBottom: '20px' }}>Facilities & Streams</div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', marginBottom: '10px' }}>Facilities</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {school.features.map(f => (
                  <span key={f} style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', background: 'var(--cream-2)', border: '1px solid var(--rule)', borderRadius: '3px', color: 'var(--ink-3)' }}>{f}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', marginBottom: '10px' }}>Plus Two Streams</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {school.streams.map(s => <span key={s} className={`chip ${streamCls(s)}`}>{s}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ background: 'var(--white)', border: '1.5px solid var(--cream-3)', borderRadius: '4px', padding: '28px', boxShadow: 'var(--sh)', marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--pale)', marginBottom: '12px' }}>About this school</div>
          <p style={{ fontSize: '15px', color: 'var(--ink-3)', lineHeight: 1.8, marginBottom: '12px' }}>{school.description}</p>
          <p style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>📍 {school.address}</p>
        </div>

        {/* CTA */}
        <div style={{ background: 'var(--ink)', border: '1.5px solid rgba(255,255,255,.08)', borderTop: '3px solid var(--lime)', borderRadius: '4px', padding: '32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,197,63,.12),transparent 65%)', pointerEvents: 'none' }} />
          <p style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '8px', letterSpacing: '-.3px' }}>Preparing for Plus Two at a school nearby?</p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.4)', marginBottom: '20px', lineHeight: 1.7 }}>SEHR Academy in Vatanappally offers Science stream coaching for students from all local schools.</p>
          <a href="https://sehracademy.com" className="btn-lime">Explore SEHR Academy →</a>
        </div>
      </div>
    </>
  );
}
