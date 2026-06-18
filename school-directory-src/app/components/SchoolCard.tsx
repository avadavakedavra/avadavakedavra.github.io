import Link from "next/link";
import { School } from "@/app/data/schools";

const boardChip = (b: string) => {
  const cls = b === 'CBSE' ? 'chip-cbse' : b === 'Kerala State' ? 'chip-kerala' : 'chip-icse';
  return <span key={b} className={`chip ${cls}`}>{b}</span>;
};
const streamChip = (s: string) => {
  const map: Record<string, string> = { Science: 'chip-science', Commerce: 'chip-commerce', Humanities: 'chip-humanities', Vocational: 'chip-vocational' };
  return <span key={s} className={`chip ${map[s] || 'chip-type'}`}>{s}</span>;
};

export default function SchoolCard({ school }: { school: School }) {
  return (
    <div className="school-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 22px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.2px', lineHeight: 1.35 }}>{school.name}</h3>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--pale)', whiteSpace: 'nowrap', flexShrink: 0 }}>{school.level}</span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px', fontWeight: 600 }}>
          {school.town} · {school.type}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
          {school.board.map(boardChip)}
          {school.streams.map(streamChip)}
        </div>
        <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {school.description}
        </p>
      </div>
      <div style={{ padding: '0 22px 20px' }}>
        <Link href={`/schools/${school.slug}/`} className="btn-lime" style={{ width: '100%', justifyContent: 'center', fontSize: '12px', padding: '10px 16px' }}>
          View Details →
        </Link>
      </div>
    </div>
  );
}
