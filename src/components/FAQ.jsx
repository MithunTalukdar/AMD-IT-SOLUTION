import { useState } from 'react';

const faqs = [
  { q: "How fast can you install CCTV?", a: "For 2-4 camera kits in Kolkata, same-day installation. We do free site visit first, then install usually next day. Emergency 4-hour service available." },
  { q: "Do you give warranty and bill?", a: "Yes. GST bill + company warranty card for every product. CCTV: 1-2 years, Laptop parts: 3-12 months, Networking: 1 year service warranty." },
  { q: "What is AMC and is it worth it?", a: "Annual Maintenance Contract — fixed yearly fee, we maintain your PCs/CCTV/Network with monthly visits, priority support and parts discount. Ideal for offices; saves 30-40% vs call basis." },
  { q: "Do you charge for site visit?", a: "No. Site visit and quote are free in Kolkata / Howrah / Salt Lake / New Town. We only charge after you approve the quote." },
  { q: "Can I see CCTV on mobile?", a: "Yes. We configure Hik-Connect / Hikvision / CP Plus app on your phone, show live view, playback and motion alerts before handover." },
  { q: "Pay after service?", a: "Absolutely. No advance for standard services. Pay after installation and testing. AMC is prepaid yearly with monthly EMI option." },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="grid lg:grid-cols-2 gap-8 md:gap-10">
        <div>
          <div className="text-xs font-black tracking-[0.18em] text-[#1e4a9a]">FAQ</div>
          <h2 className="text-2xl md:text-4xl font-black text-[#0a1e40]">Frequently Asked Questions</h2>
          <p className="mt-3 text-sm text-slate-600">Still have doubts? WhatsApp us — we reply in 5 minutes.</p>

          <div className="mt-6 bg-gradient-to-br from-[#0a1e40] to-[#1e4a9a] text-white rounded-[20px] p-6">
            <div className="font-black">Need Instant Help?</div>
            <p className="text-sm text-slate-200 mt-1">Our technician will call you back in 5 minutes.</p>
            <a href="tel:+919999999999" className="mt-4 inline-flex px-5 py-2.5 bg-yellow-400 text-[#0a1e40] font-black rounded-full">Call +91 99999 99999 →</a>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> 12 experts online now
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className={`border rounded-2xl overflow-hidden ${open === i ? 'border-[#1e4a9a] bg-blue-50/50' : 'border-slate-200 bg-white'}`}>
              <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between p-4 text-left">
                <span className="font-bold text-sm md:text-[15px] text-[#0a1e40] pr-4">{f.q}</span>
                <span className={`w-8 h-8 rounded-full grid place-items-center font-black flex-shrink-0 ${open === i ? 'bg-[#0a1e40] text-yellow-400' : 'bg-slate-100 text-slate-600'}`}>
                  {open === i ? '−' : '+'}
                </span>
              </button>
              {open === i && <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
