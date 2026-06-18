import { schools, Board } from "@/app/data/schools";
import SchoolCard from "@/app/components/SchoolCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const boardMap: Record<string, Board> = {
  'cbse': 'CBSE',
  'kerala-state': 'Kerala State',
  'icse': 'ICSE',
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
    description: `Find all ${b} affiliated schools within 15km of Vatanappally, Thrissur. ${count} schools listed with details on streams, facilities and admissions.`,
  };
}

export default async function BoardPage({ params }: { params: Promise<{ board: string }> }) {
  const { board } = await params;
  const b = boardMap[board];
  if (!b) notFound();
  const filtered = schools.filter(s => s.board.includes(b)).sort((a, x) => a.distanceFromVatanappally - x.distanceFromVatanappally);
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>{b} Schools Near Vatanappally</h1>
      <p className="text-gray-600 mb-8">{filtered.length} {b} schools within 15km of Vatanappally, Thrissur.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(s => <SchoolCard key={s.id} school={s} />)}
      </div>
    </div>
  );
}
