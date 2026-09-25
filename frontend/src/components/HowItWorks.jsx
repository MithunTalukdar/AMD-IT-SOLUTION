export default function HowItWorks() {
  const steps = [
    { n: "01", t: "Book Online or Call", d: "Choose service, date & location. No advance payment.", icon: "📅" },
    { n: "02", t: "Free Site Visit", d: "Engineer visits, surveys & gives transparent quote.", icon: "👷" },
    { n: "03", t: "Install & Configure", d: "Genuine parts, clean wiring, mobile app setup.", icon: "🔧" },
    { n: "04", t: "Warranty & Support", d: "Bill + warranty card + 24/7 WhatsApp support.", icon: "🛡️" },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="text-center">
        <div className="text-xs font-black tracking-[0.18em] text-[#1e4a9a]">HOW IT WORKS</div>
        <h2 className="text-2xl md:text-4xl font-black text-[#0a1e40]">Get Service in 4 Easy Steps</h2>
      </div>

      <div className="mt-8 grid md:grid-cols-4 gap-4 md:gap-6 relative">
        {/* connector line desktop */}
        <div className="hidden md:block absolute top-[52px] left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-yellow-400 via-blue-300 to-yellow-400 opacity-60" />
        {steps.map(s => (
          <div key={s.n} className="relative bg-white rounded-[18px] border border-slate-200 p-5 md:p-6 text-center shadow-sm">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[#0a1e40] text-yellow-400 grid place-items-center text-xl font-black shadow">{s.icon}</div>
            <div className="mt-3 inline-flex w-8 h-8 rounded-full bg-yellow-400 text-[#0a1e40] font-black text-xs items-center justify-center">{s.n}</div>
            <h3 className="mt-2 font-black text-[#0a1e40]">{s.t}</h3>
            <p className="mt-1 text-xs md:text-sm text-slate-600 leading-relaxed">{s.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="font-bold text-[#0a1e40] flex items-center gap-2"> <span className="w-8 h-8 bg-yellow-400 rounded-full grid place-items-center">⏱</span> Average response time: <span className="text-amber-700">2 Hours</span> • Same-day installation</div>
        <a href="#quick-book" className="px-5 py-2.5 bg-[#0a1e40] text-white font-bold rounded-full">Book Free Visit →</a>
      </div>
    </section>
  );
}
