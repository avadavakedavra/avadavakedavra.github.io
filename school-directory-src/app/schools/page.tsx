import { schools, towns } from "@/app/data/schools";
import SchoolCard from "@/app/components/SchoolCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Schools | Vatanappally Region Schools Directory",
  description: "Browse all schools across Vatanappally, Chavakkad, Triprayar, Nattika, Thalikulam, Engandiyur and surrounding coastal Thrissur panchayaths.",
};

export default function SchoolsPage() {
  return (
    <>
      <section style={{ background: 'var(--ink)', borderBottom: '3px solid var(--lime)', padding: '56px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="kicker"><span className="kicker-rule" /><span className="kicker-text">Schools Directory</span></div>
          <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, letterSpacing: '-2px', color: '#fff', lineHeight: .95, marginBottom: '12px' }}>
            All schools in the <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--lime)' }}>Vatanappally region</em>
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,.4)', marginBottom: '24px' }}>{schools.length} schools across {towns.length} panchayaths · sorted by location</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {[
              { href: '/board/cbse/', label: `CBSE (${schools.filter(s=>s.board.includes('CBSE')).length})`, cls: 'chip-cbse' },
              { href: '/board/kerala-state/', label: `Kerala State (${schools.filter(s=>s.board.includes('Kerala State')).length})`, cls: 'chip-kerala' },
              { href: '/stream/science/', label: 'Science', cls: 'chip-science' },
              { href: '/stream/commerce/', label: 'Commerce', cls: 'chip-commerce' },
              { href: '/stream/humanities/', label: 'Humanities', cls: 'chip-humanities' },
            ].map(item => (
              <a key={item.href} href={item.href} className={`chip ${item.cls}`} style={{ padding: '5px 12px', fontSize: '10px' }}>{item.label}</a>
            ))}
          </div>
        </div>
      </section>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
        {towns.map(town => {
          const townSchools = schools.filter(s => s.town === town);
          if (townSchools.length === 0) return null;
          return (
            <div key={town} style={{ marginBottom: '48px' }}>
              <div className="sdiv"><span className="sdiv-r"/><span className="sdiv-d"/><span className="sdiv-t">{town}</span><span className="sdiv-r"/></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
                {townSchools.map(s => <SchoolCard key={s.id} school={s} />)}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
