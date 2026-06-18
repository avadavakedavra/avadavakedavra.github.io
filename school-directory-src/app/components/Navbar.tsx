import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{ background: 'var(--ink)' }} className="sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-black text-lg tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <span style={{ color: 'var(--lime)' }}>SEHR</span>
            <span className="text-white ml-1">SCHOOLS</span>
          </span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-semibold">
          <Link href="/schools/" className="text-gray-300 hover:text-white transition-colors">All Schools</Link>
          <Link href="/admissions/" className="text-gray-300 hover:text-white transition-colors">Admissions</Link>
          <Link href="/compare/" className="text-gray-300 hover:text-white transition-colors">Compare</Link>
          <a href="https://sehracademy.com" className="sehr-btn text-sm py-1.5 px-4">SEHR Academy</a>
        </div>
      </div>
    </nav>
  );
}
