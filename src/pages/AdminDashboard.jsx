import { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const PAGE_SIZE = 6;

function usePagination(data, page, size) {
  const total = data.length;
  const pages = Math.ceil(total / size) || 1;
  const cur = Math.min(page, pages);
  const start = (cur - 1) * size;
  return { sliced: data.slice(start, start + size), total, pages, cur };
}

// Sidebar menu definition covering all 11 entities
const MENU = [
  { id: 'bookings', label: 'Bookings', icon: '📋', desc: 'Orders & status' },
  { id: 'customers', label: 'Customers', icon: '👥', desc: 'Users' },
  { id: 'technicians', label: 'Technicians', icon: '👷', desc: 'Field team' },
  { id: 'services', label: 'Services', icon: '🛠️', desc: 'Catalog' },
  { id: 'products', label: 'Products', icon: '📦', desc: 'Inventory' },
  { id: 'payments', label: 'Payments', icon: '💳', desc: 'Razorpay' },
  { id: 'amc', label: 'AMC Plans', icon: '🛡️', desc: 'Annual' },
  { id: 'reviews', label: 'Reviews', icon: '⭐', desc: 'Ratings' },
  { id: 'coupons', label: 'Coupons', icon: '🎟️', desc: 'Discounts' },
  { id: 'quotes', label: 'Quotes', icon: '📨', desc: 'Requests' },
  { id: 'settings', label: 'Settings', icon: '⚙️', desc: 'Website' },
];

const STATUSES = ['pending','confirmed','technician_assigned','on_the_way','in_progress','completed','cancelled'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState('bookings');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-72 bg-[#0a1e40] text-white flex flex-col transition-transform`}>
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-[#0a1e40] grid place-items-center font-black">A</div>
            <div>
              <div className="font-black leading-none">AMD IT SOLUTION</div>
              <div className="text-[11px] tracking-[0.12em] text-yellow-400">ADMIN CONSOLE</div>
            </div>
          </div>
          <div className="mt-4 bg-white/10 rounded-xl px-3 py-2 text-xs">
            <div className="font-bold">{user?.fullname}</div>
            <div className="text-yellow-300">{user?.email} • admin</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {MENU.map(m => (
            <button key={m.id} onClick={() => { setActive(m.id); setMobileOpen(false); }} className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${active === m.id ? 'bg-yellow-400 text-[#0a1e40] font-black' : 'hover:bg-white/10 text-slate-200'}`}>
              <span className="text-lg">{m.icon}</span>
              <div className="flex-1">
                <div className="text-sm leading-none">{m.label}</div>
                <div className={`text-[11px] ${active === m.id ? 'text-[#0a1e40]/70' : 'text-slate-400'}`}>{m.desc}</div>
              </div>
              {active === m.id && <span>›</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <a href="/" className="block text-center py-2 rounded-full bg-white/10 border border-white/15 text-sm font-bold hover:bg-white hover:text-[#0a1e40] transition">← Back to Website</a>
        </div>
      </aside>

      {/* Overlay mobile */}
      {mobileOpen && <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/40 z-30 lg:hidden" />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 flex items-center gap-3 px-4 md:px-6 py-3">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg border">☰</button>
          <div>
            <h1 className="font-black text-[#0a1e40]">{MENU.find(m => m.id === active)?.label} Management</h1>
            <p className="text-xs text-slate-500">Master control — search, filter, paginate, update status. Customers cannot access these APIs (403).</p>
          </div>
          <div className="ml-auto hidden md:flex items-center gap-2">
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">● Live</span>
            <span className="bg-[#0a1e40] text-yellow-400 text-xs font-black px-3 py-1 rounded-full">Admin Only • RBAC</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          {active === 'bookings' && <BookingsTab />}
          {active === 'customers' && <CustomersTab />}
          {active === 'technicians' && <TechniciansTab />}
          {active === 'services' && <ServicesTab />}
          {active === 'products' && <ProductsTab />}
          {active === 'payments' && <PaymentsTab />}
          {active === 'amc' && <AmcTab />}
          {active === 'reviews' && <ReviewsTab />}
          {active === 'coupons' && <CouponsTab />}
          {active === 'quotes' && <QuotesTab />}
          {active === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}

/* ---------- BOOKINGS ---------- */
function BookingsTab() {
  const [data, setData] = useState([]);
  const [techs, setTechs] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [bks, t] = await Promise.all([client.get('/api/bookings'), client.get('/api/technicians')]);
      setData(bks.data.data); setTechs(t.data.data);
    } catch(e){ console.error(e); } finally{ setLoading(false); }
  };
  useEffect(()=>{ fetchAll(); },[]);

  const update = async (id, s) => { try{ await client.patch(`/api/bookings/${id}/status`, { status:s }); fetchAll(); } catch(e){ alert(e.response?.data?.message||e.message);} };
  const assign = async (id, tid) => { if(!tid) return; try{ await client.post(`/api/bookings/${id}/assign`, { technician: tid }); fetchAll(); } catch(e){ alert(e.response?.data?.message||e.message);} };

  let filtered = data;
  if (search) filtered = filtered.filter(b => (b.bookingId + b.customerName + b.customerEmail + b.service?.title).toLowerCase().includes(search.toLowerCase()));
  if (status !== 'all') filtered = filtered.filter(b => b.status === status);
  const { sliced, pages, cur } = usePagination(filtered, page, PAGE_SIZE);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <input value={search} onChange={e=>{setSearch(e.target.value); setPage(1);}} placeholder="Search bookingId, customer, service..." className="flex-1 min-w-[220px] rounded-full border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e4a9a]" />
        <select value={status} onChange={e=>{setStatus(e.target.value); setPage(1);}} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold">
          <option value="all">All status</option>{STATUSES.map(s=><option key={s} value={s}>{s.replace('_',' ')}</option>)}
        </select>
        <span className="text-xs bg-slate-100 border rounded-full px-3 py-2">{filtered.length} bookings</span>
      </div>

      {loading ? <div className="py-10 text-center">Loading…</div> : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b text-xs text-slate-500 text-left"><tr><th className="px-4 py-3">Booking ID</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Service</th><th className="px-4 py-3">Date•Slot</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Technician</th><th className="px-4 py-3">Actions</th></tr></thead>
              <tbody>
                {sliced.map(b=>(
                  <tr key={b._id} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-xs">{b.bookingId}<div className="text-[11px] text-slate-400">₹{b.totalAmount}</div></td>
                    <td className="px-4 py-3"><div className="font-bold">{b.customerName}</div><div className="text-xs text-slate-500">{b.customerPhone} • {b.city}</div></td>
                    <td className="px-4 py-3 text-xs">{b.service?.title}<div className="text-slate-400">{b.serviceType}</div></td>
                    <td className="px-4 py-3 text-xs">{new Date(b.date).toLocaleDateString()}<div className="text-slate-500">{b.timeSlot}</div></td>
                    <td className="px-4 py-3"><span className="text-xs font-black px-2 py-1 rounded-full bg-slate-100 border">{b.status.replace('_',' ')}</span></td>
                    <td className="px-4 py-3 text-xs">{b.technician ? <span className="font-bold">{b.technician?.user?.fullname||'Assigned'}</span> : <select defaultValue="" onChange={e=>assign(b._id,e.target.value)} className="rounded-full border px-2 py-1 text-xs bg-white"><option value="">Assign…</option>{techs.map(t=><option key={t._id} value={t._id}>{t.user?.fullname} ({t.specialization?.[0]||'gen'})</option>)}</select>}</td>
                    <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{b.status==='pending'&&<button onClick={()=>update(b._id,'confirmed')} className="px-2 py-1 rounded-full bg-blue-600 text-white text-xs font-bold">Confirm</button>}{b.status==='confirmed'&&<span className="text-xs text-slate-400">Assign tech →</span>}{b.status==='in_progress'&&<button onClick={()=>update(b._id,'completed')} className="px-2 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold">Complete</button>}{['pending','confirmed','technician_assigned'].includes(b.status)&&<button onClick={()=>update(b._id,'cancelled')} className="px-2 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold">Cancel</button>}<a href={`/booking/${b.bookingId||b._id}`} className="px-2 py-1 rounded-full border text-xs">View</a></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination cur={cur} pages={pages} onChange={setPage} />
        </div>
      )}
    </section>
  );
}

/* ---------- CUSTOMERS ---------- */
function CustomersTab() {
  const [data, setData]=useState([]);
  const [search, setSearch]=useState('');
  const [role, setRole]=useState('all');
  const [status, setStatus]=useState('all');
  const [page, setPage]=useState(1);
  const [loading, setLoading]=useState(true);
  const fetchAll=async()=>{
    setLoading(true);
    try{
      const {data}=await client.get('/api/auth/users', { params: { search: search||undefined, role: role==='all'?undefined:role, status: status==='all'?undefined:status, limit:100 }});
      setData(data.data||[]);
    }catch(e){ console.error(e);} finally{ setLoading(false);}
  };
  useEffect(()=>{ fetchAll(); },[search,role,status]);
  const toggleActive=async(u)=>{
    await client.put(`/api/auth/users/${u._id}`, { isActive: !u.isActive });
    fetchAll();
  };
  const del=async(id)=>{ if(!confirm('Delete user?'))return; await client.delete(`/api/auth/users/${id}`); fetchAll(); };
  const { sliced, pages, cur } = usePagination(data, page, PAGE_SIZE);
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input value={search} onChange={e=>{setSearch(e.target.value); setPage(1);}} placeholder="Search name, email, phone..." className="flex-1 min-w-[220px] rounded-full border px-4 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-[#1e4a9a]" />
        <select value={role} onChange={e=>{setRole(e.target.value); setPage(1);}} className="rounded-full border px-4 py-2 text-sm bg-white font-bold"><option value="all">All roles</option><option value="customer">customer</option><option value="technician">technician</option><option value="admin">admin</option></select>
        <select value={status} onChange={e=>{setStatus(e.target.value); setPage(1);}} className="rounded-full border px-4 py-2 text-sm bg-white font-bold"><option value="all">All</option><option value="active">active</option><option value="inactive">inactive</option></select>
      </div>
      <div className="bg-white rounded-2xl border shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm"><thead className="bg-slate-50 border-b text-xs text-slate-500 text-left"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Active</th><th className="px-4 py-3">Joined</th><th className="px-4 py-3">Actions</th></tr></thead>
            <tbody>{loading?<tr><td colSpan={6} className="py-10 text-center">Loading…</td></tr>: sliced.map(u=>(
              <tr key={u._id} className="border-b">
                <td className="px-4 py-3 font-bold">{u.fullname}<div className="text-xs text-slate-500">{u.phone||'—'}</div></td>
                <td className="px-4 py-3 text-xs">{u.email}</td>
                <td className="px-4 py-3"><select value={u.role} onChange={async e=>{ await client.put(`/api/auth/users/${u._id}`, { role:e.target.value}); fetchAll();}} className="rounded-full border px-2 py-1 text-xs font-bold bg-white"><option value="customer">customer</option><option value="technician">technician</option><option value="admin">admin</option></select></td>
                <td className="px-4 py-3"><button onClick={()=>toggleActive(u)} className={`px-2 py-1 rounded-full text-xs font-black border ${u.isActive?'bg-emerald-50 border-emerald-200 text-emerald-700':'bg-red-50 border-red-200 text-red-700'}`}>{u.isActive?'active':'inactive'}</button></td>
                <td className="px-4 py-3 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3"><button onClick={()=>del(u._id)} className="px-2 py-1 rounded-full bg-red-600 text-white text-xs font-bold">Delete</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <Pagination cur={cur} pages={pages} onChange={setPage} />
      </div>
    </section>
  );
}

/* ---------- TECHNICIANS ---------- */
function TechniciansTab() {
  const [data, setData]=useState([]);
  const [search, setSearch]=useState('');
  const [filter,setFilter]=useState('all');
  const [page,setPage]=useState(1);
  const [showCreate,setShowCreate]=useState(false);
  const [users,setUsers]=useState([]);
  const [form,setForm]=useState({ user:'', specialization:'CCTV', experienceYears:1, phone:'' });
  const fetchAll=async()=>{ const {data}=await client.get('/api/technicians'); setData(data.data); };
  useEffect(()=>{ fetchAll(); client.get('/api/auth/users', { params:{ role:'customer', limit:100 }}).then(r=>setUsers(r.data.data)).catch(()=>{}); },[]);
  let filtered=data;
  if(search) filtered=filtered.filter(t=>(t.user?.fullname+t.phone+t.specialization).toLowerCase().includes(search.toLowerCase()));
  if(filter==='verified') filtered=filtered.filter(t=>t.isVerified);
  if(filter==='available') filtered=filtered.filter(t=>t.isAvailable);
  const {sliced, pages, cur}=usePagination(filtered, page, PAGE_SIZE);
  const create=async(e)=>{ e.preventDefault(); try{ await client.post('/api/technicians', { user:form.user, specialization:[form.specialization], experienceYears:parseInt(form.experienceYears), phone:form.phone }); setShowCreate(false); fetchAll(); } catch(err){ alert(err.response?.data?.message||err.message);} };
  const toggle=async(t, field)=>{ await client.put(`/api/technicians/${t._id}`, { [field]: !t[field] }); fetchAll(); };
  const del=async(id)=>{ if(!confirm('Delete?'))return; await client.delete(`/api/technicians/${id}`); fetchAll(); };
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input value={search} onChange={e=>{setSearch(e.target.value); setPage(1);}} placeholder="Search technician..." className="flex-1 min-w-[200px] rounded-full border px-4 py-2 text-sm bg-white outline-none" />
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="rounded-full border px-4 py-2 text-sm bg-white font-bold"><option value="all">All</option><option value="verified">verified</option><option value="available">available</option></select>
        <button onClick={()=>setShowCreate(!showCreate)} className="px-4 py-2 rounded-full bg-[#0a1e40] text-white font-bold text-sm">+ New Technician</button>
      </div>
      {showCreate && <form onSubmit={create} className="bg-white border rounded-2xl p-4 grid md:grid-cols-4 gap-3">
        <select value={form.user} onChange={e=>setForm({...form,user:e.target.value})} className="rounded-xl border px-3 py-2 text-sm bg-slate-50" required><option value="">Select user</option>{users.map(u=><option key={u._id} value={u._id}>{u.fullname} ({u.email})</option>)}</select>
        <input value={form.specialization} onChange={e=>setForm({...form,specialization:e.target.value})} placeholder="Specialization (CCTV)" className="rounded-xl border px-3 py-2 text-sm" />
        <input type="number" value={form.experienceYears} onChange={e=>setForm({...form,experienceYears:e.target.value})} placeholder="Years" className="rounded-xl border px-3 py-2 text-sm" />
        <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone" className="rounded-xl border px-3 py-2 text-sm" />
        <button type="submit" className="md:col-span-4 py-2 rounded-xl bg-yellow-400 text-[#0a1e40] font-black">Create</button>
      </form>}
      <div className="bg-white rounded-2xl border shadow overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 border-b text-xs text-slate-500 text-left"><tr><th className="px-4 py-3">Technician</th><th className="px-4 py-3">Specialization</th><th className="px-4 py-3">Exp</th><th className="px-4 py-3">Rating</th><th className="px-4 py-3">Verified</th><th className="px-4 py-3">Available</th><th className="px-4 py-3">Actions</th></tr></thead>
          <tbody>{sliced.map(t=>(
            <tr key={t._id} className="border-b">
              <td className="px-4 py-3"><div className="font-bold">{t.user?.fullname}</div><div className="text-xs text-slate-500">{t.user?.email} • {t.phone}</div></td>
              <td className="px-4 py-3 text-xs">{t.specialization?.join(', ')}</td>
              <td className="px-4 py-3">{t.experienceYears}y</td>
              <td className="px-4 py-3">{t.rating} ★</td>
              <td className="px-4 py-3"><button onClick={()=>toggle(t,'isVerified')} className={`px-2 py-1 rounded-full text-xs font-black border ${t.isVerified?'bg-emerald-50 border-emerald-200 text-emerald-700':'bg-slate-100'}`}>{t.isVerified?'verified':'unverified'}</button></td>
              <td className="px-4 py-3"><button onClick={()=>toggle(t,'isAvailable')} className={`px-2 py-1 rounded-full text-xs font-black border ${t.isAvailable?'bg-blue-50 border-blue-200 text-blue-700':'bg-red-50 border-red-200 text-red-700'}`}>{t.isAvailable?'yes':'no'}</button></td>
              <td className="px-4 py-3"><button onClick={()=>del(t._id)} className="px-2 py-1 rounded-full bg-red-600 text-white text-xs font-bold">Delete</button></td>
            </tr>
          ))}</tbody></table></div>
        <Pagination cur={cur} pages={pages} onChange={setPage} />
      </div>
    </section>
  );
}

/* ---------- SERVICES ---------- */
function ServicesTab() {
  const [data,setData]=useState([]);
  const [search,setSearch]=useState('');
  const [cat,setCat]=useState('all');
  const [page,setPage]=useState(1);
  const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({ title:'', slug:'', description:'', category:'cctv', price:'', oldPrice:'', image:'', features:'' });
  const fetchAll=async()=>{ const {data}=await client.get('/api/services', { params:{ limit:100 } }); setData(data.data||[]); };
  useEffect(()=>{ fetchAll(); },[]);
  let filtered=data;
  if(search) filtered=filtered.filter(s=>(s.title+s.category).toLowerCase().includes(search.toLowerCase()));
  if(cat!=='all') filtered=filtered.filter(s=>s.category===cat);
  const {sliced, pages, cur}=usePagination(filtered, page, PAGE_SIZE);
  const submit=async(e)=>{ e.preventDefault(); try{ const payload={ ...form, price:parseFloat(form.price), oldPrice:form.oldPrice?parseFloat(form.oldPrice):undefined, features: form.features?form.features.split(',').map(s=>s.trim()):[] }; if(editing) await client.put(`/api/services/${editing}`, payload); else await client.post('/api/services', payload); setEditing(null); setForm({ title:'', slug:'', description:'', category:'cctv', price:'', oldPrice:'', image:'', features:'' }); fetchAll(); } catch(err){ alert(err.response?.data?.message||err.message);} };
  const del=async(id)=>{ if(!confirm('Delete service?'))return; await client.delete(`/api/services/${id}`); fetchAll(); };
  const startEdit=(s)=>{ setEditing(s._id); setForm({ title:s.title, slug:s.slug, description:s.description, category:s.category, price:String(s.price), oldPrice:s.oldPrice?String(s.oldPrice):'', image:s.image||'', features:(s.features||[]).join(', ') }); };
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input value={search} onChange={e=>{setSearch(e.target.value); setPage(1);}} placeholder="Search service..." className="flex-1 min-w-[200px] rounded-full border px-4 py-2 text-sm bg-white outline-none" />
        <select value={cat} onChange={e=>setCat(e.target.value)} className="rounded-full border px-4 py-2 text-sm bg-white font-bold"><option value="all">All categories</option><option value="cctv">cctv</option><option value="computer">computer</option><option value="networking">networking</option><option value="amc">amc</option><option value="biometric">biometric</option><option value="other">other</option></select>
      </div>
      <form onSubmit={submit} className="bg-white border rounded-2xl p-4 grid md:grid-cols-2 gap-3">
        <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title *" className="rounded-xl border px-3 py-2 text-sm bg-slate-50" required />
        <input value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} placeholder="Slug (unique) *" className="rounded-xl border px-3 py-2 text-sm bg-slate-50" required />
        <input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Price *" type="number" className="rounded-xl border px-3 py-2 text-sm" required />
        <input value={form.oldPrice} onChange={e=>setForm({...form,oldPrice:e.target.value})} placeholder="Old Price" type="number" className="rounded-xl border px-3 py-2 text-sm" />
        <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="rounded-xl border px-3 py-2 text-sm"><option value="cctv">cctv</option><option value="computer">computer</option><option value="networking">networking</option><option value="amc">amc</option><option value="biometric">biometric</option><option value="other">other</option></select>
        <input value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="Image URL" className="rounded-xl border px-3 py-2 text-sm" />
        <input value={form.features} onChange={e=>setForm({...form,features:e.target.value})} placeholder="Features comma separated" className="md:col-span-2 rounded-xl border px-3 py-2 text-sm" />
        <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description (10+ chars) *" rows={2} className="md:col-span-2 rounded-xl border px-3 py-2 text-sm bg-slate-50" required />
        <button type="submit" className="md:col-span-2 py-2 rounded-xl bg-[#0a1e40] text-white font-black">{editing?'Update':'Create'} Service</button>
        {editing&&<button type="button" onClick={()=>{setEditing(null); setForm({ title:'', slug:'', description:'', category:'cctv', price:'', oldPrice:'', image:'', features:'' });}} className="md:col-span-2 py-2 rounded-xl border font-bold">Cancel</button>}
      </form>
      <div className="bg-white rounded-2xl border shadow overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 border-b text-xs text-slate-500 text-left"><tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Active</th><th className="px-4 py-3">Actions</th></tr></thead>
          <tbody>{sliced.map(s=>(
            <tr key={s._id} className="border-b">
              <td className="px-4 py-3"><div className="font-bold">{s.title}</div><div className="text-xs text-slate-500">{s.slug}</div></td>
              <td className="px-4 py-3"><span className="text-xs bg-slate-100 border rounded-full px-2 py-1">{s.category}</span></td>
              <td className="px-4 py-3">₹{s.price} {s.oldPrice&&<span className="line-through text-slate-400 text-xs">₹{s.oldPrice}</span>}</td>
              <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-black border ${s.isActive?'bg-emerald-50 border-emerald-200 text-emerald-700':'bg-slate-100'}`}>{s.isActive?'active':'inactive'}</span></td>
              <td className="px-4 py-3"><div className="flex gap-1"><button onClick={()=>startEdit(s)} className="px-2 py-1 rounded-full border text-xs font-bold">Edit</button><button onClick={()=>del(s._id)} className="px-2 py-1 rounded-full bg-red-600 text-white text-xs font-bold">Delete</button></div></td>
            </tr>
          ))}</tbody></table></div>
        <Pagination cur={cur} pages={pages} onChange={setPage} />
      </div>
    </section>
  );
}

/* ---------- PRODUCTS ---------- */
function ProductsTab() {
  const [data,setData]=useState([]);
  const [search,setSearch]=useState('');
  const [page,setPage]=useState(1);
  const [form,setForm]=useState({ name:'', sku:'', category:'accessories', price:'', stock:'', image:'' });
  const [editing,setEditing]=useState(null);
  const fetchAll=async()=>{ const {data}=await client.get('/api/products'); setData(data.data); };
  useEffect(()=>{ fetchAll(); },[]);
  let filtered=data;
  if(search) filtered=filtered.filter(p=>(p.name+p.sku+p.category).toLowerCase().includes(search.toLowerCase()));
  const {sliced,pages,cur}=usePagination(filtered, page, PAGE_SIZE);
  const submit=async(e)=>{ e.preventDefault(); try{ const payload={ ...form, price:parseFloat(form.price), stock: parseInt(form.stock)||0 }; if(editing) await client.put(`/api/products/${editing}`, payload); else await client.post('/api/products', payload); setEditing(null); setForm({ name:'', sku:'', category:'accessories', price:'', stock:'', image:'' }); fetchAll(); } catch(err){ alert(err.response?.data?.message||err.message);} };
  const del=async(id)=>{ if(!confirm('Delete?'))return; await client.delete(`/api/products/${id}`); fetchAll(); };
  const startEdit=(p)=>{ setEditing(p._id); setForm({ name:p.name, sku:p.sku, category:p.category, price:String(p.price), stock:String(p.stock), image:p.image||'' }); };
  return (
    <section className="space-y-4">
      <div className="flex gap-2"><input value={search} onChange={e=>{setSearch(e.target.value); setPage(1);}} placeholder="Search products..." className="flex-1 rounded-full border px-4 py-2 text-sm bg-white outline-none" /></div>
      <form onSubmit={submit} className="bg-white border rounded-2xl p-4 grid md:grid-cols-3 gap-3">
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name *" className="rounded-xl border px-3 py-2 text-sm" required />
        <input value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} placeholder="SKU *" className="rounded-xl border px-3 py-2 text-sm" required />
        <input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Category *" className="rounded-xl border px-3 py-2 text-sm" required />
        <input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Price *" type="number" className="rounded-xl border px-3 py-2 text-sm" required />
        <input value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} placeholder="Stock" type="number" className="rounded-xl border px-3 py-2 text-sm" />
        <input value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="Image URL" className="rounded-xl border px-3 py-2 text-sm" />
        <button type="submit" className="md:col-span-3 py-2 rounded-xl bg-[#0a1e40] text-white font-black">{editing?'Update':'Create'} Product</button>
      </form>
      <div className="bg-white rounded-2xl border shadow overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 border-b text-xs text-slate-500 text-left"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">SKU</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>{sliced.map(p=>(
          <tr key={p._id} className="border-b">
            <td className="px-4 py-3 font-bold">{p.name}</td><td className="px-4 py-3 font-mono text-xs">{p.sku}</td><td className="px-4 py-3 text-xs">{p.category}</td><td className="px-4 py-3">₹{p.price}</td><td className="px-4 py-3">{p.stock}</td>
            <td className="px-4 py-3"><div className="flex gap-1"><button onClick={()=>startEdit(p)} className="px-2 py-1 rounded-full border text-xs">Edit</button><button onClick={()=>del(p._id)} className="px-2 py-1 rounded-full bg-red-600 text-white text-xs">Delete</button></div></td>
          </tr>))}</tbody></table></div>
        <Pagination cur={cur} pages={pages} onChange={setPage} />
      </div>
    </section>
  );
}

/* ---------- PAYMENTS ---------- */
function PaymentsTab() {
  const [data,setData]=useState([]);
  const [search,setSearch]=useState('');
  const [status,setStatus]=useState('all');
  const [page,setPage]=useState(1);
  const fetchAll=async()=>{ const {data}=await client.get('/api/payments'); setData(data.data); };
  useEffect(()=>{ fetchAll(); },[]);
  let filtered=data;
  if(search) filtered=filtered.filter(p=>(p.razorpayOrderId+p.razorpayPaymentId+p.booking?.bookingId).toLowerCase().includes(search.toLowerCase()));
  if(status!=='all') filtered=filtered.filter(p=>p.status===status);
  const {sliced,pages,cur}=usePagination(filtered, page, PAGE_SIZE);
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input value={search} onChange={e=>{setSearch(e.target.value); setPage(1);}} placeholder="Search order, payment, bookingId..." className="flex-1 min-w-[260px] rounded-full border px-4 py-2 text-sm bg-white outline-none" />
        <select value={status} onChange={e=>{setStatus(e.target.value); setPage(1);}} className="rounded-full border px-4 py-2 text-sm bg-white font-bold"><option value="all">All status</option><option value="pending">pending</option><option value="paid">paid</option><option value="failed">failed</option><option value="cancelled">cancelled</option></select>
      </div>
      <div className="bg-white rounded-2xl border shadow overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 border-b text-xs text-slate-500 text-left"><tr><th className="px-4 py-3">Booking</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Gateway</th><th className="px-4 py-3">Order ID</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th></tr></thead>
          <tbody>{sliced.map(p=>(
            <tr key={p._id} className="border-b">
              <td className="px-4 py-3 font-mono text-xs">{p.booking?.bookingId||p.booking}</td><td className="px-4 py-3">₹{p.amount}<div className="text-xs text-slate-500">{p.method}</div></td><td className="px-4 py-3 text-xs">{p.gateway}</td><td className="px-4 py-3 font-mono text-[11px]">{p.razorpayOrderId||'—'}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-black border ${p.status==='paid'?'bg-emerald-50 border-emerald-200 text-emerald-700':p.status==='pending'?'bg-amber-50 border-amber-200 text-amber-700':'bg-red-50 border-red-200 text-red-700'}`}>{p.status}</span></td><td className="px-4 py-3 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
            </tr>))}</tbody></table></div>
        <Pagination cur={cur} pages={pages} onChange={setPage} />
      </div>
      <div className="text-xs text-slate-500">Payments are HMAC verified. Never trust frontend success. Webhook: <span className="font-mono bg-slate-100 border rounded px-2 py-1">POST /api/payments/webhook</span></div>
    </section>
  );
}

/* ---------- AMC ---------- */
function AmcTab() {
  const [data,setData]=useState([]);
  const [form,setForm]=useState({ name:'', slug:'', price:'', period:'yearly', forType:'Small Office', features:'4 Visits, Support', isPopular:false });
  const [editing,setEditing]=useState(null);
  const fetchAll=async()=>{ const {data}=await client.get('/api/amc-plans'); setData(data.data); };
  useEffect(()=>{ fetchAll(); },[]);
  const submit=async(e)=>{ e.preventDefault(); const payload={ ...form, price:parseFloat(form.price), features: form.features.split(',').map(s=>s.trim()) }; try{ if(editing) await client.put(`/api/amc-plans/${editing}`, payload); else await client.post('/api/amc-plans', payload); setEditing(null); setForm({ name:'', slug:'', price:'', period:'yearly', forType:'Small Office', features:'4 Visits, Support', isPopular:false }); fetchAll(); } catch(err){ alert(err.response?.data?.message||err.message);} };
  const del=async(id)=>{ if(!confirm('Delete?'))return; await client.delete(`/api/amc-plans/${id}`); fetchAll(); };
  const startEdit=(a)=>{ setEditing(a._id); setForm({ name:a.name, slug:a.slug, price:String(a.price), period:a.period, forType:a.forType, features:(a.features||[]).join(', '), isPopular:a.isPopular }); };
  return (
    <section className="space-y-4">
      <form onSubmit={submit} className="bg-white border rounded-2xl p-4 grid md:grid-cols-3 gap-3">
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name *" className="rounded-xl border px-3 py-2 text-sm" required />
        <input value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} placeholder="Slug *" className="rounded-xl border px-3 py-2 text-sm" required />
        <input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Price *" type="number" className="rounded-xl border px-3 py-2 text-sm" required />
        <select value={form.period} onChange={e=>setForm({...form,period:e.target.value})} className="rounded-xl border px-3 py-2 text-sm"><option value="yearly">yearly</option><option value="monthly">monthly</option></select>
        <input value={form.forType} onChange={e=>setForm({...form,forType:e.target.value})} placeholder="For (e.g. Small Office)" className="rounded-xl border px-3 py-2 text-sm" required />
        <input value={form.features} onChange={e=>setForm({...form,features:e.target.value})} placeholder="Features comma separated" className="rounded-xl border px-3 py-2 text-sm" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPopular} onChange={e=>setForm({...form,isPopular:e.target.checked})} /> Popular</label>
        <button type="submit" className="md:col-span-3 py-2 rounded-xl bg-[#0a1e40] text-white font-black">{editing?'Update':'Create'} AMC Plan</button>
      </form>
      <div className="bg-white rounded-2xl border shadow overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 border-b text-xs text-slate-500 text-left"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Period</th><th className="px-4 py-3">Popular</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>{data.map(a=>(
          <tr key={a._id} className="border-b">
            <td className="px-4 py-3 font-bold">{a.name}<div className="text-xs text-slate-500">{a.forType}</div></td><td className="px-4 py-3 font-mono text-xs">{a.slug}</td><td className="px-4 py-3">₹{a.price}</td><td className="px-4 py-3">{a.period}</td><td className="px-4 py-3">{a.isPopular?'⭐':'—'}</td><td className="px-4 py-3"><div className="flex gap-1"><button onClick={()=>startEdit(a)} className="px-2 py-1 rounded-full border text-xs">Edit</button><button onClick={()=>del(a._id)} className="px-2 py-1 rounded-full bg-red-600 text-white text-xs">Delete</button></div></td>
          </tr>))}</tbody></table></div>
      </div>
    </section>
  );
}

/* ---------- REVIEWS ---------- */
function ReviewsTab() {
  const [data,setData]=useState([]);
  const [search,setSearch]=useState('');
  const [rating,setRating]=useState('all');
  const [page,setPage]=useState(1);
  const fetchAll=async()=>{ const {data}=await client.get('/api/reviews'); setData(data.data); };
  useEffect(()=>{ fetchAll(); },[]);
  let filtered=data;
  if(search) filtered=filtered.filter(r=>r.comment.toLowerCase().includes(search.toLowerCase()));
  if(rating!=='all') filtered=filtered.filter(r=>String(r.rating)===rating);
  const {sliced,pages,cur}=usePagination(filtered, page, PAGE_SIZE);
  const del=async(id)=>{ if(!confirm('Delete review?'))return; await client.delete(`/api/reviews/${id}`); fetchAll(); };
  return (
    <section className="space-y-4">
      <div className="flex gap-2">
        <input value={search} onChange={e=>{setSearch(e.target.value); setPage(1);}} placeholder="Search reviews..." className="flex-1 rounded-full border px-4 py-2 text-sm bg-white outline-none" />
        <select value={rating} onChange={e=>setRating(e.target.value)} className="rounded-full border px-4 py-2 text-sm bg-white font-bold"><option value="all">All ratings</option><option value="5">5★</option><option value="4">4★</option><option value="3">3★</option></select>
      </div>
      <div className="bg-white rounded-2xl border shadow overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 border-b text-xs text-slate-500 text-left"><tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Rating</th><th className="px-4 py-3">Comment</th><th className="px-4 py-3">Service</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>{sliced.map(r=>(
          <tr key={r._id} className="border-b">
            <td className="px-4 py-3 font-bold">{r.user?.fullname||r.user}<div className="text-xs text-slate-500">{r.isVerifiedPurchase?'Verified':''}</div></td><td className="px-4 py-3">{'★'.repeat(r.rating)}</td><td className="px-4 py-3 max-w-[300px] truncate">{r.comment}</td><td className="px-4 py-3 text-xs">{r.service?.title||r.service||'—'}</td><td className="px-4 py-3 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td><td className="px-4 py-3"><button onClick={()=>del(r._id)} className="px-2 py-1 rounded-full bg-red-600 text-white text-xs">Delete</button></td>
          </tr>))}</tbody></table></div>
        <Pagination cur={cur} pages={pages} onChange={setPage} />
      </div>
    </section>
  );
}

/* ---------- COUPONS ---------- */
function CouponsTab() {
  const [data,setData]=useState([]);
  const [form,setForm]=useState({ code:'', discountType:'percent', discountValue:'', minAmount:'', expiry:'', usageLimit:'100' });
  const [editing,setEditing]=useState(null);
  const fetchAll=async()=>{ const {data}=await client.get('/api/coupons'); setData(data.data); };
  useEffect(()=>{ fetchAll(); },[]);
  const submit=async(e)=>{ e.preventDefault(); const payload={ code:form.code, discountType:form.discountType, discountValue:parseFloat(form.discountValue), minAmount: parseFloat(form.minAmount)||0, expiry: new Date(form.expiry).toISOString(), usageLimit: parseInt(form.usageLimit)||100 }; try{ if(editing) await client.put(`/api/coupons/${editing}`, payload); else await client.post('/api/coupons', payload); setEditing(null); setForm({ code:'', discountType:'percent', discountValue:'', minAmount:'', expiry:'', usageLimit:'100' }); fetchAll(); } catch(err){ alert(err.response?.data?.message||err.message);} };
  const startEdit=(c)=>{ setEditing(c._id); setForm({ code:c.code, discountType:c.discountType, discountValue:String(c.discountValue), minAmount:String(c.minAmount), expiry: c.expiry?new Date(c.expiry).toISOString().slice(0,10):'', usageLimit:String(c.usageLimit) }); };
  const del=async(id)=>{ if(!confirm('Delete coupon?'))return; await client.delete(`/api/coupons/${id}`); fetchAll(); };
  const toggle=async(c)=>{ await client.put(`/api/coupons/${c._id}`, { isActive: !c.isActive }); fetchAll(); };
  return (
    <section className="space-y-4">
      <form onSubmit={submit} className="bg-white border rounded-2xl p-4 grid md:grid-cols-3 gap-3">
        <input value={form.code} onChange={e=>setForm({...form,code:e.target.value})} placeholder="Code *" className="rounded-xl border px-3 py-2 text-sm" required />
        <select value={form.discountType} onChange={e=>setForm({...form,discountType:e.target.value})} className="rounded-xl border px-3 py-2 text-sm"><option value="percent">percent</option><option value="flat">flat</option></select>
        <input value={form.discountValue} onChange={e=>setForm({...form,discountValue:e.target.value})} placeholder="Value *" type="number" className="rounded-xl border px-3 py-2 text-sm" required />
        <input value={form.minAmount} onChange={e=>setForm({...form,minAmount:e.target.value})} placeholder="Min Amount" type="number" className="rounded-xl border px-3 py-2 text-sm" />
        <input value={form.expiry} onChange={e=>setForm({...form,expiry:e.target.value})} type="date" className="rounded-xl border px-3 py-2 text-sm" required />
        <input value={form.usageLimit} onChange={e=>setForm({...form,usageLimit:e.target.value})} placeholder="Limit" type="number" className="rounded-xl border px-3 py-2 text-sm" />
        <button type="submit" className="md:col-span-3 py-2 rounded-xl bg-[#0a1e40] text-white font-black">{editing?'Update':'Create'} Coupon</button>
      </form>
      <div className="bg-white rounded-2xl border shadow overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 border-b text-xs text-slate-500 text-left"><tr><th className="px-4 py-3">Code</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Value</th><th className="px-4 py-3">Min</th><th className="px-4 py-3">Expiry</th><th className="px-4 py-3">Active</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>{data.map(c=>(
          <tr key={c._id} className="border-b">
            <td className="px-4 py-3 font-mono font-bold">{c.code}</td><td className="px-4 py-3">{c.discountType}</td><td className="px-4 py-3">{c.discountValue}{c.discountType==='percent'?'%':''}</td><td className="px-4 py-3">₹{c.minAmount}</td><td className="px-4 py-3 text-xs">{c.expiry?new Date(c.expiry).toLocaleDateString():'—'}</td><td className="px-4 py-3"><button onClick={()=>toggle(c)} className={`px-2 py-1 rounded-full text-xs font-black border ${c.isActive?'bg-emerald-50 border-emerald-200 text-emerald-700':'bg-slate-100'}`}>{c.isActive?'active':'inactive'}</button></td><td className="px-4 py-3"><div className="flex gap-1"><button onClick={()=>startEdit(c)} className="px-2 py-1 rounded-full border text-xs">Edit</button><button onClick={()=>del(c._id)} className="px-2 py-1 rounded-full bg-red-600 text-white text-xs">Delete</button></div></td>
          </tr>))}</tbody></table></div>
      </div>
    </section>
  );
}

/* ---------- QUOTES ---------- */
function QuotesTab() {
  const [data,setData]=useState([]);
  const [status,setStatus]=useState('all');
  const [search,setSearch]=useState('');
  const [page,setPage]=useState(1);
  const fetchAll=async()=>{ const {data}=await client.get('/api/quotes'); setData(data.data); };
  useEffect(()=>{ fetchAll(); },[]);
  let filtered=data;
  if(status!=='all') filtered=filtered.filter(q=>q.status===status);
  if(search) filtered=filtered.filter(q=>(q.name+q.email+q.serviceType).toLowerCase().includes(search.toLowerCase()));
  const {sliced,pages,cur}=usePagination(filtered, page, PAGE_SIZE);
  const update=async(id,s)=>{ await client.patch(`/api/quotes/${id}/status`, { status:s }); fetchAll(); };
  const del=async(id)=>{ if(!confirm('Delete?'))return; await client.delete(`/api/quotes/${id}`); fetchAll(); };
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input value={search} onChange={e=>{setSearch(e.target.value); setPage(1);}} placeholder="Search name, email, service..." className="flex-1 min-w-[220px] rounded-full border px-4 py-2 text-sm bg-white outline-none" />
        <select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-full border px-4 py-2 text-sm bg-white font-bold"><option value="all">All</option><option value="new">new</option><option value="contacted">contacted</option><option value="quoted">quoted</option><option value="closed">closed</option></select>
      </div>
      <div className="bg-white rounded-2xl border shadow overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 border-b text-xs text-slate-500 text-left"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Contact</th><th className="px-4 py-3">Service</th><th className="px-4 py-3">Message</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>{sliced.map(q=>(
          <tr key={q._id} className="border-b">
            <td className="px-4 py-3 font-bold">{q.name}</td><td className="px-4 py-3 text-xs">{q.email}<div className="text-slate-500">{q.phone}</div></td><td className="px-4 py-3 text-xs">{q.serviceType}</td><td className="px-4 py-3 max-w-[240px] truncate text-xs">{q.message}</td><td className="px-4 py-3"><select value={q.status} onChange={e=>update(q._id,e.target.value)} className="rounded-full border px-2 py-1 text-xs font-bold bg-white"><option value="new">new</option><option value="contacted">contacted</option><option value="quoted">quoted</option><option value="closed">closed</option></select></td><td className="px-4 py-3 text-xs">{new Date(q.createdAt).toLocaleDateString()}</td><td className="px-4 py-3"><button onClick={()=>del(q._id)} className="px-2 py-1 rounded-full bg-red-600 text-white text-xs">Delete</button></td>
          </tr>))}</tbody></table></div>
        <Pagination cur={cur} pages={pages} onChange={setPage} />
      </div>
    </section>
  );
}

/* ---------- SETTINGS ---------- */
function SettingsTab() {
  const [form,setForm]=useState(null);
  const [saving,setSaving]=useState(false);
  const fetchAll=async()=>{ const {data}=await client.get('/api/settings'); setForm(data.data); };
  useEffect(()=>{ fetchAll(); },[]);
  const save=async(e)=>{ e.preventDefault(); setSaving(true); try{ const {data}=await client.put('/api/settings', form); setForm(data.data); alert('Settings saved'); } catch(err){ alert(err.response?.data?.message||err.message);} finally{ setSaving(false);} };
  if(!form) return <div className="py-10 text-center">Loading settings…</div>;
  return (
    <form onSubmit={save} className="space-y-4 max-w-3xl">
      <div className="bg-white border rounded-2xl p-5 grid md:grid-cols-2 gap-4">
        <div><label className="text-xs font-bold text-slate-600">Site Name</label><input value={form.siteName||''} onChange={e=>setForm({...form,siteName:e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-slate-50" /></div>
        <div><label className="text-xs font-bold text-slate-600">Tagline</label><input value={form.tagline||''} onChange={e=>setForm({...form,tagline:e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-slate-50" /></div>
        <div><label className="text-xs font-bold text-slate-600">Phone</label><input value={form.contactPhone||''} onChange={e=>setForm({...form,contactPhone:e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-slate-50" /></div>
        <div><label className="text-xs font-bold text-slate-600">Email</label><input value={form.contactEmail||''} onChange={e=>setForm({...form,contactEmail:e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-slate-50" /></div>
        <div className="md:col-span-2"><label className="text-xs font-bold text-slate-600">Address</label><input value={form.address||''} onChange={e=>setForm({...form,address:e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-slate-50" /></div>
        <div><label className="text-xs font-bold text-slate-600">WhatsApp</label><input value={form.whatsapp||''} onChange={e=>setForm({...form,whatsapp:e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-slate-50" /></div>
        <div><label className="text-xs font-bold text-slate-600">City</label><input value={form.city||''} onChange={e=>setForm({...form,city:e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-slate-50" /></div>
        <div><label className="text-xs font-bold">Facebook</label><input value={form.social?.facebook||''} onChange={e=>setForm({...form,social:{...form.social,facebook:e.target.value}})} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-slate-50" /></div>
        <div><label className="text-xs font-bold">Instagram</label><input value={form.social?.instagram||''} onChange={e=>setForm({...form,social:{...form.social,instagram:e.target.value}})} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-slate-50" /></div>
        <div className="md:col-span-2"><label className="text-xs font-bold">Hero Title</label><input value={form.heroTitle||''} onChange={e=>setForm({...form,heroTitle:e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-slate-50" /></div>
        <div className="md:col-span-2"><label className="text-xs font-bold">Hero Subtitle</label><input value={form.heroSubtitle||''} onChange={e=>setForm({...form,heroSubtitle:e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-slate-50" /></div>
        <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={!!form.maintenanceMode} onChange={e=>setForm({...form,maintenanceMode:e.target.checked})} /> Maintenance Mode</label>
      </div>
      <button type="submit" disabled={saving} className="px-6 py-3 rounded-xl bg-[#0a1e40] text-white font-black disabled:opacity-60">{saving?'Saving…':'Save Website Settings'}</button>
    </form>
  );
}

/* ---------- helpers ---------- */
function Pagination({ cur, pages, onChange }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50 text-sm">
      <div className="text-xs text-slate-500">Page {cur} of {pages}</div>
      <div className="flex gap-1">
        <button disabled={cur<=1} onClick={()=>onChange(cur-1)} className="px-3 py-1 rounded-full border bg-white disabled:opacity-40">Prev</button>
        {Array.from({length: pages}, (_,i)=>i+1).map(p=>(
          <button key={p} onClick={()=>onChange(p)} className={`w-8 h-8 rounded-full text-xs font-black border ${p===cur?'bg-[#0a1e40] text-white':'bg-white'}`}>{p}</button>
        ))}
        <button disabled={cur>=pages} onClick={()=>onChange(cur+1)} className="px-3 py-1 rounded-full border bg-white disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}
