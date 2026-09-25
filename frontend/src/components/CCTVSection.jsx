export default function CCTVSection() {
  return (
    <section id="cctv" className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="grid lg:grid-cols-2 gap-8 md:gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-[#0a1e40] font-black text-xs px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> CCTV & SURVEILLANCE
          </div>
          <h2 className="mt-3 text-2xl md:text-4xl font-black text-[#0a1e40] leading-tight">
            CCTV That <span className="text-[#1e4a9a]">Never Sleeps</span>
          </h2>
          <p className="mt-3 text-sm text-slate-600">HD & IP cameras, DVR/NVR, solar & 4G kits — for home, shop, warehouse & apartments. Watch live on mobile from anywhere.</p>

          <div className="mt-5 grid sm:grid-cols-2 gap-3">
            {[
              "2MP / 5MP HD & IP Cameras",
              "DVR / NVR with 1-4 TB HDD",
              "Mobile view + playback",
              "Night vision up to 30m",
              "Motion alert on phone",
              "Solar & 4G for remote sites",
            ].map(f => (
              <div key={f} className="flex gap-2 text-sm font-semibold text-slate-800">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-xs">✓</span> {f}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#quick-book" className="px-6 py-3 bg-[#0a1e40] text-white font-black rounded-full hover:bg-[#1e4a9a] transition">Get Free Quote →</a>
            <a href="tel:+919999999999" className="px-6 py-3 border border-slate-200 font-bold rounded-full hover:bg-slate-50">Talk to CCTV Expert</a>
          </div>

          <div className="mt-6 flex gap-4 text-center">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex-1"><div className="font-black text-[#0a1e40]">₹6,499</div><div className="text-xs">2-Cam Kit</div></div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex-1"><div className="font-black text-[#0a1e40]">₹12,999</div><div className="text-xs">4-Cam Kit</div></div>
            <div className="bg-yellow-400 border border-amber-300 rounded-xl px-4 py-3 flex-1"><div className="font-black text-[#0a1e40]">2 Yrs</div><div className="text-xs font-bold">Warranty</div></div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[24px] overflow-hidden border border-slate-200 shadow-xl">
            <img src="https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80" alt="CCTV" className="w-full h-[300px] md:h-[420px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-[24px] pointer-events-none" />
          </div>
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl p-4 shadow-xl border border-slate-200 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 grid place-items-center text-xl">●</div>
            <div>
              <div className="font-black text-sm">Live Monitoring Demo</div>
              <div className="text-xs text-slate-500">See your shop live on phone before you pay</div>
            </div>
            <span className="ml-auto hidden sm:inline-flex bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full">REC • Live</span>
          </div>
        </div>
      </div>
    </section>
  );
}
