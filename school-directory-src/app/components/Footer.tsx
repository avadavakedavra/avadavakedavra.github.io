import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: '#9ca3af' }} className="mt-20 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="font-black text-xl mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <span style={{ color: 'var(--lime)' }}>SEHR</span>
              <span className="text-white ml-1">SCHOOLS</span>
            </div>
            <p className="text-sm leading-relaxed">Your guide to schools in the Vatanappally and Thrissur region of Kerala.</p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-3">Browse</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/schools/" className="hover:text-white transition-colors">All Schools</Link></li>
              <li><Link href="/board/cbse/" className="hover:text-white transition-colors">CBSE Schools</Link></li>
              <li><Link href="/board/kerala-state/" className="hover:text-white transition-colors">Kerala State Schools</Link></li>
              <li><Link href="/stream/science/" className="hover:text-white transition-colors">Science Stream</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-3">SEHR Academy</h3>
            <p className="text-sm leading-relaxed mb-3">Expert tuition for Plus Two Science students in Vatanappally. Trusted by hundreds of families.</p>
            <a href="https://sehracademy.com" className="sehr-btn text-sm">Visit SEHR Academy →</a>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-xs text-center">
          © {new Date().getFullYear()} SEHR Schools Directory · Vatanappally, Thrissur, Kerala
        </div>
      </div>
    </footer>
  );
}
