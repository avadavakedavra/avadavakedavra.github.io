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
      <section style={{ background: 'var(--ink)' }} className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-bold tracking-widest mb-4" style={{ color: 'var(--lime)' }}>VATANAPPALLY · THRISSUR · KERALA</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Find the Right School<br />
            <span style={{ color: 'var(--lime)' }}>in Your Region</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Comprehensive directory of {schools.length} schools within 15km of Vatanappally — CBSE, Kerala State, Plus Two streams, facilities and admission info in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/schools/" className="sehr-btn text-base px-6 py-3">Browse All Schools →</Link>
            <Link href="/admissions/" style={{ background: 'rgba(139,197,63,.15)', color: 'var(--lime)', border: '1px solid rgba(139,197,63,.4)' }} className="text-base px-6 py-3 rounded-lg font-bold">Admission Guide</Link>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--cream-2)' }} className="py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: schools.length, label: 'Schools Listed' },
            { value: cbse, label: 'CBSE Schools' },
            { value: kerala, label: 'Kerala State Schools' },
            { value: schools.filter(s => s.plusTwo).length, label: 'Offer Plus Two' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-black" style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--lime)' }}>{s.value}</div>
              <div className="text-sm text-gray-600 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-black mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>Browse by Board & Stream</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {[
            { href: '/board/cbse/', label: 'CBSE Schools', count: cbse, bg: '#dbeafe', color: '#1e40af' },
            { href: '/board/kerala-state/', label: 'Kerala State Board', count: kerala, bg: '#dcfce7', color: '#166534' },
            { href: '/stream/science/', label: 'Science Stream', count: schools.filter(s => s.streams.includes('Science')).length, bg: '#fef9c3', color: '#713f12' },
            { href: '/stream/commerce/', label: 'Commerce Stream', count: schools.filter(s => s.streams.includes('Commerce')).length, bg: '#e0f2fe', color: '#0369a1' },
            { href: '/stream/humanities/', label: 'Humanities Stream', count: schools.filter(s => s.streams.includes('Humanities')).length, bg: '#fce7f3', color: '#9d174d' },
            { href: '/compare/', label: 'Compare Schools', count: null, bg: 'var(--cream-2)', color: 'var(--ink)' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ background: item.bg, color: item.color }} className="rounded-xl p-5 font-bold hover:opacity-90 transition-opacity block">
              <div className="text-2xl font-black mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{item.count ?? '→'}</div>
              <div className="text-sm">{item.label}</div>
            </Link>
          ))}
        </div>

        <h2 className="text-2xl font-black mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Closest Schools to Vatanappally</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featured.map(s => <SchoolCard key={s.id} school={s} />)}
        </div>
        <div className="text-center">
          <Link href="/schools/" className="sehr-btn">View All {schools.length} Schools →</Link>
        </div>
      </section>

      <section style={{ background: 'var(--ink)' }} className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-bold tracking-widest mb-3" style={{ color: 'var(--lime)' }}>SEHR ACADEMY · VATANAPPALLY</p>
          <h2 className="text-3xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Preparing for Plus Two?</h2>
          <p className="text-gray-300 mb-6">SEHR Academy offers expert coaching for Science stream students in Physics, Chemistry, Biology and Mathematics — right here in Vatanappally.</p>
          <a href="https://sehracademy.com" className="sehr-btn text-base px-6 py-3">Learn More at SEHR Academy →</a>
        </div>
      </section>
    </>
  );
}
