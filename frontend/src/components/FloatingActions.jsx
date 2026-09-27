import { useState } from 'react';

export default function FloatingActions() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto select-none">
      {/* WhatsApp Button */}
      <div className="relative flex items-center">
        {hovered === 'whatsapp' && (
          <div className="hidden sm:block absolute right-16 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap animate-fade-in">
            💬 Chat on WhatsApp (+91 9635006403)
            <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 border-4 border-transparent border-l-slate-900" />
          </div>
        )}
        <a
          href="https://wa.me/919635006403?text=Hello%20AMD%20IT%20SOLUTION,%20I%20would%20like%20to%20inquire%20about%20your%20services."
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered('whatsapp')}
          onMouseLeave={() => setHovered(null)}
          aria-label="Direct WhatsApp Message to AMD IT SOLUTION"
          className="w-13 h-13 md:w-14 md:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:scale-110 active:scale-95 transition-all duration-300 relative group"
        >
          {/* Subtle ping aura */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />
          <svg className="w-7 h-7 fill-current drop-shadow-sm" viewBox="0 0 24 24">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2Z" fill="currentColor"/>
            <path d="M17.53 14.37C17.23 14.22 15.75 13.49 15.48 13.39C15.2 13.29 15 13.24 14.81 13.54C14.61 13.84 14.04 14.51 13.86 14.71C13.69 14.91 13.52 14.93 13.22 14.78C12.92 14.63 11.96 14.32 10.82 13.3C9.93 12.51 9.33 11.53 9.16 11.23C8.98 10.93 9.14 10.77 9.29 10.62C9.42 10.49 9.59 10.27 9.73 10.1C9.88 9.93 9.93 9.81 10.03 9.61C10.13 9.41 10.08 9.24 10 9.09C9.93 8.94 9.34 7.49 9.1 6.89C8.86 6.3 8.61 6.38 8.44 6.38C8.28 6.37 8.08 6.37 7.88 6.37C7.69 6.37 7.37 6.44 7.1 6.74C6.83 7.04 6.07 7.75 6.07 9.2C6.07 10.65 7.13 12.05 7.27 12.25C7.42 12.45 9.35 15.43 12.31 16.71C13.01 17.01 13.56 17.19 13.99 17.33C14.7 17.55 15.34 17.52 15.85 17.44C16.42 17.36 17.6 16.73 17.85 16.03C18.1 15.33 18.1 14.73 18.02 14.61C17.95 14.49 17.83 14.42 17.53 14.27Z" fill="#25D366"/>
          </svg>
        </a>
      </div>

      {/* Direct Call / Dialer Button */}
      <div className="relative flex items-center">
        {hovered === 'call' && (
          <div className="hidden sm:block absolute right-16 bg-[#0a1e40] text-yellow-400 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap animate-fade-in">
            📞 Direct Call: 9635006403
            <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 border-4 border-transparent border-l-[#0a1e40]" />
          </div>
        )}
        <a
          href="tel:9635006403"
          onMouseEnter={() => setHovered('call')}
          onMouseLeave={() => setHovered(null)}
          aria-label="Direct Phone Call 9635006403"
          className="w-13 h-13 md:w-14 md:h-14 rounded-full bg-[#0a1e40] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(10,30,64,0.45)] hover:bg-[#1e4a9a] hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/20"
        >
          <svg className="w-6 h-6 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
