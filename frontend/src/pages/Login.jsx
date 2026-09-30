import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

function resolveDestination(loc, user) {
  // 1. Explicit redirect passed via navigation state (string or location object)
  const stateFrom = loc.state?.from;
  if (typeof stateFrom === 'string' && stateFrom.startsWith('/')) return stateFrom;
  if (stateFrom?.pathname) return stateFrom.pathname + (stateFrom.search || '');
  // 2. ?redirect=/booking?service=... query param (e.g. deep links)
  const params = new URLSearchParams(loc.search);
  const redirect = params.get('redirect');
  if (redirect && redirect.startsWith('/')) return redirect;
  // 3. Role-based default (existing behaviour preserved)
  return user.role === 'admin' ? '/admin/bookings' : user.role === 'technician' ? '/technician/bookings' : '/customer/bookings';
}

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ email: loc.state?.email || '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState('');
  const [successMsg, setSuccessMsg] = useState(loc.state?.successMsg || '');
  const [loading, setLoading] = useState(false);

  // Preserve booking redirect on the Register link
  const pendingRedirect = (() => {
    const s = loc.state?.from;
    if (typeof s === 'string' && s.startsWith('/')) return s;
    if (s?.pathname) return s.pathname + (s.search || '');
    const q = new URLSearchParams(loc.search).get('redirect');
    return q && q.startsWith('/') ? q : '';
  })();

  const cleanErrorMessage = (error) => {
    const rawMsg =
      error?.response?.data?.message ||
      error?.response?.data?.errors?.[0]?.message ||
      error?.message ||
      '';

    if (rawMsg.includes('buffering timed out') || rawMsg.includes('MongooseError') || rawMsg.includes('MongoServerSelectionError')) {
      return 'Database connection is taking longer than expected. Please try again.';
    }
    if (rawMsg) return rawMsg;
    return 'Unable to sign in. Please check your email and password.';
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setSuccessMsg('');

    if (!form.email.trim()) {
      setErr('Please enter your email address.');
      return;
    }
    if (!form.password) {
      setErr('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const u = await login(form.email.trim(), form.password);
      nav(resolveDestination(loc, u), { replace: true });
    } catch (e) {
      setErr(cleanErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 relative">
      <SEO
        title="Client & Admin Login | AMD IT SOLUTION"
        description="Login to your AMD IT SOLUTION customer, technician or administrator portal."
        canonicalPath="/login"
        noindex={true}
      />
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-[24px] border border-slate-200 shadow-xl p-6 md:p-8 relative overflow-hidden">
        {loading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-200 overflow-hidden">
            <div className="h-full bg-[#1e4a9a] animate-pulse w-full"></div>
          </div>
        )}

        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[#0a1e40] text-amber-400 grid place-items-center font-black mx-auto text-xl shadow-md">
            A
          </div>
          <h1 className="mt-3 text-2xl font-black text-[#0a1e40]">Welcome Back</h1>
          <p className="text-sm text-slate-500">Login to manage your bookings</p>
          {pendingRedirect.startsWith('/booking') && (
            <p className="mt-2 text-xs bg-blue-50 border border-blue-200 text-blue-800 rounded-xl px-3 py-2">
              Please login to continue your booking — you&apos;ll return to it automatically.
            </p>
          )}
        </div>

        {/* Success Alert Banner (e.g. from registration) */}
        {successMsg && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl px-4 py-3 flex items-start justify-between gap-2 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5">✓</span>
              <span className="leading-snug">{successMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMsg('')}
              className="text-emerald-500 hover:text-emerald-800 font-bold text-base leading-none p-1 transition"
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {err && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl px-4 py-3 flex items-start justify-between gap-2 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-bold mt-0.5">⚠️</span>
              <span className="leading-snug">{err}</span>
            </div>
            <button
              type="button"
              onClick={() => setErr('')}
              className="text-red-400 hover:text-red-700 font-bold text-base leading-none p-1 transition"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <div className="mt-5 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={form.email}
              disabled={loading}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e4a9a] focus:bg-white transition disabled:opacity-60"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
            <div className="relative">
              <input
                placeholder="Your password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                disabled={loading}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-11 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e4a9a] focus:bg-white transition disabled:opacity-60"
                required
              />
              <button
                type="button"
                tabIndex="-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#0a1e40] hover:bg-[#122e5e] text-white font-black shadow-md transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing in…</span>
              </>
            ) : (
              <span>Login →</span>
            )}
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-slate-600">
          No account? <Link to={pendingRedirect ? `/register?redirect=${encodeURIComponent(pendingRedirect)}` : '/register'} state={pendingRedirect ? { from: pendingRedirect } : undefined} className="text-[#1e4a9a] font-bold hover:underline">Register</Link>
        </div>

        {/* Quick 1-click credentials */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center mb-2.5">
            Quick Fill Demo Account:
          </div>
          <button
            type="button"
            onClick={() => setForm({ email: 'admin@amditsolution.in', password: 'Admin@123456' })}
            className="w-full p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 font-bold border border-red-200 transition text-center text-xs"
          >
            👑 Fill Admin Credentials
          </button>
        </div>
      </form>
    </div>
  );
}
