import Link from "next/link";
import { schools } from "@/app/data/schools";
import SchoolCard from "@/app/components/SchoolCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schools Directory — Vatanappally & Thrissur Region, Kerala",
  description: "Find the best CBSE and Kerala State Board schools near Vatanappally, Thrissur. Compare Plus Two streams, facilities, and admission details for 23 schools within 15km.",
};

export default function Home() {
  const cbse = schools.filter(s => s.board.includes('CBSE')).length;
  const kerala = schools.filter(s => s.board.includes('Kerala State')).length;
  const featured = [...schools].sort((a, b) => a.distanceFromVatanappally - b.distanceFromVatanappally).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--ink)', borderBottom: '3px solid var(--lime)', position: 'relative', overflow: 'hidden' }}>
        {/* grid texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.04)1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04)1px,transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
        {/* lime glow */}
        <div style={{ position: 'absolute', top: '-160px', right: '-160px', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,197,63,.18),transparent 65%)', pointerEvents: 'none' }} />
        {/* watermark */}
        <div style={{ position: 'absolute', right: '-20px', bottom: '-10px', fontSize: 'clamp(100px,14vw,220px)', fontWeight: 800, letterSpacing: '-8px', color: 'rgba(255,255,255,.03)', pointerEvents: 'none', userSelect: 'none', lineHeight: 1, zIndex: 0, whiteSpace: 'nowrap' }}>SCHOOLS</div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '100px 40px 90px', position: 'relative', zIndex: 1 }}>
          <div className="kicker">
            <span className="kicker-rule" />
            <span className="kicker-text">Vatanappally · Thrissur · Kerala</span>
          </div>
          <h1 style={{ fontSize: 'clamp(38px,5.5vw,76px)', fontWeight: 800, letterSpacing: '-2.5px', color: '#fff', lineHeight: .92, marginBottom: '20px', maxWidth: '720px' }}>
            Find the right school<br />
            <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--lime)' }}>in your region</em>
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,.45)', maxWidth: '520px', lineHeight: 1.8, marginBottom: '36px' }}>
            Comprehensive directory of {schools.length} schools within 15km of Vatanappally — CBSE and Kerala State Board, Plus Two streams, facilities and admission info in one place.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href="/schools/" className="btn-lime">Browse All Schools →</Link>
            <Link href="/admissions/" className="btn-ghost">Admissions Guide</Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ background: 'var(--white)', borderBottom: '1.5px solid var(--cream-3)', boxShadow: 'var(--sh)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {[
            { value: schools.length, label: 'Schools Listed', unit: '' },
            { value: cbse, label: 'CBSE Schools', unit: '' },
            { value: kerala, label: 'Kerala State Board', unit: '' },
            { value: 15, label: 'km Radius', unit: '' },
          ].map((stat, i) => (
            <div key={stat.label} style={{ padding: '28px 24px', borderRight: i < 3 ? '1px solid var(--rule)' : 'none' }}>
              <div style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1.5px', color: 'var(--ink)', lineHeight: 1, marginBottom: '4px' }}>
                {stat.value}<span style={{ fontSize: '18px', color: 'var(--lime-2)', fontWeight: 700 }}>{stat.unit}</span>
              </div>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--pale)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Browse by category */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 40px' }}>
        <div className="kicker">
          <span className="kicker-rule" />
          <span className="kicker-text">Browse</span>
        </div>
        <h2 className="section-h2">Schools by <em>board & stream</em></h2>
        <p className="section-sub">Filter schools by curriculum board or the Plus Two stream you want to pursue.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '64px' }}>
          {[
            { href: '/board/cbse/', label: 'CBSE Schools', count: cbse, desc: 'Central Board schools with English medium', accent: 'var(--blue)', bg: '#eff6ff' },
            { href: '/board/kerala-state/', label: 'Kerala State Board', count: kerala, desc: 'State syllabus with HSCAP admissions', accent: 'var(--lime-2)', bg: 'var(--lime-bg)' },
            { href: '/stream/science/', label: 'Science Stream', count: schools.filter(s => s.streams.includes('Science')).length, desc: 'Biology, Physics, Chemistry & Maths', accent: 'var(--amb)', bg: '#fffbeb' },
            { href: '/stream/commerce/', label: 'Commerce Stream', count: schools.filter(s => s.streams.includes('Commerce')).length, desc: 'Accountancy, Business Studies, Economics', accent: 'var(--blue)', bg: '#eff6ff' },
            { href: '/stream/humanities/', label: 'Humanities Stream', count: schools.filter(s => s.streams.includes('Humanities')).length, desc: 'History, Political Science, Literature', accent: 'var(--red)', bg: '#fef2f2' },
            { href: '/compare/', label: 'Compare Schools', count: null, desc: 'Side-by-side school comparison table', accent: 'var(--lime)', bg: 'var(--cream-2)' },
          ].map(item => (
            <Link key={item.href} href={item.href} className="browse-card" style={{ borderLeft: `4px solid ${item.accent}` }}>
              <div className="browse-card-num">{item.count ?? '→'}</div>
              <div className="browse-card-label">{item.label}</div>
              <div className="browse-card-desc">{item.desc}</div>
            </Link>
          ))}
        </div>

        <div className="sdiv">
          <span className="sdiv-r" />
          <span className="sdiv-d" />
          <span className="sdiv-t">Closest to Vatanappally</span>
          <span className="sdiv-r" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '32px' }}>
          {featured.map(s => <SchoolCard key={s.id} school={s} />)}
        </div>
        <div style={{ textAlign: 'center' }}>
          <Link href="/schools/" className="btn-lime">View All {schools.length} Schools →</Link>
        </div>
      </section>

      {/* Dark CTA */}
      <section style={{ background: 'var(--ink)', borderTop: '3px solid var(--lime)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.04)1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04)1px,transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,197,63,.12),transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 40px', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr auto', gap: '40px', alignItems: 'center' }}>
          <div>
            <div className="kicker">
              <span className="kicker-rule" />
              <span className="kicker-text">SEHR Academy · Vatanappally</span>
            </div>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,44px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#fff', lineHeight: .95, marginBottom: '14px' }}>
              Preparing for <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--lime)' }}>Plus Two Science?</em>
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,.45)', lineHeight: 1.8, maxWidth: '480px' }}>
              SEHR Academy offers expert coaching for Science stream students in Physics, Chemistry, Biology and Mathematics — right here in Vatanappally.
            </p>
          </div>
          <a href="https://sehracademy.com" className="btn-lime" style={{ fontSize: '14px', padding: '16px 28px' }}>Visit SEHR Academy →</a>
        </div>
      </section>
    </>
  );
}
