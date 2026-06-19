import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{background:'var(--ink-2)',borderTop:'3px solid var(--lime)',marginTop:'80px'}}>
      <div style={{maxWidth:'1280px',margin:'0 auto',padding:'64px 40px 40px'}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:'48px',marginBottom:'48px'}}>
          <div>
            <div style={{fontSize:'18px',fontWeight:800,marginBottom:'12px',letterSpacing:'-.3px'}}>
              <span style={{color:'var(--lime)'}}>SEHR</span><span style={{color:'#fff'}}> SCHOOLS</span>
            </div>
            <p style={{fontSize:'13px',color:'rgba(255,255,255,.4)',lineHeight:1.8,maxWidth:'320px',marginBottom:'20px'}}>
              A comprehensive guide to schools in the Vatanappally and Thrissur region of Kerala.
            </p>
            <a href="https://sehracademy.com" style={{fontSize:'12px',color:'var(--lime-2)',fontWeight:700,textDecoration:'none'}}>by SEHR Academy →</a>
          </div>
          <div>
            <div style={{fontSize:'10px',fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'rgba(255,255,255,.3)',marginBottom:'16px'}}>Browse</div>
            <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'10px'}}>
              <li><Link href="/schools/" className="footer-link">All Schools</Link></li>
              <li><Link href="/board/cbse/" className="footer-link">CBSE Schools</Link></li>
              <li><Link href="/board/kerala-state/" className="footer-link">Kerala State Board</Link></li>
              <li><Link href="/stream/science/" className="footer-link">Science Stream</Link></li>
              <li><Link href="/stream/commerce/" className="footer-link">Commerce Stream</Link></li>
            </ul>
          </div>
          <div>
            <div style={{fontSize:'10px',fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'rgba(255,255,255,.3)',marginBottom:'16px'}}>Resources</div>
            <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'10px'}}>
              <li><Link href="/admissions/" className="footer-link">Admissions Guide</Link></li>
              <li><Link href="/compare/" className="footer-link">Compare Schools</Link></li>
              <li><Link href="/stream/humanities/" className="footer-link">Humanities Stream</Link></li>
              <li><Link href="/stream/vocational/" className="footer-link">Vocational Stream</Link></li>
            </ul>
          </div>
        </div>
        <div style={{borderTop:'1px solid rgba(255,255,255,.08)',paddingTop:'24px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <p style={{fontSize:'12px',color:'rgba(255,255,255,.2)'}}>© {new Date().getFullYear()} SEHR Schools Directory · Vatanappally, Thrissur, Kerala</p>
          <p style={{fontSize:'12px',color:'rgba(255,255,255,.2)'}}>Part of <a href="https://sehracademy.com" style={{color:'var(--lime-2)',fontWeight:700,textDecoration:'none'}}>SEHR Academy</a></p>
        </div>
      </div>
    </footer>
  );
}
