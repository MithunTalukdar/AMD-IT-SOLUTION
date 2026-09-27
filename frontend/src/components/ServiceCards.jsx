import { Link } from 'react-router-dom';

const services = [
  {
    title: "CCTV Surveillance",
    desc: "HD cameras, DVR/NVR, remote viewing",
    price: "From ₹1,999",
    icon: "📹",
    serviceKey: "cctv",
    anchor: "#cctv",
    img: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80",
    tag: "Most Popular",
    color: "from-blue-600 to-indigo-600",
  },
  {
    title: "Computer & Laptop",
    desc: "Repair, formatting, upgrades, accessories",
    price: "From ₹299",
    icon: "💻",
    serviceKey: "computer",
    anchor: "#computer",
    img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80",
    tag: "Same Day",
    color: "from-slate-700 to-slate-900",
  },
  {
    title: "Networking & Wi-Fi",
    desc: "Router, LAN, office networking setup",
    price: "From ₹499",
    icon: "🌐",
    serviceKey: "networking",
    anchor: "#networking",
    img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80",
    tag: "Business",
    color: "from-cyan-600 to-blue-600",
  },
  {
    title: "AMC Service",
    desc: "Annual maintenance for offices & shops",
    price: "From ₹2,999/yr",
    icon: "🛡️",
    serviceKey: "amc",
    anchor: "#amc",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80",
    tag: "Save 30%",
    color: "from-amber-500 to-orange-600",
  },
];

export default function ServiceCards() {
  return (
    <section id="services" className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6 md:mb-8">
        <div>
          <div className="text-xs font-black tracking-[0.18em] text-[#1e4a9a]">OUR SERVICES</div>
          <h2 className="text-2xl md:text-4xl font-black text-[#0a1e40] leading-tight">
            One Partner for All <span className="text-[#1e4a9a]">Tech Needs</span>
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-xl">Premium hardware, certified engineers, transparent billing — residential to enterprise.</p>
        </div>
        <Link to="/services" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-slate-300 font-bold text-sm text-[#0a1e40] bg-white hover:bg-slate-100 hover:border-[#1e4a9a] transition shadow-sm">
          View All Services →
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {services.map(s => (
          <div key={s.title} className="group bg-white rounded-[20px] border border-slate-200 overflow-hidden shadow-card hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between">
            <div>
              <div className={`h-1 bg-gradient-to-r ${s.color}`} />
              <div className="relative h-36 overflow-hidden">
                <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full text-xs font-black shadow">{s.icon} {s.tag}</div>
                <div className="absolute bottom-3 left-3 bg-[#0a1e40] text-white text-xs font-bold px-3 py-1 rounded-full">{s.price}</div>
              </div>
              <div className="p-4">
                <h3 className="font-black text-[#0a1e40]">{s.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.desc}</p>
              </div>
            </div>
            <div className="p-4 pt-0">
              <div className="mt-1 flex gap-2">
                <Link to={`/booking?service=${s.serviceKey}`} className="flex-1 text-center py-2 rounded-full bg-[#0a1e40] text-white text-xs font-black hover:bg-[#1e4a9a] transition shadow">
                  Book Now
                </Link>
                <a href={s.anchor} className="px-3 py-2 rounded-full border border-slate-200 text-xs font-bold hover:bg-slate-50">
                  Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trusted strip */}
      <div className="mt-8 bg-gradient-to-r from-[#0a1e40] to-[#1e4a9a] rounded-[18px] p-4 md:p-5 flex flex-wrap gap-3 md:gap-6 items-center justify-between text-white">
        <div className="font-bold">Trusted Brands We Install:</div>
        <div className="flex flex-wrap gap-2 text-xs font-black tracking-wide">
          {["HIKVISION","CP PLUS","DAHUA","TP-LINK","DELL","HP","LENOVO"].map(b=>(
            <span key={b} className="bg-white/10 border border-white/15 rounded-full px-3 py-1">{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
