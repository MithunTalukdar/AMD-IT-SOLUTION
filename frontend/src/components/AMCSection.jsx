export default function AMCSection() {
  const plans = [
    { name: "Basic", price: "₹4,999", period: "/yr", for: "Shop / Small Office", features: ["4 Preventive Visits", "Phone & Remote Support", "Cleaning & Health Check", "10% Parts Discount"], cta: "Choose Basic", popular: false },
    { name: "Professional", price: "₹9,999", period: "/yr", for: "Mid Office (10-30 PCs)", features: ["12 Visits (Monthly)", "Priority 2-Hr Response", "CCTV + Network Included", "20% Parts Discount", "Free Replacement Support"], cta: "Most Popular", popular: true },
    { name: "Enterprise", price: "₹19,999", period: "/yr", for: "Large Office / Warehouse", features: ["24 Visits (Twice Monthly)", "Dedicated Engineer", "24/7 WhatsApp SLA", "30% Parts Discount", "Quarterly Report"], cta: "Contact Sales", popular: false },
  ];

  return (
    <section id="amc" className="bg-[#0a1e40] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex bg-yellow-400 text-[#0a1e40] font-black text-xs px-3 py-1 rounded-full">🛡️ AMC PLANS</div>
          <h2 className="mt-3 text-2xl md:text-4xl font-black">Annual Maintenance — Sleep Without Worries</h2>
          <p className="mt-3 text-sm text-slate-300">One annual fee. Unlimited peace of mind. We maintain your computers, CCTV, printers & network so you focus on business.</p>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-5 md:gap-6 items-start">
          {plans.map(p => (
            <div key={p.name} className={`relative rounded-[20px] p-6 border ${p.popular ? 'bg-white text-slate-800 border-yellow-400 shadow-[0_20px_60px_rgba(250,204,21,0.25)] scale-[1.02]' : 'bg-white/10 backdrop-blur border-white/10'}`}>
              {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0a1e40] font-black text-xs px-4 py-1 rounded-full shadow">★ MOST POPULAR</div>}
              <div className={`font-black ${p.popular ? 'text-[#0a1e40]' : 'text-white'}`}>{p.name}</div>
              <div className="text-xs opacity-70">{p.for}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className={`text-3xl font-black ${p.popular ? 'text-[#0a1e40]' : 'text-yellow-400'}`}>{p.price}</span>
                <span className="text-sm opacity-70">{p.period}</span>
              </div>
              <ul className="mt-4 space-y-2">
                {p.features.map(f => (
                  <li key={f} className="flex gap-2 text-sm">
                    <span className={`w-5 h-5 rounded-full grid place-items-center text-xs ${p.popular ? 'bg-emerald-100 text-emerald-700' : 'bg-white/15 text-yellow-300'}`}>✓</span>
                    <span className={p.popular ? 'text-slate-700' : 'text-slate-200'}>{f}</span>
                  </li>
                ))}
              </ul>
              <a href="#contact" className={`mt-6 block text-center py-3 rounded-full font-black ${p.popular ? 'bg-[#0a1e40] text-white hover:bg-[#1e4a9a]' : 'bg-yellow-400 text-[#0a1e40] hover:bg-amber-500'} transition`}>{p.cta}</a>
              <div className="mt-2 text-center text-xs opacity-60">No hidden charges • GST bill</div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white/10 border border-white/10 rounded-2xl px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm"><span className="font-black text-yellow-400">Custom AMC?</span> <span className="text-slate-300">Need mixed devices or multiple branches? We build a tailored plan.</span></div>
          <a href="#contact" className="px-5 py-2 bg-white text-[#0a1e40] font-bold rounded-full">Get Custom Quote →</a>
        </div>
      </div>
    </section>
  );
}
