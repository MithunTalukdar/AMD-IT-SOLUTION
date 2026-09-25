export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1e40] via-[#0f2f6b] to-[#1a4aa0] text-white">
      {/* Decorative */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-yellow-400/10 rounded-full blur-[80px]" />
        <div className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-blue-400/10 rounded-full blur-[90px]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`, backgroundSize: '50px 50px'}} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16 lg:py-20 grid lg:grid-cols-2 gap-8 md:gap-10 items-center">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/15 rounded-full px-3 py-1.5 text-xs md:text-sm font-semibold">
            <span className="bg-yellow-400 text-[#0a1e40] rounded-full px-2 py-0.5 font-black text-xs">NEW</span>
            Trusted by 5,000+ Businesses in West Bengal
            <span className="hidden sm:inline bg-white/15 rounded-full px-2 py-0.5">⭐ 4.9/5</span>
          </div>

          <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black leading-[0.95] tracking-tight">
            PREMIUM <span className="text-yellow-400">IT</span>
            <br />
            SOLUTIONS FOR
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">YOUR BUSINESS</span>
          </h1>

          <p className="mt-4 md:mt-5 text-slate-200 text-sm md:text-base leading-relaxed max-w-xl">
            CCTV • Computer & Laptop • Networking • AMC — Verified engineers, transparent pricing, same-day service. One partner for all your technology needs.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#quick-book" className="px-6 md:px-7 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0a1e40] font-black rounded-full shadow-[0_12px_30px_rgba(250,204,21,0.4)] hover:scale-[1.02] transition flex items-center gap-2">
              Book a Service <span>→</span>
            </a>
            <a href="tel:+919999999999" className="px-6 md:px-7 py-3 bg-white/10 backdrop-blur border border-white/20 font-bold rounded-full hover:bg-white hover:text-[#0a1e40] transition flex items-center gap-2">
              <span className="w-8 h-8 bg-white text-[#0a1e40] rounded-full grid place-items-center text-sm">☎</span>
              Call Now
            </a>
          </div>

          {/* Trust */}
          <div className="mt-8 flex flex-wrap items-center gap-6 md:gap-8">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} alt="client" className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-white object-cover" />
              ))}
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-yellow-400 border-2 border-white grid place-items-center text-xs font-black text-[#0a1e40]">5k+</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex text-yellow-400">★★★★★</div>
              <div className="text-sm">
                <div className="font-bold">4.9/5 Rating</div>
                <div className="text-xs text-slate-300">1,200+ Reviews</div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm bg-white/10 rounded-full px-3 py-1.5 border border-white/10">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              12 Technicians Available Now
            </div>
          </div>
        </div>

        {/* Right — Visual Card Stack */}
        <div className="relative lg:h-[520px] flex items-center justify-center">
          {/* Main image card */}
          <div className="relative w-full max-w-[480px] bg-white rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-yellow-400 to-amber-500" />
            <div className="p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div className="text-[#0a1e40] font-black">Service Overview</div>
                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">● Live Support</span>
              </div>

              {/* Fake dashboard preview */}
              <div className="mt-4 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80" alt="IT service" className="w-full h-44 md:h-52 object-cover" />
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 text-sm">CCTV Installation — 4 Cam Setup</div>
                    <div className="text-xs text-slate-500">Hikvision • 2 Year Warranty</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-[#0a1e40]">₹12,999</div>
                    <div className="text-xs line-through text-slate-400">₹18,500</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[
                  { k: '5000+', v: 'Projects' },
                  { k: '4.9★', v: 'Rating' },
                  { k: '24/7', v: 'Support' },
                ].map(s => (
                  <div key={s.v} className="bg-[#0a1e40] text-white rounded-2xl py-3">
                    <div className="font-black text-yellow-400">{s.k}</div>
                    <div className="text-[11px] tracking-wide opacity-80">{s.v}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3 text-xs text-slate-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                <span className="w-8 h-8 rounded-full bg-yellow-400 grid place-items-center">⚡</span>
                Same-day installation • Free site visit
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div className="hidden md:flex absolute -left-4 top-10 bg-white rounded-2xl shadow-xl p-3 items-center gap-2.5 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100 grid place-items-center">🛡️</div>
            <div>
              <div className="font-bold text-sm text-slate-800">AMC Protected</div>
              <div className="text-xs text-slate-500">365 Days Coverage</div>
            </div>
          </div>
          <div className="hidden md:flex absolute -right-6 bottom-10 bg-[#0a1e40] text-white rounded-2xl shadow-xl p-3 items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400 text-[#0a1e40] grid place-items-center font-black">✓</div>
            <div>
              <div className="font-bold text-sm">Verified Team</div>
              <div className="text-xs text-slate-300">Govt. Certified Engineers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className="relative border-t border-white/10 bg-black/10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            ['5000+', 'Installations Done'],
            ['98%', 'Customer Satisfaction'],
            ['2 Hrs', 'Avg. Response Time'],
            ['12+', 'Years Experience'],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-black text-yellow-400 text-xl md:text-2xl">{n}</div>
              <div className="text-xs md:text-sm text-slate-200">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
