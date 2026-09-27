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
          <div className="mt-4 flex gap-3">
            <a
              href="https://wa.me/919635006403?text=Hello%20AMD%20IT%20SOLUTION,%20I%20would%20like%20to%20inquire%20about%20your%20services."
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition shadow-md"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2Z" fill="currentColor"/>
                <path d="M17.53 14.37C17.23 14.22 15.75 13.49 15.48 13.39C15.2 13.29 15 13.24 14.81 13.54C14.61 13.84 14.04 14.51 13.86 14.71C13.69 14.91 13.52 14.93 13.22 14.78C12.92 14.63 11.96 14.32 10.82 13.3C9.93 12.51 9.33 11.53 9.16 11.23C8.98 10.93 9.14 10.77 9.29 10.62C9.42 10.49 9.59 10.27 9.73 10.1C9.88 9.93 9.93 9.81 10.03 9.61C10.13 9.41 10.08 9.24 10 9.09C9.93 8.94 9.34 7.49 9.1 6.89C8.86 6.3 8.61 6.38 8.44 6.38C8.28 6.37 8.08 6.37 7.88 6.37C7.69 6.37 7.37 6.44 7.1 6.74C6.83 7.04 6.07 7.75 6.07 9.2C6.07 10.65 7.13 12.05 7.27 12.25C7.42 12.45 9.35 15.43 12.31 16.71C13.01 17.01 13.56 17.19 13.99 17.33C14.7 17.55 15.34 17.52 15.85 17.44C16.42 17.36 17.6 16.73 17.85 16.03C18.1 15.33 18.1 14.73 18.02 14.61C17.95 14.49 17.83 14.42 17.53 14.27Z" fill="white"/>
              </svg>
            </a>
            <a
              href="tel:9635006403"
              aria-label="Direct Phone Call"
              className="w-9 h-9 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-yellow-400 hover:text-[#0a1e40] transition shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </a>
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
