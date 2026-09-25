export default function NetworkingSection() {
  return (
    <section id="networking" className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="grid lg:grid-cols-2 gap-8 md:gap-10 items-center">
        <div>
          <div className="inline-flex bg-cyan-50 border border-cyan-200 text-[#0a1e40] font-black text-xs px-3 py-1 rounded-full">🌐 NETWORKING & WI-FI</div>
          <h2 className="mt-3 text-2xl md:text-4xl font-black text-[#0a1e40]">Fast, Secure Networking for Shops to Enterprises</h2>
          <p className="mt-3 text-sm text-slate-600">Structured cabling, gigabit LAN, business Wi-Fi, hotspot, firewall & VPN — clean, labelled, future-ready setup.</p>

          <div className="mt-5 space-y-3">
            {[
              { t: "Office Wi-Fi & LAN", d: "Up to 200 users, load balance, seamless roaming" },
              { t: "Hotel / Cafe Hotspot", d: "OTP login, speed control, billing" },
              { t: "Fiber & Point-to-Point", d: "Building to building, long range" },
            ].map(r => (
              <div key={r.t} className="flex gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#0a1e40] text-yellow-400 grid place-items-center font-black">»</div>
                <div>
                  <div className="font-black text-sm text-[#0a1e40]">{r.t}</div>
                  <div className="text-xs text-slate-600">{r.d}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-gradient-to-r from-[#0a1e40] to-[#1e4a9a] text-white rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-black">Free Network Audit</div>
              <div className="text-xs text-slate-200">We check your current speed & security loopholes</div>
            </div>
            <a href="#quick-book" className="px-5 py-2 bg-yellow-400 text-[#0a1e40] font-black rounded-full">Book Audit</a>
          </div>
        </div>

        <div className="relative">
          <img src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80" alt="Networking" className="w-full h-[320px] md:h-[440px] object-cover rounded-[24px] border border-slate-200 shadow-xl" />
          <div className="absolute bottom-4 left-4 bg-white rounded-2xl p-3 flex items-center gap-3 shadow-xl border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 grid place-items-center">📶</div>
            <div>
              <div className="font-black text-sm">Gigabit Speed Test</div>
              <div className="text-xs text-slate-500">940 Mbps • Low Latency</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
