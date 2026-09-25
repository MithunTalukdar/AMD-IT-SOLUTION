export default function Footer() {
  return (
    <footer className="bg-[#06122e] text-slate-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 grid place-items-center text-white font-black">A</div>
            <div>
              <div className="font-black text-white leading-none">AMD IT SOLUTION</div>
              <div className="text-[11px] tracking-[0.15em] text-slate-400">TECHNOLOGY PARTNER</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed">Kolkata’s trusted IT partner since 2012. CCTV, computers, networking & AMC — one call, all solutions.</p>
          <div className="mt-4 flex gap-2">
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 grid place-items-center hover:bg-yellow-400 hover:text-[#0a1e40] transition">f</a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 grid place-items-center hover:bg-yellow-400 hover:text-[#0a1e40] transition">◎</a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 grid place-items-center hover:bg-yellow-400 hover:text-[#0a1e40] transition">▶</a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 grid place-items-center hover:bg-yellow-400 hover:text-[#0a1e40] transition">in</a>
          </div>
        </div>

        <div>
          <div className="font-black text-white">Services</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="#cctv" className="hover:text-yellow-400">CCTV Surveillance</a></li>
            <li><a href="#computer" className="hover:text-yellow-400">Computer / Laptop</a></li>
            <li><a href="#networking" className="hover:text-yellow-400">Networking & Wi-Fi</a></li>
            <li><a href="#amc" className="hover:text-yellow-400">AMC Service</a></li>
            <li><a href="#services" className="hover:text-yellow-400">Access Control / Biometric</a></li>
          </ul>
        </div>

        <div>
          <div className="font-black text-white">Quick Links</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="#services" className="hover:text-yellow-400">Popular Combos</a></li>
            <li><a href="#gallery" className="hover:text-yellow-400">Gallery</a></li>
            <li><a href="#" className="hover:text-yellow-400">About Us</a></li>
            <li><a href="#" className="hover:text-yellow-400">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-yellow-400">Terms & Warranty</a></li>
          </ul>
        </div>

        <div>
          <div className="font-black text-white">Get in Touch</div>
          <div className="mt-3 space-y-2 text-sm">
            <div>📞 +91 99999 99999</div>
            <div>✉ support@amditsolution.in</div>
            <div>📍 Kolkata • Salt Lake • New Town • Howrah</div>
            <div className="mt-3 bg-yellow-400 text-[#0a1e40] rounded-full px-4 py-2 font-black inline-flex">Mon - Sun: 10 AM - 9 PM</div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-wrap justify-between gap-3 text-xs">
          <div>© {new Date().getFullYear()} AMD IT SOLUTION. All rights reserved. • GST Verified • Certified Partner</div>
          <div className="flex gap-3">
            <span>🔒 Secure</span>
            <span>✓ Verified</span>
            <span>⭐ 4.9/5 Rated</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
