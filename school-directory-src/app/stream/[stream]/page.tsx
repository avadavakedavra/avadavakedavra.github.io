import { schools, Stream } from "@/app/data/schools";
import SchoolCard from "@/app/components/SchoolCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const streamMap: Record<string, Stream> = {
  'science': 'Science',
  'commerce': 'Commerce',
  'humanities': 'Humanities',
  'vocational': 'Vocational',
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
    description: `${count} schools near Vatanappally offering Plus Two ${s} stream. Compare CBSE and Kerala State Board options for ${s}.`,
  };
}

export default async function StreamPage({ params }: { params: Promise<{ stream: string }> }) {
  const { stream } = await params;
  const s = streamMap[stream];
  if (!s) notFound();
  const filtered = schools.filter(sc => sc.streams.includes(s)).sort((a, b) => a.distanceFromVatanappally - b.distanceFromVatanappally);
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>{s} Stream Schools Near Vatanappally</h1>
      <p className="text-gray-600 mb-8">{filtered.length} schools offering Plus Two {s} within 15km of Vatanappally.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(sc => <SchoolCard key={sc.id} school={sc} />)}
      </div>
    </div>
  );
}
