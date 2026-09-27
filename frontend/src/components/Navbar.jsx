import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: 'All Services', href: '/services', isRoute: true },
    { label: 'CCTV', href: '/#cctv', isRoute: false },
    { label: 'Networking', href: '/#networking', isRoute: false },
    { label: 'AMC', href: '/#amc', isRoute: false },
    { label: 'Gallery', href: '/#gallery', isRoute: false },
    { label: 'Contact', href: '/#contact', isRoute: false },
  ];

  const handleLogout = () => { logout(); navigate('/login'); };
  const isAdmin = user?.role === 'admin';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Top Bar */}
      <div className={`${isAdmin ? 'bg-[#06152d]' : 'bg-[#0a1e40]'} text-white text-xs md:text-sm border-b border-white/10`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 md:gap-6">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              24/7 Support Available
            </span>
            <a href="tel:9635006403" className="hidden sm:flex items-center gap-1.5 hover:text-yellow-300 transition font-bold">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              9635006403
            </a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>📍 24 T C Road, Kolkata - 700053</span>
            {isAdmin ? (
              <span className="bg-yellow-400 text-[#0a1e40] px-2.5 py-0.5 rounded-full font-black text-xs shadow-sm">
                🛡️ Master Admin Mode
              </span>
            ) : (
              <span className="bg-yellow-400 text-[#0a1e40] px-2 py-0.5 rounded-full font-bold text-xs">Verified Technicians</span>
            )}
            {user && (
              <span className="bg-white/15 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                👤 {user.fullname?.split(' ')[0]} ({user.role})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={isAdmin ? "/admin/bookings" : "/"} className="flex items-center gap-3">
          <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl ${isAdmin ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-[#0a1e40]' : 'bg-gradient-to-br from-[#0a1e40] to-[#1e4a9a] text-white'} flex items-center justify-center font-black text-xl shadow-md`}>
            A
          </div>
          <div className="leading-none">
            <div className="font-black text-[#0a1e40] text-lg md:text-xl tracking-tight">
              AMD <span className="text-[#1e4a9a]">IT</span> SOLUTION
            </div>
            <div className="text-[10px] md:text-xs tracking-[0.18em] text-slate-500 font-bold">
              {isAdmin ? 'ADMINISTRATION PORTAL' : 'TECHNOLOGY PARTNER'}
            </div>
          </div>
        </Link>

        {/* If Admin: Show only Admin Badges & Website Link, Hide all Customer Links */}
        {isAdmin ? (
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-full text-xs font-black">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span>ADMIN CONSOLE ACTIVE</span>
            </div>
            <Link
              to="/admin/bookings"
              className={`text-sm font-bold px-3 py-1 rounded-lg transition ${location.pathname.startsWith('/admin') ? 'bg-[#0a1e40] text-white' : 'text-slate-700 hover:text-[#0a1e40]'}`}
            >
              Dashboard
            </Link>
            <Link
              to="/"
              className="text-sm font-semibold text-slate-600 hover:text-[#1e4a9a] flex items-center gap-1.5 transition"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              Customer Website Preview
            </Link>
          </div>
        ) : (
          /* Non-admin links */
          <div className="hidden lg:flex items-center gap-7">
            {links.map(l => (
              l.isRoute ? (
                <Link key={l.label} to={l.href} className="text-sm font-semibold text-slate-700 hover:text-[#1e4a9a] transition relative group">
                  {l.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all" />
                </Link>
              ) : (
                <a key={l.label} href={l.href} className="text-sm font-semibold text-slate-700 hover:text-[#1e4a9a] transition relative group">
                  {l.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all" />
                </a>
              )
            ))}
            {user?.role === 'customer' && <Link to="/customer/bookings" className="text-sm font-bold text-[#1e4a9a]">My Bookings</Link>}
            {user?.role === 'technician' && <Link to="/technician/bookings" className="text-sm font-bold text-indigo-600">Technician</Link>}
          </div>
        )}

        {/* Right CTA / Auth controls */}
        <div className="hidden lg:flex items-center gap-3">
          {isAdmin ? (
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout Admin
            </button>
          ) : !user ? (
            <>
              <Link to="/login" className="px-4 py-2 rounded-full border border-slate-200 font-bold text-sm hover:bg-slate-50 transition">Login</Link>
              <Link to="/booking" className="px-5 py-2.5 bg-gradient-to-r from-[#facc15] to-[#f59e0b] text-[#0a1e40] font-bold rounded-full shadow-[0_8px_20px_rgba(250,204,21,0.35)] hover:scale-[1.02] transition">Book Now →</Link>
            </>
          ) : (
            <>
              <Link to="/booking" className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0a1e40] font-black text-sm hover:shadow-md transition">Book Now</Link>
              <button onClick={handleLogout} className="px-4 py-2 rounded-full bg-[#0a1e40] text-white font-bold text-sm hover:bg-slate-800 transition">Logout</button>
            </>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg border border-slate-200" aria-label="Toggle navigation menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden border-t bg-white px-4 py-4 space-y-3 shadow-2xl">
          {isAdmin ? (
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="text-xs font-black text-yellow-800 uppercase tracking-wide">Master Admin Console</div>
                <div className="text-xs text-slate-600 mt-0.5">{user?.email}</div>
              </div>
              <Link to="/admin/bookings" onClick={() => setOpen(false)} className="block py-2.5 px-3 rounded-lg font-bold bg-[#0a1e40] text-white text-sm">
                📋 Admin Dashboard
              </Link>
              <Link to="/" onClick={() => setOpen(false)} className="block py-2.5 px-3 rounded-lg font-semibold text-slate-800 hover:bg-slate-100 text-sm">
                🌐 View Customer Website
              </Link>
              <button
                onClick={() => { setOpen(false); handleLogout(); }}
                className="w-full py-2.5 bg-red-600 text-white rounded-lg font-black text-sm"
              >
                Logout Admin
              </button>
            </div>
          ) : (
            <>
              {links.map(l => (
                l.isRoute ? (
                  <Link key={l.label} to={l.href} onClick={() => setOpen(false)} className="block py-2 font-semibold text-slate-800 border-b border-slate-100 last:border-0">{l.label}</Link>
                ) : (
                  <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="block py-2 font-semibold text-slate-800 border-b border-slate-100 last:border-0">{l.label}</a>
                )
              ))}
              {user?.role === 'customer' && <Link to="/customer/bookings" onClick={() => setOpen(false)} className="block py-2 font-bold text-[#1e4a9a]">My Bookings</Link>}
              {user?.role === 'technician' && <Link to="/technician/bookings" onClick={() => setOpen(false)} className="block py-2 font-bold text-indigo-600">Technician Dashboard</Link>}
              {!user ? (
                <div className="space-y-2 pt-2">
                  <Link to="/login" onClick={() => setOpen(false)} className="block text-center py-3 border rounded-xl font-bold">Login</Link>
                  <Link to="/booking" onClick={() => setOpen(false)} className="block text-center py-3 bg-[#0a1e40] text-white font-bold rounded-xl">Book Service Now</Link>
                </div>
              ) : (
                <button onClick={() => { setOpen(false); handleLogout(); }} className="w-full py-3 bg-slate-100 rounded-xl font-bold">Logout ({user.fullname})</button>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
}

