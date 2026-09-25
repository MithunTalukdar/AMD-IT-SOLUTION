export default function WhyChooseUs() {
  const points = [
    { icon: "🎖️", title: "12+ Years Experience", desc: "5000+ successful installations across WB" },
    { icon: "👨‍🔧", title: "Certified Engineers", desc: "Govt. certified, police-verified team" },
    { icon: "💰", title: "Transparent Pricing", desc: "No hidden charges. Quote before work" },
    { icon: "⚡", title: "2-Hour Response", desc: "Same-day service in Kolkata metro" },
    { icon: "🧾", title: "GST Bill + Warranty", desc: "Proper invoice & warranty card" },
    { icon: "🤝", title: "24/7 WhatsApp Support", desc: "After-service support always on" },
  ];
  return (
    <section className="bg-[#0a1e40] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 grid lg:grid-cols-2 gap-8 md:gap-10 items-center">
        <div>
          <div className="inline-flex bg-yellow-400 text-[#0a1e40] font-black text-xs px-3 py-1 rounded-full">WHY AMD IT SOLUTION</div>
          <h2 className="mt-3 text-2xl md:text-4xl font-black leading-tight">Why Businesses <span className="text-yellow-400">Trust Us</span></h2>
          <p className="mt-3 text-sm md:text-base text-slate-300 max-w-xl">We don’t just install — we become your long-term technology partner. From small shops to large offices.</p>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {points.map(p => (
              <div key={p.title} className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-400 text-[#0a1e40] grid place-items-center text-lg">{p.icon}</div>
                <div className="mt-3 font-black text-sm">{p.title}</div>
                <div className="text-xs text-slate-300 mt-1">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="bg-white rounded-[24px] p-4 md:p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] text-slate-800">
            <div className="flex items-center gap-3">
              <img src="https://i.pravatar.cc/100?img=12" className="w-12 h-12 rounded-full object-cover" alt="founder" />
              <div>
                <div className="font-black">Mithun Talukdar</div>
                <div className="text-xs text-slate-500">Founder, AMD IT SOLUTION</div>
              </div>
              <span className="ml-auto bg-[#0a1e40] text-yellow-400 text-xs font-black px-3 py-1 rounded-full">Since 2012</span>
            </div>
            <blockquote className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm leading-relaxed">
              “Our promise is simple — genuine products, clean workmanship and honest pricing. We are available on call even after 2 years of installation. That’s why 78% of our business is repeat & referral.”
            </blockquote>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="bg-amber-50 border border-amber-200 rounded-xl py-3"><div className="font-black text-[#0a1e40]">4.9★</div><div className="text-[11px]">Google Rating</div></div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl py-3"><div className="font-black text-[#0a1e40]">5000+</div><div className="text-[11px]">Happy Clients</div></div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl py-3"><div className="font-black text-emerald-700">98%</div><div className="text-[11px]">Retention</div></div>
            </div>
          </div>

          <div className="hidden md:block absolute -bottom-6 -left-6 bg-yellow-400 text-[#0a1e40] rounded-2xl px-5 py-3 shadow-xl">
            <div className="font-black">✓ Certified Partner</div>
            <div className="text-xs font-bold">Hikvision • CP Plus • TP-Link</div>
          </div>
        </div>
      </div>
    </section>
  );
}
