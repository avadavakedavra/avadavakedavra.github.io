import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plus Two Admissions in Kerala | HSCAP Guide for Vatanappally Students",
  description: "Complete guide to Plus One and Plus Two admissions in Kerala. Understand HSCAP, school allotment, documents required, and how to apply for HSE admission near Vatanappally.",
};

const sections = [
  {
    title: "What is HSCAP?",
    body: "HSCAP (Higher Secondary Centralised Allotment Process) is Kerala's centralized system for Plus One admissions to government and aided schools. Students apply online and allotment is based on SSLC or CBSE Class 10 marks combined with school and stream preferences.",
  },
  {
    title: "HSCAP Timeline (Typical)",
    items: ["May: SSLC results announced", "May–June: HSCAP registration opens online", "June: First allotment published on portal", "June–July: Supplementary allotments for remaining seats", "June–July: Unaided school admissions (separate process)", "July: Classes begin for Plus One"],
  },
  {
    title: "How to Apply via HSCAP",
    items: ["Visit hscap.kerala.gov.in during the registration window", "Fill in personal details and SSLC / Class 10 marks", "Select up to 20 school–stream combinations in order of preference", "Pay ₹25 registration fee online", "Track allotment status on the portal and confirm admission"],
  },
  {
    title: "Documents Required",
    items: ["SSLC mark list / Transfer Certificate from school", "Community certificate (for reservation benefits)", "Aadhaar card copy", "Recent passport-sized photographs", "Income certificate (for fee concession, if applicable)"],
  },
  {
    title: "CBSE School Admissions",
    body: "CBSE schools each run their own admission process. Kendriya Vidyalayas follow the KV admission portal. Unaided CBSE schools typically admit based on Class 10 marks or their own entrance test. Contact each school directly for cut-offs and dates.",
  },
  {
    title: "Kerala State vs CBSE: Which is Right for You?",
    body: "Kerala State Board follows a 60+20+20 pattern (theory + practical + CE). CBSE has board exams with internal assessments. For NEET and JEE aspirants, CBSE syllabi are closely aligned with entrance exam patterns. Kerala State syllabus is also competitive — many top NEET scorers from Kerala study state board. Supplement with structured coaching for entrance exams regardless of your school board.",
  },
];

export default function AdmissionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Plus Two Admissions Guide</h1>
      <p className="text-gray-600 mb-10">Everything you need to know about HSE admissions in Kerala for students near Vatanappally.</p>
      <div className="space-y-6">
        {sections.map(section => (
          <div key={section.title} className="school-card p-6">
            <h2 className="font-bold text-lg mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>{section.title}</h2>
            {'body' in section && <p className="text-gray-600 leading-relaxed">{section.body}</p>}
            {'items' in section && (
              <ul className="space-y-2">
                {section.items!.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span style={{ color: 'var(--lime)' }} className="mt-0.5 font-bold shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--ink)' }} className="rounded-2xl p-8 mt-10 text-center">
        <h2 className="text-2xl font-black text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Start Your Plus Two Journey Right</h2>
        <p className="text-gray-400 mb-6">SEHR Academy in Vatanappally helps Plus Two Science students master Physics, Chemistry, Biology and Maths — from day one of the academic year.</p>
        <a href="https://sehracademy.com" className="sehr-btn text-base px-6 py-3">Learn About SEHR Academy →</a>
      </div>
    </div>
  );
}
