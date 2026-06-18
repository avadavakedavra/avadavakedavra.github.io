import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plus Two Admissions in Kerala | HSCAP Guide for Vatanappally Students",
  description: "Complete guide to Plus One and Plus Two admissions in Kerala. HSCAP, school allotment, documents required, and how to apply near Vatanappally.",
};

const sections = [
  {title:"What is HSCAP?",body:"HSCAP (Higher Secondary Centralised Allotment Process) is Kerala's centralized system for Plus One admissions to government and aided schools. Students apply online and allotment is based on SSLC or Class 10 marks combined with school and stream preferences.",accent:'var(--lime-2)'},
  {title:"HSCAP Timeline",items:["May: SSLC results announced","May–June: HSCAP registration opens online","June: First allotment published on portal","June–July: Supplementary allotments for remaining seats","July: Classes begin for Plus One"],accent:'var(--blue)'},
  {title:"How to Apply via HSCAP",items:["Visit hscap.kerala.gov.in during the registration window","Fill in personal details and SSLC / Class 10 marks","Select up to 20 school–stream combinations in order of preference","Pay ₹25 registration fee online","Track allotment status on the portal and confirm admission"],accent:'var(--grn)'},
  {title:"Documents Required",items:["SSLC mark list / Transfer Certificate from school","Community certificate (for reservation benefits)","Aadhaar card copy","Recent passport-sized photographs","Income certificate (for fee concession, if applicable)"],accent:'var(--amb)'},
  {title:"CBSE School Admissions",body:"CBSE schools each run their own admission process. Kendriya Vidyalayas follow the KV admission portal. Unaided CBSE schools typically admit based on Class 10 marks or their own entrance test. Contact each school directly for cut-offs and dates.",accent:'var(--lime-2)'},
  {title:"Kerala State vs CBSE",body:"Kerala State Board follows a 60+20+20 pattern (theory + practical + CE). CBSE has board exams with internal assessments. For NEET and JEE aspirants, CBSE syllabi are closely aligned with entrance exam patterns. Kerala State is also competitive — many top NEET scorers study state board. Supplement with structured coaching regardless of your board.",accent:'var(--red)'},
];

export default function AdmissionsPage() {
  return (<>
    <section style={{background:'var(--ink)',borderBottom:'3px solid var(--lime)',padding:'56px 40px',position:'relative',overflow:'hidden'}}>
      <div className="hero-grid"/>
      <div style={{maxWidth:'1280px',margin:'0 auto',position:'relative',zIndex:1}}>
        <div className="kicker"><span className="kicker-rule"/><span className="kicker-text">Admissions Guide</span></div>
        <h1 style={{fontSize:'clamp(28px,4vw,52px)',fontWeight:800,letterSpacing:'-2px',color:'#fff',lineHeight:.95,marginBottom:'12px'}}>
          Plus Two <em style={{fontStyle:'italic',fontWeight:300,color:'var(--lime)'}}>admissions guide</em>
        </h1>
        <p style={{fontSize:'14px',color:'rgba(255,255,255,.4)'}}>Everything you need to know about HSE admissions in Kerala for students near Vatanappally.</p>
      </div>
    </section>
    <div style={{maxWidth:'1280px',margin:'0 auto',padding:'48px 40px'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'12px',marginBottom:'48px'}}>
        {sections.map(section=>(
          <div key={section.title} style={{background:'var(--white)',border:'1.5px solid var(--cream-3)',borderLeft:`4px solid ${section.accent}`,borderRadius:'4px',padding:'28px',boxShadow:'var(--sh)'}}>
            <div style={{fontSize:'10px',fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--pale)',marginBottom:'10px'}}>Guide</div>
            <h2 style={{fontSize:'16px',fontWeight:800,color:'var(--ink)',marginBottom:'14px',letterSpacing:'-.3px'}}>{section.title}</h2>
            {'body' in section && <p style={{fontSize:'13px',color:'var(--muted)',lineHeight:1.75}}>{section.body}</p>}
            {'items' in section && <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'8px'}}>
              {(section as {items:string[]}).items.map(item=>(
                <li key={item} style={{display:'flex',alignItems:'flex-start',gap:'10px',fontSize:'13px',color:'var(--muted)',lineHeight:1.65}}>
                  <span style={{color:'var(--lime-2)',fontWeight:800,flexShrink:0,marginTop:'1px'}}>→</span>{item}
                </li>
              ))}
            </ul>}
          </div>
        ))}
      </div>
      <div style={{background:'var(--ink)',borderTop:'3px solid var(--lime)',borderRadius:'4px',padding:'48px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-80px',right:'-80px',width:'300px',height:'300px',borderRadius:'50%',background:'radial-gradient(circle,rgba(139,197,63,.12),transparent 65%)',pointerEvents:'none'}}/>
        <h2 style={{fontSize:'28px',fontWeight:800,letterSpacing:'-1px',color:'#fff',marginBottom:'12px'}}>Start Your Plus Two Journey Right</h2>
        <p style={{fontSize:'14px',color:'rgba(255,255,255,.4)',marginBottom:'24px',lineHeight:1.8}}>SEHR Academy in Vatanappally helps Plus Two Science students master Physics, Chemistry, Biology and Maths — from day one of the academic year.</p>
        <a href="https://sehracademy.com" className="btn-lime" style={{fontSize:'14px',padding:'14px 28px'}}>Learn About SEHR Academy →</a>
      </div>
    </div>
  </>);
}
