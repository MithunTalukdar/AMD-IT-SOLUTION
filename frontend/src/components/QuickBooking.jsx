export default function QuickBooking() {
  return (
    <section id="quick-book" className="relative -mt-6 md:-mt-10 px-4 md:px-6 z-20">
      <div className="max-w-7xl mx-auto bg-white rounded-[20px] md:rounded-[24px] shadow-[0_20px_60px_rgba(15,47,107,0.18)] border border-slate-200 p-4 md:p-6 lg:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg md:text-xl font-black text-[#0a1e40] flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-yellow-400 grid place-items-center text-sm">⚡</span>
            Quick Book a Service
          </h2>
          <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-bold">No payment now — Pay after service</span>
        </div>

        <form className="grid md:grid-cols-12 gap-3 md:gap-4 items-end" onSubmit={e => e.preventDefault()}>
          <div className="md:col-span-3">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Select Service</label>
            <select className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1e4a9a] focus:border-transparent">
              <option>CCTV Installation</option>
              <option>Computer / Laptop Repair</option>
              <option>Networking & Wi-Fi</option>
              <option>AMC Service</option>
              <option>Printer / Accessories</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Your Location</label>
            <select className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1e4a9a]">
              <option>Kolkata</option>
              <option>Howrah</option>
              <option>Salt Lake</option>
              <option>New Town</option>
              <option>Barasat</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Date</label>
            <input type="date" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1e4a9a]" />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Phone Number</label>
            <input placeholder="Enter mobile" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1e4a9a]" />
          </div>

          <div className="md:col-span-3 flex gap-2">
            <button type="submit" className="flex-1 py-3 rounded-xl bg-[#0a1e40] text-white font-black shadow-lg hover:bg-[#0f2f6b] transition">
              Check Availability →
            </button>
          </div>
        </form>

        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="bg-slate-100 rounded-full px-3 py-1">✓ Free site visit</span>
          <span className="bg-slate-100 rounded-full px-3 py-1">✓ 2 hrs response</span>
          <span className="bg-slate-100 rounded-full px-3 py-1">✓ Verified technicians</span>
          <span className="bg-slate-100 rounded-full px-3 py-1">✓ Warranty included</span>
        </div>
      </div>
    </section>
  );
}
