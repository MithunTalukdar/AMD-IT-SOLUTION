export default function Contact() {
  return (
    <section id="contact" className="bg-[#0a1e40] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 grid lg:grid-cols-2 gap-8 md:gap-10">
        <div>
          <div className="inline-flex bg-yellow-400 text-[#0a1e40] font-black text-xs px-3 py-1 rounded-full">📍 CONTACT US</div>
          <h2 className="mt-3 text-2xl md:text-4xl font-black">Let’s Solve Your <span className="text-yellow-400">Tech Problem</span> Today</h2>
          <p className="mt-3 text-sm text-slate-300">Free site visit • Same-day service • Pay after work. Fill the form or call directly.</p>

          <div className="mt-6 space-y-3">
            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400 text-[#0a1e40] grid place-items-center font-black">☎</div>
              <div>
                <div className="font-black">Call / WhatsApp</div>
                <div className="text-sm text-yellow-300 font-bold">+91 99999 99999, +91 88888 88888</div>
                <div className="text-xs text-slate-400">10 AM - 9 PM • 7 Days</div>
              </div>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#0a1e40] grid place-items-center">📍</div>
              <div>
                <div className="font-black">Visit Us</div>
                <div className="text-sm text-slate-200">AMD IT SOLUTION, Kolkata — Service across West Bengal</div>
                <div className="text-xs text-slate-400">Salt Lake • New Town • Howrah • Barasat</div>
              </div>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#0a1e40] grid place-items-center">✉</div>
              <div>
                <div className="font-black">Email</div>
                <div className="text-sm text-slate-200">support@amditsolution.in • info@amditsolution.in</div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl overflow-hidden border border-white/10 h-48 bg-slate-200 grid place-items-center text-slate-500 text-sm">
            <iframe
              title="map"
              src="https://maps.google.com/maps?q=Kolkata&t=&z=11&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>

        <form onSubmit={e => e.preventDefault()} className="bg-white text-slate-800 rounded-[24px] p-5 md:p-7 shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
          <h3 className="font-black text-lg text-[#0a1e40]">Get Free Quote in 5 Minutes</h3>
          <p className="text-xs text-slate-500">No spam. Our engineer will call you shortly.</p>

          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600">Full Name *</label>
              <input placeholder="Enter name" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e4a9a]" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">Phone *</label>
              <input placeholder="Mobile number" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e4a9a]" />
            </div>
          </div>

          <div className="mt-3">
            <label className="text-xs font-bold text-slate-600">Service Needed</label>
            <select className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1e4a9a]">
              <option>CCTV Installation</option>
              <option>Computer / Laptop Repair</option>
              <option>Networking / Wi-Fi</option>
              <option>AMC Service</option>
              <option>Other</option>
            </select>
          </div>

          <div className="mt-3">
            <label className="text-xs font-bold text-slate-600">Message</label>
            <textarea rows="3" placeholder="Tell us about your requirement..." className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e4a9a]" />
          </div>

          <label className="mt-3 flex gap-2 text-xs text-slate-600">
            <input type="checkbox" defaultChecked /> I agree to be contacted via call/WhatsApp.
          </label>

          <button type="submit" className="mt-4 w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0a1e40] font-black shadow hover:scale-[1.01] transition">
            Send Request → Get Call Back in 5 Min
          </button>

          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> 12 people requested today
          </div>
        </form>
      </div>
    </section>
  );
}
