import Link from "next/link";
import { School } from "@/app/data/schools";

export default function SchoolCard({ school }: { school: School }) {
  const boardChip = (b: string) => {
    const cls = b === 'CBSE' ? 'chip-cbse' : b === 'Kerala State' ? 'chip-kerala' : 'chip-icse';
    return <span key={b} className={`chip ${cls}`}>{b}</span>;
  };
  const streamChip = (s: string) => {
    const map: Record<string, string> = { Science: 'chip-science', Commerce: 'chip-commerce', Humanities: 'chip-humanities', Vocational: 'chip-vocational' };
    return <span key={s} className={`chip ${map[s] || ''}`}>{s}</span>;
  };
  return (
    <div className="school-card flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-base leading-snug" style={{ fontFamily: 'Montserrat, sans-serif' }}>{school.name}</h3>
          <span className="text-xs text-gray-400 whitespace-nowrap">{school.distanceFromVatanappally} km</span>
        </div>
        <p className="text-sm text-gray-500 mb-3">{school.town} · {school.type}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {school.board.map(boardChip)}
          {school.streams.map(streamChip)}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{school.description}</p>
      </div>
      <div className="px-5 pb-4">
        <Link href={`/schools/${school.slug}/`} className="sehr-btn text-sm w-full text-center block">View School →</Link>
      </div>
    </div>
  );
}
