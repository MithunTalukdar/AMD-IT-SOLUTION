export default function Gallery() {
  const imgs = [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80",
    "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80",
    "https://images.unsplash.com/photo-1560264280-88b68371db39?w=600&q=80",
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80",
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80",
  ];
  return (
    <section id="gallery" className="bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="text-center">
          <div className="text-xs font-black tracking-[0.18em] text-[#1e4a9a]">GALLERY</div>
          <h2 className="text-2xl md:text-4xl font-black text-[#0a1e40]">Our Work Speaks</h2>
          <p className="mt-2 text-sm text-slate-600">Real installations — offices, shops, warehouses across West Bengal.</p>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {imgs.map((src, i) => (
            <div key={i} className="relative group overflow-hidden rounded-[18px] border border-slate-200 shadow-sm">
              <img src={src} alt={`work ${i}`} className="w-full h-44 md:h-56 object-cover group-hover:scale-110 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
              <div className="absolute bottom-3 left-3 bg-white/95 text-xs font-bold px-2.5 py-1 rounded-full hidden group-hover:inline-flex">
                {["CCTV Shop Setup","Office Networking","Warehouse CCTV","Laptop Lab","Server Rack","AMC Visit"][i]}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs">
          <span className="bg-white border border-slate-200 rounded-full px-4 py-2 font-bold">✓ Clean wiring</span>
          <span className="bg-white border border-slate-200 rounded-full px-4 py-2 font-bold">✓ Labelled cables</span>
          <span className="bg-yellow-400 border border-amber-300 rounded-full px-4 py-2 font-black">Before / After available on WhatsApp</span>
        </div>
      </div>
    </section>
  );
}
