import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ fullname: '', email: '', password: '', phone: '', role: 'customer' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const cleanErrorMessage = (error) => {
    const rawMsg =
      error?.response?.data?.message ||
      error?.response?.data?.errors?.[0]?.message ||
      error?.message ||
      '';

    if (rawMsg.includes('buffering timed out') || rawMsg.includes('MongooseError') || rawMsg.includes('MongoServerSelectionError')) {
      return 'Database connection is taking longer than expected. Please try again.';
    }
    if (rawMsg.includes('Duplicate value') || rawMsg.includes('E11000')) {
      return 'This email is already registered. Please log in instead.';
    }
    if (rawMsg) return rawMsg;
    return 'Unable to complete registration. Please check your network and try again.';
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');

    // Client-side quick validations
    if (!form.fullname.trim() || form.fullname.trim().length < 2) {
      setErr('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setErr('Please enter a valid email address.');
      return;
    }
    if (!form.password || form.password.length < 6) {
      setErr('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullname: form.fullname.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone.trim() || undefined,
        role: 'customer',
      });

      // Return to the pending booking flow if there is one, else default dashboard
      const stateFrom = loc.state?.from;
      const redirectParam = new URLSearchParams(loc.search).get('redirect');
      const dest =
        (typeof stateFrom === 'string' && stateFrom.startsWith('/') && stateFrom) ||
        (stateFrom?.pathname ? stateFrom.pathname + (stateFrom.search || '') : '') ||
        (redirectParam && redirectParam.startsWith('/') ? redirectParam : '') ||
        '/customer/bookings';
      nav(dest, { replace: true });
    } catch (e) {
      setErr(cleanErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 relative">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-[24px] border border-slate-200 shadow-xl p-6 md:p-8 relative overflow-hidden">
        {/* Top subtle progress bar when loading */}
        {loading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-200 overflow-hidden">
            <div className="h-full bg-amber-500 animate-pulse w-full"></div>
          </div>
        )}

        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[#0a1e40] text-amber-400 grid place-items-center font-black mx-auto text-xl shadow-md">
            A
          </div>
          <h1 className="mt-3 text-2xl font-black text-[#0a1e40]">Create Account</h1>
          <p className="text-sm text-slate-500">Join ADM TECHNO SOLUTION</p>
        </div>

        {/* Error Notification Alert */}
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
            <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
            <input
              placeholder="e.g. Mithun Talukdar"
              value={form.fullname}
              disabled={loading}
              onChange={e => setForm({ ...form, fullname: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e4a9a] focus:bg-white transition disabled:opacity-60"
              required
            />
          </div>

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
            <input
              placeholder="At least 6 characters"
              type="password"
              value={form.password}
              disabled={loading}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e4a9a] focus:bg-white transition disabled:opacity-60"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number (Optional)</label>
            <input
              type="tel"
              placeholder="e.g. 9635006403"
              value={form.phone}
              disabled={loading}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e4a9a] focus:bg-white transition disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-[#0a1e40] font-black shadow-md transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-[#0a1e40]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Account…</span>
              </>
            ) : (
              <span>Create Account →</span>
            )}
          </button>
        </div>

        <div className="mt-5 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-[#1e4a9a] font-bold hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}

