import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Vatanappally Schools Directory | Best Schools in Thrissur",
  description: "Comprehensive directory of schools in Vatanappally and the surrounding 15km region in Thrissur, Kerala. Find CBSE, Kerala State schools with Plus Two Science, Commerce and Humanities streams.",
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400&display=swap" rel="stylesheet"/>
        <style dangerouslySetInnerHTML={{__html:`
          :root{
            --cream:#f5f2eb;--cream-2:#ede9e0;--cream-3:#e4dfd4;
            --white:#fdfcfa;
            --ink:#1a1a18;--ink-2:#2e2e2b;--ink-3:#4a4a46;
            --muted:#7a7970;--pale:#b0ada4;--rule:#d8d4cb;
            --lime:#8BC53F;--lime-2:#72a530;--lime-3:#5e8a24;
            --lime-bg:#f0f7e3;--lime-mid:#c8e48e;
            --red:#dc2626;--amb:#d97706;--blue:#2563eb;--grn:#16a34a;
            --f:'Open Sans',sans-serif;
            --ease:cubic-bezier(.22,1,.36,1);
            --sh:0 2px 8px rgba(0,0,0,.05),0 1px 2px rgba(0,0,0,.04);
            --sh2:0 6px 24px rgba(0,0,0,.08),0 2px 6px rgba(0,0,0,.04);
            --sh3:0 20px 60px rgba(0,0,0,.1),0 4px 14px rgba(0,0,0,.06);
          }
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          html{-webkit-font-smoothing:antialiased;scroll-behavior:smooth}
          body{font-family:var(--f);background:var(--cream);color:var(--ink);font-size:15px;line-height:1.6;overflow-x:hidden}
          a{text-decoration:none;color:inherit}
          .btn-lime{display:inline-flex;align-items:center;gap:8px;padding:13px 24px;border-radius:4px;background:var(--lime);color:var(--ink);font-family:var(--f);font-size:13px;font-weight:800;border:none;cursor:pointer;transition:all .2s var(--ease);box-shadow:0 4px 18px rgba(139,197,63,.35);text-decoration:none;white-space:nowrap}
          .btn-lime:hover{background:var(--lime-2);transform:translateY(-2px);box-shadow:0 8px 24px rgba(139,197,63,.45)}
          .btn-ghost{display:inline-flex;align-items:center;gap:8px;padding:13px 24px;border-radius:4px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.15);font-family:var(--f);font-size:13px;font-weight:700;cursor:pointer;transition:all .2s var(--ease);text-decoration:none;white-space:nowrap}
          .btn-ghost:hover{background:rgba(255,255,255,.14);color:#fff;border-color:rgba(255,255,255,.3)}
          .kicker{display:flex;align-items:center;gap:10px;margin-bottom:14px}
          .kicker-rule{width:22px;height:2px;background:var(--lime);flex-shrink:0}
          .kicker-text{font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--lime-2)}
          .section-h2{font-size:clamp(28px,4vw,48px);font-weight:800;letter-spacing:-1.5px;color:var(--ink);line-height:.95;margin-bottom:12px}
          .section-h2 em{font-style:italic;font-weight:300;color:var(--lime)}
          .section-sub{font-size:15px;color:var(--muted);max-width:520px;line-height:1.75;margin-bottom:48px}
          .sdiv{display:flex;align-items:center;gap:14px;margin:0 0 32px}
          .sdiv-r{flex:1;height:1px;background:var(--rule)}
          .sdiv-d{width:5px;height:5px;border-radius:50%;background:var(--lime);flex-shrink:0}
          .sdiv-t{font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--pale);white-space:nowrap}
          .school-card{background:var(--white);border:1.5px solid var(--cream-3);border-left:4px solid var(--lime);border-radius:4px;box-shadow:var(--sh);transition:all .22s var(--ease);overflow:hidden}
          .school-card:hover{transform:translateY(-4px);box-shadow:var(--sh2)}
          .chip{display:inline-block;font-size:9px;font-weight:700;padding:3px 8px;border-radius:3px;letter-spacing:.1em;text-transform:uppercase;border:1px solid var(--rule)}
          .chip-cbse{background:#dbeafe;color:#1e40af;border-color:#bfdbfe}
          .chip-kerala{background:var(--lime-bg);color:var(--lime-3);border-color:var(--lime-mid)}
          .chip-science{background:#fef9c3;color:#713f12;border-color:#fde68a}
          .chip-commerce{background:#e0f2fe;color:#0369a1;border-color:#bae6fd}
          .chip-humanities{background:#fce7f3;color:#9d174d;border-color:#fbcfe8}
          .chip-vocational{background:#f3e8ff;color:#6b21a8;border-color:#e9d5ff}
          .chip-type{background:var(--cream-2);color:var(--muted);border-color:var(--rule)}
          .hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04)1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04)1px,transparent 1px);background-size:48px 48px;pointer-events:none}
          .hero-glow{position:absolute;top:-160px;right:-160px;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(139,197,63,.18),transparent 65%);pointer-events:none}
          .hero-wm{position:absolute;right:-20px;bottom:-10px;font-size:clamp(100px,14vw,220px);font-weight:800;letter-spacing:-8px;color:rgba(255,255,255,.03);pointer-events:none;user-select:none;line-height:1;z-index:0;white-space:nowrap}
          .dark-sec{background:var(--ink);border-top:3px solid var(--lime);position:relative;overflow:hidden}
          .browse-card{background:var(--white);border:1.5px solid var(--cream-3);border-radius:4px;padding:24px 22px;box-shadow:var(--sh);transition:all .22s var(--ease);display:block;text-decoration:none}
          .browse-card:hover{transform:translateY(-4px);box-shadow:var(--sh2)}
          .browse-card-num{font-size:36px;font-weight:800;letter-spacing:-1.5px;color:var(--ink);line-height:1;margin-bottom:6px}
          .browse-card-label{font-size:14px;font-weight:800;color:var(--ink);margin-bottom:6px}
          .browse-card-desc{font-size:12px;color:var(--muted);line-height:1.6}
          .nav-link{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.55);text-decoration:none;transition:color .15s}
          .nav-link:hover{color:#fff}
          .footer-link{font-size:13px;color:rgba(255,255,255,.45);font-weight:600;text-decoration:none;transition:color .15s}
          .footer-link:hover{color:#fff}
        `}}/>
      </head>
      <body>
        <Navbar/>
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
