import { schools } from "@/app/data/schools";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Schools Near Vatanappally | CBSE vs Kerala State Board",
  description: "Compare top schools near Vatanappally, Thrissur side by side. Board, streams, facilities, distance and more.",
};

export default function ComparePage() {
  const top8=[...schools].sort((a,b)=>a.distanceFromVatanappally-b.distanceFromVatanappally).slice(0,8);
  const sCls=(s:string)=>({Science:'chip-science',Commerce:'chip-commerce',Humanities:'chip-humanities',Vocational:'chip-vocational'}[s]||'chip-type');
  return (<>
    <section style={{background:'var(--ink)',borderBottom:'3px solid var(--lime)',padding:'56px 40px',position:'relative',overflow:'hidden'}}>
      <div className="hero-grid"/>
      <div style={{maxWidth:'1280px',margin:'0 auto',position:'relative',zIndex:1}}>
        <div className="kicker"><span className="kicker-rule"/><span className="kicker-text">Compare</span></div>
        <h1 style={{fontSize:'clamp(28px,4vw,52px)',fontWeight:800,letterSpacing:'-2px',color:'#fff',lineHeight:.95,marginBottom:'12px'}}>
          Compare schools <em style={{fontStyle:'italic',fontWeight:300,color:'var(--lime)'}}>side by side</em>
        </h1>
        <p style={{fontSize:'14px',color:'rgba(255,255,255,.4)'}}>8 closest schools to Vatanappally compared by board, streams, medium and type.</p>
      </div>
    </section>
    <div style={{maxWidth:'1280px',margin:'0 auto',padding:'48px 40px'}}>
      <div style={{background:'var(--white)',border:'1.5px solid var(--cream-3)',borderRadius:'4px',boxShadow:'var(--sh)',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
          <thead>
            <tr style={{background:'var(--ink)'}}>
              {['School','Distance','Board','Streams','Medium','Type'].map(h=>(
                <th key={h} style={{padding:'14px 16px',textAlign:h==='School'?'left':'center',fontSize:'9px',fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'rgba(255,255,255,.5)'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {top8.map((s,i)=>(
              <tr key={s.id} style={{background:i%2===0?'var(--white)':'var(--cream)',borderBottom:'1px solid var(--rule)'}}>
                <td style={{padding:'16px',borderRight:'1px solid var(--rule)'}}>
                  <a href={`/schools/${s.slug}/`} style={{fontSize:'13px',fontWeight:800,color:'var(--ink)',letterSpacing:'-.2px',display:'block',marginBottom:'3px'}}>{s.name}</a>
                  <span style={{fontSize:'11px',color:'var(--muted)',fontWeight:600}}>{s.town}</span>
                </td>
                <td style={{padding:'16px',textAlign:'center',fontSize:'13px',fontWeight:800,color:'var(--lime-2)'}}>{s.distanceFromVatanappally} km</td>
                <td style={{padding:'16px',textAlign:'center'}}>
                  {s.board.map(b=>{const cls=b==='CBSE'?'chip-cbse':'chip-kerala';return <span key={b} className={`chip ${cls}`} style={{display:'block',marginBottom:'3px'}}>{b}</span>;})}
                </td>
                <td style={{padding:'16px'}}>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'3px',justifyContent:'center'}}>
                    {s.streams.map(st=><span key={st} className={`chip ${sCls(st)}`}>{st}</span>)}
                  </div>
                </td>
                <td style={{padding:'16px',textAlign:'center',fontSize:'12px',fontWeight:700,color:'var(--muted)'}}>{s.medium}</td>
                <td style={{padding:'16px',textAlign:'center',fontSize:'11px',fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.05em'}}>{s.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>);
}
