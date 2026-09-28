import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  // Preserve booking redirect on the Register link
  const pendingRedirect = (() => {
    const s = loc.state?.from;
    if (typeof s === 'string' && s.startsWith('/')) return s;
    if (s?.pathname) return s.pathname + (s.search || '');
    const q = new URLSearchParams(loc.search).get('redirect');
    return q && q.startsWith('/') ? q : '';
  })();

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      const u = await login(form.email, form.password);
      nav(resolveDestination(loc, u), { replace: true });
    } catch (e) { setErr(e.response?.data?.message || 'Unable to connect to server. Please try again.'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-[24px] border border-slate-200 shadow-xl p-6 md:p-8">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[#0a1e40] text-white grid place-items-center font-black mx-auto">A</div>
          <h1 className="mt-3 text-2xl font-black text-[#0a1e40]">Welcome Back</h1>
          <p className="text-sm text-slate-500">Login to manage your bookings</p>
          {pendingRedirect.startsWith('/booking') && (
            <p className="mt-2 text-xs bg-blue-50 border border-blue-200 text-blue-800 rounded-xl px-3 py-2">Please login to continue your booking — you&apos;ll return to it automatically.</p>
          )}
        </div>
        {err && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-2">{err}</div>}
        <div className="mt-5 space-y-3">
          <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e4a9a]" required />
          <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e4a9a]" required />
          <button disabled={loading} className="w-full py-3 rounded-xl bg-[#0a1e40] text-white font-black disabled:opacity-60">{loading ? 'Signing in…' : 'Login →'}</button>
        </div>
        <div className="mt-4 text-center text-sm">
          No account? <Link to={pendingRedirect ? `/register?redirect=${encodeURIComponent(pendingRedirect)}` : '/register'} state={pendingRedirect ? { from: pendingRedirect } : undefined} className="text-[#1e4a9a] font-bold">Register</Link>
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
