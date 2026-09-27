import { Link } from 'react-router-dom';

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
            <a href="https://wa.me/919635006403" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 grid place-items-center hover:bg-yellow-400 hover:text-[#0a1e40] transition">✆</a>
            <a href="tel:9635006403" className="w-8 h-8 rounded-full bg-white/10 grid place-items-center hover:bg-yellow-400 hover:text-[#0a1e40] transition">☎</a>
          </div>
        </div>

        <div>
          <div className="font-black text-white">Services</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/services" className="hover:text-yellow-400">All Services Catalogue →</Link></li>
            <li><Link to="/services?category=cctv" className="hover:text-yellow-400">CCTV Surveillance</Link></li>
            <li><Link to="/services?category=computer" className="hover:text-yellow-400">Computer & Laptop</Link></li>
            <li><Link to="/services?category=networking" className="hover:text-yellow-400">Networking & Wi-Fi</Link></li>
            <li><Link to="/services?category=amc" className="hover:text-yellow-400">AMC Maintenance</Link></li>
            <li><Link to="/services?category=biometric" className="hover:text-yellow-400">Access Control & Biometric</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-black text-white">Quick Links</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/booking" className="hover:text-yellow-400 font-bold">Book a Service</Link></li>
            <li><Link to="/#gallery" className="hover:text-yellow-400">Project Gallery</Link></li>
            <li><Link to="/#why-us" className="hover:text-yellow-400">Why Choose Us</Link></li>
            <li><Link to="/#faq" className="hover:text-yellow-400">FAQs</Link></li>
            <li><Link to="/#contact" className="hover:text-yellow-400">Contact Support</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-black text-white">Get in Touch</div>
          <div className="mt-3 space-y-2 text-sm">
            <div>📞 9635006403</div>
            <div>✉ itsolutions.amd@gmail.com</div>
            <div>📍 24 T C Road, Kolkata - 700053</div>
            <div>🏛️ GSTIN: 19BAAPK5344N1ZD</div>
            <div className="mt-3 bg-yellow-400 text-[#0a1e40] rounded-full px-4 py-2 font-black inline-flex">Mon - Sun: 10 AM - 9 PM</div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-wrap justify-between gap-3 text-xs">
          <div>© {new Date().getFullYear()} AMD IT SOLUTION. All rights reserved. • GSTIN: 19BAAPK5344N1ZD • Certified Partner</div>
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
