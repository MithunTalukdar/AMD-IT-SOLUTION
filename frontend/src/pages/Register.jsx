import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ fullname: '', email: '', password: '', phone: '', role: 'customer' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      await register(form);
      nav('/customer/bookings');
    } catch (e) { setErr(e.response?.data?.message || e.response?.data?.errors?.[0]?.message || e.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-[24px] border border-slate-200 shadow-xl p-6 md:p-8">
        <h1 className="text-2xl font-black text-[#0a1e40] text-center">Create Account</h1>
        <p className="text-sm text-slate-500 text-center">Join AMD IT SOLUTION</p>
        {err && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-2">{err}</div>}
        <div className="mt-5 space-y-3">
          <input placeholder="Full Name *" value={form.fullname} onChange={e => setForm({ ...form, fullname: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e4a9a]" required />
          <input placeholder="Email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" required />
          <input placeholder="Password (min 6) *" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" required />
          <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none">
            <option value="customer">Customer</option>
            <option value="technician">Technician (request)</option>
          </select>
          <button disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0a1e40] font-black disabled:opacity-60">{loading ? 'Creating…' : 'Create Account →'}</button>
        </div>
        <div className="mt-4 text-center text-sm">Have account? <Link to="/login" className="text-[#1e4a9a] font-bold">Login</Link></div>
      </form>
    </div>
  );
}
