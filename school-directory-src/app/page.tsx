import Link from "next/link";
import { schools, towns } from "@/app/data/schools";
import SchoolCard from "@/app/components/SchoolCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schools Directory — Vatanappally, Chavakkad & Coastal Thrissur",
  description: "Complete directory of high schools and higher secondary schools in Vatanappally, Chavakkad, Triprayar, Nattika, Thalikulam, Engandiyur and surrounding coastal Thrissur panchayaths.",
};

export default function Home() {
  const cbse = schools.filter(s => s.board.includes('CBSE')).length;
  const kerala = schools.filter(s => s.board.includes('Kerala State')).length;
  const plusTwo = schools.filter(s => s.plusTwo).length;
  const featured = schools.filter(s => s.plusTwo).slice(0, 6);

  return (<>
    {/* Hero */}
    <section style={{background:'var(--ink)',borderBottom:'3px solid var(--lime)',position:'relative',overflow:'hidden'}}>
      <div className="hero-grid"/>
      <div className="hero-glow"/>
      <div className="hero-wm">SCHOOLS</div>
      <div style={{maxWidth:'1280px',margin:'0 auto',padding:'100px 40px 90px',position:'relative',zIndex:1}}>
        <div className="kicker"><span className="kicker-rule"/><span className="kicker-text">Coastal Thrissur · Kerala</span></div>
        <h1 style={{fontSize:'clamp(38px,5.5vw,76px)',fontWeight:800,letterSpacing:'-2.5px',color:'#fff',lineHeight:.92,marginBottom:'20px',maxWidth:'720px'}}>
          Schools in<br/><em style={{fontStyle:'italic',fontWeight:300,color:'var(--lime)'}}>Vatanappally region</em>
        </h1>
        <p style={{fontSize:'16px',color:'rgba(255,255,255,.45)',maxWidth:'520px',lineHeight:1.8,marginBottom:'36px'}}>
          Every high school and higher secondary school across {towns.length} panchayaths in the coastal Thrissur belt — CBSE and Kerala State Board, sorted by location.
        </p>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
          <Link href="/schools/" className="btn-lime">Browse All Schools →</Link>
          <Link href="/admissions/" className="btn-ghost">Admissions Guide</Link>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section style={{background:'var(--white)',borderBottom:'1.5px solid var(--cream-3)',boxShadow:'var(--sh)'}}>
      <div style={{maxWidth:'1280px',margin:'0 auto',padding:'0 40px',display:'grid',gridTemplateColumns:'repeat(4,1fr)'}}>
        {[{value:schools.length,label:'Schools Listed'},{value:plusTwo,label:'Offer Plus Two'},{value:cbse,label:'CBSE Schools'},{value:towns.length,label:'Locations'}].map((s,i)=>(
          <div key={s.label} style={{padding:'28px 24px',borderRight:i<3?'1px solid var(--rule)':'none'}}>
            <div style={{fontSize:'36px',fontWeight:800,letterSpacing:'-1.5px',color:'var(--ink)',lineHeight:1,marginBottom:'4px'}}>{s.value}</div>
            <div style={{fontSize:'9px',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--pale)'}}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Browse by location */}
    <section style={{maxWidth:'1280px',margin:'0 auto',padding:'72px 40px'}}>
      <div className="kicker"><span className="kicker-rule"/><span className="kicker-text">Browse by Location</span></div>
      <h2 className="section-h2">Schools by <em>panchayath</em></h2>
      <p className="section-sub">Select a location to see all schools in that area.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px',marginBottom:'64px'}}>
        {towns.map(town => {
          const count = schools.filter(s => s.town === town).length;
          return (
            <Link key={town} href={`/location/${town.toLowerCase().replace(/ /g,'-')}/`} className="browse-card" style={{borderLeft:'4px solid var(--lime)'}}>
              <div className="browse-card-num">{count}</div>
              <div className="browse-card-label">{town}</div>
              <div className="browse-card-desc">{count === 1 ? '1 school' : `${count} schools`}</div>
            </Link>
          );
        })}
      </div>

      <div className="sdiv"><span className="sdiv-r"/><span className="sdiv-d"/><span className="sdiv-t">All Schools</span><span className="sdiv-r"/></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'32px'}}>
        {featured.map(s=><SchoolCard key={s.id} school={s}/>)}
      </div>
      <div style={{textAlign:'center'}}>
        <Link href="/schools/" className="btn-lime">View All {schools.length} Schools →</Link>
      </div>
    </section>

    {/* Browse by board/stream */}
    <section style={{background:'var(--white)',borderTop:'1.5px solid var(--cream-3)',borderBottom:'1.5px solid var(--cream-3)'}}>
      <div style={{maxWidth:'1280px',margin:'0 auto',padding:'64px 40px'}}>
        <div className="kicker"><span className="kicker-rule"/><span className="kicker-text">By Board & Stream</span></div>
        <h2 className="section-h2">Filter by <em>board or stream</em></h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'10px',marginTop:'32px'}}>
          {[
            {href:'/board/cbse/',label:'CBSE',count:cbse,accent:'var(--blue)'},
            {href:'/board/kerala-state/',label:'Kerala State',count:kerala,accent:'var(--lime-2)'},
            {href:'/stream/science/',label:'Science',count:schools.filter(s=>s.streams.includes('Science')).length,accent:'var(--amb)'},
            {href:'/stream/commerce/',label:'Commerce',count:schools.filter(s=>s.streams.includes('Commerce')).length,accent:'var(--blue)'},
            {href:'/stream/humanities/',label:'Humanities',count:schools.filter(s=>s.streams.includes('Humanities')).length,accent:'var(--red)'},
          ].map(item=>(
            <Link key={item.href} href={item.href} className="browse-card" style={{borderLeft:`4px solid ${item.accent}`}}>
              <div className="browse-card-num">{item.count}</div>
              <div className="browse-card-label">{item.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="dark-sec">
      <div className="hero-grid"/>
      <div style={{position:'absolute',top:'-100px',right:'-100px',width:'400px',height:'400px',borderRadius:'50%',background:'radial-gradient(circle,rgba(139,197,63,.12),transparent 65%)',pointerEvents:'none'}}/>
      <div style={{maxWidth:'1280px',margin:'0 auto',padding:'72px 40px',position:'relative',zIndex:1,display:'grid',gridTemplateColumns:'1fr auto',gap:'40px',alignItems:'center'}}>
        <div>
          <div className="kicker"><span className="kicker-rule"/><span className="kicker-text">SEHR Academy · Vatanappally</span></div>
          <h2 style={{fontSize:'clamp(24px,3.5vw,44px)',fontWeight:800,letterSpacing:'-1.5px',color:'#fff',lineHeight:.95,marginBottom:'14px'}}>
            Preparing for <em style={{fontStyle:'italic',fontWeight:300,color:'var(--lime)'}}>Plus Two Science?</em>
          </h2>
          <p style={{fontSize:'15px',color:'rgba(255,255,255,.45)',lineHeight:1.8,maxWidth:'480px'}}>
            SEHR Academy offers expert coaching in Physics, Chemistry, Biology and Mathematics for students across all local schools — right here in Vatanappally.
          </p>
        </div>
        <a href="https://sehracademy.com" className="btn-lime" style={{fontSize:'14px',padding:'16px 28px'}}>Visit SEHR Academy →</a>
      </div>
    </section>
  </>);
}
