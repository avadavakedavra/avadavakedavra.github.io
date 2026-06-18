import { schools } from "@/app/data/schools";
import SchoolCard from "@/app/components/SchoolCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Schools Near Vatanappally | Thrissur Schools Directory",
  description: "Browse all 23 schools within 15km of Vatanappally, Thrissur. CBSE and Kerala State Board schools with Plus Two Science, Commerce and Humanities.",
};

export default function SchoolsPage() {
  const sorted = [...schools].sort((a, b) => a.distanceFromVatanappally - b.distanceFromVatanappally);
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>All Schools Near Vatanappally</h1>
      <p className="text-gray-600 mb-6">Showing {schools.length} schools within 15km radius, sorted by distance.</p>
      <div className="flex flex-wrap gap-2 mb-8">
        <a href="/board/cbse/" className="chip chip-cbse py-1.5 px-3">CBSE ({schools.filter(s=>s.board.includes('CBSE')).length})</a>
        <a href="/board/kerala-state/" className="chip chip-kerala py-1.5 px-3">Kerala State ({schools.filter(s=>s.board.includes('Kerala State')).length})</a>
        <a href="/stream/science/" className="chip chip-science py-1.5 px-3">Science</a>
        <a href="/stream/commerce/" className="chip chip-commerce py-1.5 px-3">Commerce</a>
        <a href="/stream/humanities/" className="chip chip-humanities py-1.5 px-3">Humanities</a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map(s => <SchoolCard key={s.id} school={s} />)}
      </div>
    </div>
  );
}
