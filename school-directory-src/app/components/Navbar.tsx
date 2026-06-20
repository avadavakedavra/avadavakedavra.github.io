import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{background:'var(--ink)',height:'64px',position:'sticky',top:0,zIndex:50,boxShadow:'0 1px 0 rgba(255,255,255,.06)'}}>
      <div style={{maxWidth:'1280px',margin:'0 auto',padding:'0 40px',height:'100%',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:'12px',textDecoration:'none'}}>
          <span style={{fontSize:'15px',fontWeight:800,letterSpacing:'-.3px',lineHeight:1}}>
            <span style={{color:'var(--lime)'}}>SEHR</span>
            <span style={{color:'#fff'}}> SCHOOLS</span>
          </span>
          <span style={{width:'1px',height:'14px',background:'rgba(255,255,255,.15)'}}/>
          <span style={{fontSize:'11px',fontWeight:600,color:'rgba(255,255,255,.35)',letterSpacing:'.03em'}}>Vatanappally Region</span>
        </Link>
        <div style={{display:'flex',alignItems:'center',gap:'28px'}}>
          <Link href="/schools/" className="nav-link">All Schools</Link>
          <Link href="/board/cbse/" className="nav-link">CBSE</Link>
          <Link href="/stream/science/" className="nav-link">Science</Link>
          <Link href="/admissions/" className="nav-link">Admissions</Link>
          <Link href="/compare/" className="nav-link">Compare</Link>
          <a href="https://sehracademy.com" className="btn-lime" style={{fontSize:'12px',padding:'9px 18px'}}>SEHR Academy</a>
        </div>
      </div>
    </nav>
  );
}
