import { schools } from "@/app/data/schools";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Schools Near Vatanappally | CBSE vs Kerala State Board",
  description: "Compare top schools near Vatanappally, Thrissur side by side. See board, streams, facilities, distance and more.",
};

export default function ComparePage() {
  const top8 = [...schools].sort((a, b) => a.distanceFromVatanappally - b.distanceFromVatanappally).slice(0, 8);
  const streamCls = (s: string) => ({ Science: 'chip-science', Commerce: 'chip-commerce', Humanities: 'chip-humanities', Vocational: 'chip-vocational' }[s] || '');

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Compare Schools Near Vatanappally</h1>
      <p className="text-gray-600 mb-8">Showing the 8 closest schools sorted by distance from Vatanappally.</p>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ background: 'var(--ink)', color: 'white' }}>
              <th className="text-left p-4">School</th>
              <th className="p-4 text-center">Dist.</th>
              <th className="p-4 text-center">Board</th>
              <th className="p-4 text-center">Streams</th>
              <th className="p-4 text-center">Medium</th>
              <th className="p-4 text-center">Type</th>
            </tr>
          </thead>
          <tbody>
            {top8.map((s, i) => (
              <tr key={s.id} style={{ background: i % 2 === 0 ? '#fff' : 'var(--cream-2)' }} className="border-b border-gray-100">
                <td className="p-4">
                  <a href={`/schools/${s.slug}/`} style={{ color: 'var(--lime-dark)', fontFamily: 'Montserrat, sans-serif' }} className="font-bold hover:underline text-sm">{s.name}</a>
                  <div className="text-xs text-gray-500">{s.town}</div>
                </td>
                <td className="p-4 text-center text-sm">{s.distanceFromVatanappally} km</td>
                <td className="p-4 text-center">
                  {s.board.map(b => {
                    const cls = b === 'CBSE' ? 'chip-cbse' : 'chip-kerala';
                    return <span key={b} className={`chip ${cls} block mb-1`}>{b}</span>;
                  })}
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {s.streams.map(st => <span key={st} className={`chip ${streamCls(st)}`}>{st}</span>)}
                  </div>
                </td>
                <td className="p-4 text-center text-xs">{s.medium}</td>
                <td className="p-4 text-center text-xs">{s.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
