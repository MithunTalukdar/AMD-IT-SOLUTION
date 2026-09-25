const reviews = [
  { name: "Rahul Agarwal", role: "Medical Shop, Salt Lake", text: "CCTV installed within 4 hours. Very clean wiring and mobile app explained properly. Still they respond on WhatsApp after 8 months!", avatar: "https://i.pravatar.cc/100?img=15", stars: 5 },
  { name: "Priya Das", role: "Boutique Owner, New Town", text: "Networking for my 2-floor store was done in one day. Wi-Fi coverage now perfect. Transparent pricing.", avatar: "https://i.pravatar.cc/100?img=32", stars: 5 },
  { name: "Sujit Kumar", role: "Warehouse, Howrah", text: "AMC for 20 computers + 8 cameras. Engineer visits monthly without remainder. Highly reliable.", avatar: "https://i.pravatar.cc/100?img=68", stars: 5 },
  { name: "Amit Paul", role: "CA Office, Kolkata", text: "Laptop SSD upgrade made my old laptop super fast. Genuine Samsung SSD with bill. Fair price.", avatar: "https://i.pravatar.cc/100?img=33", stars: 5 },
];

export default function Reviews() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-black tracking-[0.18em] text-[#1e4a9a]">REVIEWS</div>
          <h2 className="text-2xl md:text-4xl font-black text-[#0a1e40]">What Our Clients Say</h2>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="bg-[#0a1e40] text-yellow-400 font-black px-2.5 py-1 rounded-full">4.9★ Google</span>
            <span className="text-slate-600">1,200+ reviews • 98% recommend</span>
          </div>
        </div>
        <div className="hidden md:flex gap-2">
          <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full">✓ Verified Purchases</span>
          <span className="bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">Updated daily</span>
        </div>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {reviews.map(r => (
          <div key={r.name} className="bg-white border border-slate-200 rounded-[18px] p-5 shadow-sm">
            <div className="flex text-yellow-400">{"★★★★★".slice(0, r.stars)}</div>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">“{r.text}”</p>
            <div className="mt-4 flex items-center gap-3">
              <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="font-black text-sm text-[#0a1e40]">{r.name}</div>
                <div className="text-xs text-slate-500">{r.role}</div>
              </div>
              <span className="ml-auto text-xs bg-slate-100 rounded-full px-2 py-1">✓ Verified</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        {[
          ["5000+", "Projects Delivered"],
          ["1200+", "5-Star Reviews"],
          ["78%", "Repeat Customers"],
          ["2 Hr", "Avg Support Time"],
        ].map(([n, l]) => (
          <div key={l} className="bg-gradient-to-br from-[#0a1e40] to-[#1e4a9a] text-white rounded-2xl py-4">
            <div className="font-black text-xl text-yellow-400">{n}</div>
            <div className="text-xs opacity-80">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
