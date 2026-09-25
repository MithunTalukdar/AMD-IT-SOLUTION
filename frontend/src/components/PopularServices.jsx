const items = [
  { title: "2 Camera Home Kit", price: "₹6,499", old: "₹9,999", badge: "Bestseller", img: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80", points: ["1TB HDD", "Mobile View", "1 Yr Warranty"] },
  { title: "4 Camera Shop Combo", price: "₹12,999", old: "₹18,500", badge: "Save 30%", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80", points: ["Hikvision HD", "Night Vision", "2 Yr Warranty"] },
  { title: "Wi-Fi Office Setup", price: "₹3,999", old: "₹6,000", badge: "Business", img: "https://images.unsplash.com/photo-1560264280-88b68371db39?w=600&q=80", points: ["Up to 50 Users", "Gigabit LAN", "Support"] },
  { title: "Laptop Full Service", price: "₹599", old: "₹1,200", badge: "Today Only", img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80", points: ["Formatting", "Cleaning", "Health Check"] },
  { title: "Annual AMC — Small Office", price: "₹4,999/yr", old: "₹9,000", badge: "AMC", img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80", points: ["4 Visits", "Priority Support", "Parts Discount"] },
  { title: "Biometric + Access", price: "₹7,500", old: "₹11,000", badge: "Enterprise", img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80", points: ["Fingerprint", "Cloud Report", "Install Included"] },
];

export default function PopularServices() {
  return (
    <section className="bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex bg-yellow-400 text-[#0a1e40] font-black text-xs px-3 py-1 rounded-full">🔥 POPULAR THIS WEEK</div>
          <h2 className="mt-3 text-2xl md:text-4xl font-black text-[#0a1e40]">Popular Services & Combos</h2>
          <p className="mt-2 text-sm text-slate-600">Handpicked deals with genuine warranty and same-day installation across Kolkata.</p>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {items.map(it => (
            <div key={it.title} className="bg-white rounded-[18px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition">
              <div className="relative h-44 overflow-hidden">
                <img src={it.img} alt={it.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-[#0a1e40] text-yellow-400 text-xs font-black px-2.5 py-1 rounded-full">{it.badge}</span>
                <span className="absolute top-3 right-3 bg-white/95 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full">⭐ 4.9 (320)</span>
              </div>
              <div className="p-4">
                <h3 className="font-black text-[#0a1e40] leading-tight">{it.title}</h3>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {it.points.map(p => <li key={p} className="text-[11px] bg-slate-100 border border-slate-200 rounded-full px-2 py-1 font-semibold">{p}</li>)}
                </ul>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="font-black text-lg text-[#0a1e40]">{it.price}</div>
                    <div className="text-xs line-through text-slate-400">{it.old}</div>
                  </div>
                  <a href="#quick-book" className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0a1e40] font-black text-sm shadow">Book Now</a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <a href="#services" className="inline-flex px-6 py-3 rounded-full bg-[#0a1e40] text-white font-bold hover:bg-[#1e4a9a] transition">View Full Catalogue →</a>
        </div>
      </div>
    </section>
  );
}
