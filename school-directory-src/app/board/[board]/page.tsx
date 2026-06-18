import { schools, Board } from "@/app/data/schools";
import SchoolCard from "@/app/components/SchoolCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const boardMap: Record<string, Board> = {
  'cbse': 'CBSE', 'kerala-state': 'Kerala State', 'icse': 'ICSE',
};

export function generateStaticParams() {
  return Object.keys(boardMap).map(board => ({ board }));
}

export async function generateMetadata({ params }: { params: Promise<{ board: string }> }): Promise<Metadata> {
  const { board } = await params;
  const b = boardMap[board];
  if (!b) return {};
  const count = schools.filter(s => s.board.includes(b)).length;
  return {
    title: `${b} Schools Near Vatanappally | ${count} Schools Listed`,
    description: `Find all ${b} affiliated schools within 15km of Vatanappally, Thrissur. ${count} schools with details on streams, facilities and admissions.`,
  };
}

export default async function BoardPage({ params }: { params: Promise<{ board: string }> }) {
  const { board } = await params;
  const b = boardMap[board];
  if (!b) notFound();
  const filtered = schools.filter(s => s.board.includes(b)).sort((a, x) => a.distanceFromVatanappally - x.distanceFromVatanappally);

  return (
    <>
      <section style={{ background: 'var(--ink)', borderBottom: '3px solid var(--lime)', padding: '56px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="kicker"><span className="kicker-rule" /><span className="kicker-text">Board Filter</span></div>
          <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, letterSpacing: '-2px', color: '#fff', lineHeight: .95, marginBottom: '12px' }}>
            <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--lime)' }}>{b}</em> schools near Vatanappally
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,.4)' }}>{filtered.length} schools · sorted by distance from Vatanappally</p>
        </div>
      </section>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
          {filtered.map(s => <SchoolCard key={s.id} school={s} />)}
        </div>
      </div>
    </>
  );
}
