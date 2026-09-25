export default function ComputerSection() {
  return (
    <section id="computer" className="bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 grid lg:grid-cols-2 gap-8 md:gap-10 items-center">
        <div className="order-2 lg:order-1 relative">
          <div className="rounded-[24px] overflow-hidden border border-slate-200 shadow-xl bg-white">
            <img src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80" alt="Computer repair" className="w-full h-[300px] md:h-[420px] object-cover" />
          </div>
          <div className="absolute -bottom-4 -right-2 md:right-4 bg-[#0a1e40] text-white rounded-2xl px-5 py-3 shadow-xl">
            <div className="font-black flex items-center gap-2">⚡ Same Day Return</div>
            <div className="text-xs text-slate-200">90% repairs done within 24 hrs</div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="inline-flex bg-white border border-slate-200 text-[#0a1e40] font-black text-xs px-3 py-1 rounded-full">💻 COMPUTER / LAPTOP</div>
          <h2 className="mt-3 text-2xl md:text-4xl font-black text-[#0a1e40]">Expert Repair, Upgrade & Accessories</h2>
          <p className="mt-3 text-sm text-slate-600">Formatting, virus removal, SSD/RAM upgrade, display/keyboard/battery replacement — all brands: Dell, HP, Lenovo, Asus, Acer.</p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              { t: "Laptop Service", p: "From ₹599", d: "Full check + cleaning" },
              { t: "Desktop Assemble", p: "From ₹18,999", d: "Office & gaming builds" },
              { t: "SSD Upgrade", p: "From ₹2,199", d: "10x faster booting" },
              { t: "Printer & Accessories", p: "Best Price", d: "Ink, toner, peripherals" },
            ].map(c => (
              <div key={c.t} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="font-black text-sm text-[#0a1e40]">{c.t}</div>
                <div className="text-xs text-slate-500">{c.d}</div>
                <div className="mt-2 font-black text-amber-600">{c.p}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#quick-book" className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0a1e40] font-black rounded-full shadow">Book Repair Visit →</a>
            <span className="px-4 py-3 bg-white border border-slate-200 rounded-full text-xs font-bold">✓ Genuine Parts • 3 Month Service Warranty</span>
          </div>
        </div>
      </div>
    </section>
  );
}
