import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      const u = await login(form.email, form.password);
      const dest = loc.state?.from || (u.role === 'admin' ? '/admin/bookings' : u.role === 'technician' ? '/technician/bookings' : '/customer/bookings');
      nav(dest);
    } catch (e) { setErr(e.response?.data?.message || e.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-[24px] border border-slate-200 shadow-xl p-6 md:p-8">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[#0a1e40] text-white grid place-items-center font-black mx-auto">A</div>
          <h1 className="mt-3 text-2xl font-black text-[#0a1e40]">Welcome Back</h1>
          <p className="text-sm text-slate-500">Login to manage your bookings</p>
        </div>
        {err && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-2">{err}</div>}
        <div className="mt-5 space-y-3">
          <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e4a9a]" required />
          <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e4a9a]" required />
          <button disabled={loading} className="w-full py-3 rounded-xl bg-[#0a1e40] text-white font-black disabled:opacity-60">{loading ? 'Signing in…' : 'Login →'}</button>
        </div>
        <div className="mt-4 text-center text-sm">
          No account? <Link to="/register" className="text-[#1e4a9a] font-bold">Register</Link>
        </div>
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-center">
          Demo: use any registered role. Admin/Technician must be seeded via backend.
        </div>
      </form>
    </div>
  );
}
