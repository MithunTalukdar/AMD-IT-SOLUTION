import { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const PAGE_SIZE = 8;

function usePagination(data, page, size) {
  const total = data.length;
  const pages = Math.ceil(total / size) || 1;
  const cur = Math.min(page, pages);
  const start = (cur - 1) * size;
  return { sliced: data.slice(start, start + size), total, pages, cur };
}

const MENU = [
  { id: 'bookings', label: 'Bookings', icon: '📋', desc: 'Orders & Live Status' },
  { id: 'customers', label: 'Customers', icon: '👥', desc: 'User Accounts' },
  { id: 'technicians', label: 'Technicians', icon: '👷', desc: 'Field Engineers' },
  { id: 'services', label: 'Services', icon: '🛠️', desc: 'Catalog & Prices' },
  { id: 'products', label: 'Products', icon: '📦', desc: 'Hardware Inventory' },
  { id: 'payments', label: 'Payments', icon: '💳', desc: 'Razorpay Records' },
  { id: 'amc', label: 'AMC Plans', icon: '🛡️', desc: 'Annual Contracts' },
  { id: 'reviews', label: 'Reviews', icon: '⭐', desc: 'Customer Ratings' },
  { id: 'coupons', label: 'Coupons', icon: '🎟️', desc: 'Discounts & Offers' },
  { id: 'quotes', label: 'Quotes', icon: '📨', desc: 'Custom Requests' },
  { id: 'settings', label: 'Settings', icon: '⚙️', desc: 'Website Configuration' },
];

const STATUS_CONFIG = {
  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  confirmed: { label: 'Confirmed', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  technician_assigned: { label: 'Assigned', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  on_the_way: { label: 'On The Way', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  in_progress: { label: 'In Progress', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-500' },
  completed: { label: 'Completed', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState('bookings');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-72 bg-[#0a1e40] text-white flex flex-col transition-transform duration-300 shadow-2xl`}>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-[#0a1e40] grid place-items-center font-black text-xl shadow-md">
              A
            </div>
            <div>
              <div className="font-black text-base tracking-tight leading-tight">AMD IT SOLUTION</div>
              <div className="text-[10px] tracking-[0.15em] text-yellow-400 font-bold uppercase">Master Admin Console</div>
            </div>
          </div>
          <div className="mt-4 bg-white/10 rounded-xl p-3 text-xs border border-white/10">
            <div className="font-bold flex items-center gap-1.5 text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {user?.fullname || 'Admin'}
            </div>
            <div className="text-yellow-300/90 text-[11px] truncate mt-0.5">{user?.email}</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
          {MENU.map(m => (
            <button
              key={m.id}
              onClick={() => { setActive(m.id); setMobileOpen(false); }}
              className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${active === m.id ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-[#0a1e40] font-black shadow-md shadow-amber-500/20' : 'hover:bg-white/10 text-slate-200 font-medium'}`}
            >
              <span className="text-xl">{m.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm leading-tight truncate">{m.label}</div>
                <div className={`text-[11px] truncate ${active === m.id ? 'text-[#0a1e40]/80 font-bold' : 'text-slate-400'}`}>{m.desc}</div>
              </div>
              {active === m.id && <span className="font-bold text-sm">›</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <a
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white hover:text-[#0a1e40] border border-white/15 text-xs font-bold transition"
          >
            <span>🌐</span> View Customer Site
          </a>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden" />
      )}

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-xl border border-slate-300 hover:bg-slate-50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-slate-900 text-lg md:text-xl tracking-tight">
                  {MENU.find(m => m.id === active)?.label} Management
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                  {MENU.find(m => m.id === active)?.desc}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">Real-time database records and administrative actions.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live DB
            </span>
            <span className="bg-[#0a1e40] text-yellow-400 text-xs font-black px-3.5 py-1.5 rounded-full shadow-sm">
              🛡️ Master Admin
            </span>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-4 md:p-8 space-y-6">
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

/* =========================================================================
   1. BOOKINGS TAB (Full Details Modal, Real-time status, Delete, Assign)
   ========================================================================= */
function BookingsTab() {
  const [data, setData] = useState([]);
  const [techs, setTechs] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeBooking, setActiveBooking] = useState(null); // Modal detail view
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [bks, t] = await Promise.all([
        client.get('/api/bookings'),
        client.get('/api/technicians')
      ]);
      setData(bks.data.data || []);
      setTechs(t.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const updateStatus = async (id, s, note) => {
    setUpdatingId(id);
    try {
      await client.patch(`/api/bookings/${id}/status`, { status: s, note: note || `Updated via Admin Console to ${s}` });
      await fetchAll();
      if (activeBooking && activeBooking._id === id) {
        // Refresh modal data
        const res = await client.get(`/api/bookings/${id}`);
        setActiveBooking(res.data.data);
      }
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const assignTech = async (id, tid) => {
    if (!tid) return;
    setUpdatingId(id);
    try {
      await client.post(`/api/bookings/${id}/assign`, { technician: tid });
      await fetchAll();
      if (activeBooking && activeBooking._id === id) {
        const res = await client.get(`/api/bookings/${id}`);
        setActiveBooking(res.data.data);
      }
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteBooking = async (id, bId) => {
    if (!confirm(`Are you sure you want to PERMANENTLY delete booking ${bId || id}? This cannot be undone.`)) return;
    try {
      await client.delete(`/api/bookings/${id}`);
      if (activeBooking && activeBooking._id === id) setActiveBooking(null);
      await fetchAll();
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  };

  // Metrics
  const stats = {
    total: data.length,
    pending: data.filter(b => b.status === 'pending').length,
    confirmed: data.filter(b => ['confirmed', 'technician_assigned', 'on_the_way'].includes(b.status)).length,
    inProgress: data.filter(b => b.status === 'in_progress').length,
    completed: data.filter(b => b.status === 'completed').length,
    cancelled: data.filter(b => b.status === 'cancelled').length,
    revenue: data.filter(b => b.status === 'completed').reduce((acc, b) => acc + (b.totalAmount || 0), 0),
  };

  let filtered = data;
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(b =>
      (b.bookingId || '').toLowerCase().includes(q) ||
      (b.customerName || '').toLowerCase().includes(q) ||
      (b.customerPhone || '').toLowerCase().includes(q) ||
      (b.customerEmail || '').toLowerCase().includes(q) ||
      (b.service?.title || '').toLowerCase().includes(q) ||
      (b.city || '').toLowerCase().includes(q)
    );
  }
  if (statusFilter !== 'all') {
    filtered = filtered.filter(b => b.status === statusFilter);
  }

  const { sliced, pages, cur } = usePagination(filtered, page, PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">Total Orders</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
        </div>
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-sm">
          <div className="text-xs font-bold text-amber-800 uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Pending Action
          </div>
          <div className="text-2xl font-black text-amber-900 mt-1">{stats.pending}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 shadow-sm">
          <div className="text-xs font-bold text-blue-800 uppercase">Confirmed/Assigned</div>
          <div className="text-2xl font-black text-blue-900 mt-1">{stats.confirmed}</div>
        </div>
        <div className="bg-sky-50 p-4 rounded-2xl border border-sky-200 shadow-sm">
          <div className="text-xs font-bold text-sky-800 uppercase">In Progress</div>
          <div className="text-2xl font-black text-sky-900 mt-1">{stats.inProgress}</div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-sm">
          <div className="text-xs font-bold text-emerald-800 uppercase">Completed</div>
          <div className="text-2xl font-black text-emerald-900 mt-1">{stats.completed}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 shadow-sm">
          <div className="text-xs font-bold text-purple-800 uppercase">Realized Revenue</div>
          <div className="text-2xl font-black text-purple-900 mt-1">₹{stats.revenue}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="w-full md:w-96 relative">
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by ID, name, mobile, service, city..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#0a1e40] transition"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto items-center justify-start md:justify-end">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {['all', 'pending', 'confirmed', 'technician_assigned', 'in_progress', 'completed', 'cancelled'].map(st => {
              const count = st === 'all' ? data.length : data.filter(b => b.status === st).length;
              return (
                <button
                  key={st}
                  onClick={() => { setStatusFilter(st); setPage(1); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${statusFilter === st ? 'bg-[#0a1e40] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {st === 'all' ? 'All' : st.replace('_', ' ')} ({count})
                </button>
              );
            })}
          </div>

          <button
            onClick={fetchAll}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold flex items-center gap-1"
            title="Refresh bookings from server"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-500 font-semibold flex flex-col items-center gap-2">
            <span className="w-8 h-8 border-4 border-slate-200 border-t-[#0a1e40] rounded-full animate-spin" />
            Loading real-time bookings...
          </div>
        ) : sliced.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <div className="text-4xl mb-2">📋</div>
            <div className="font-bold text-slate-800 text-base">No bookings found</div>
            <div className="text-xs text-slate-400">Try changing search query or status filter.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Booking ID & Date</th>
                  <th className="px-5 py-3.5">Customer Contact</th>
                  <th className="px-5 py-3.5">Service & Amount</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Technician</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sliced.map(b => {
                  const sc = STATUS_CONFIG[b.status] || { label: b.status, bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-400' };
                  return (
                    <tr key={b._id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Booking ID & Date */}
                      <td className="px-5 py-4">
                        <div className="font-mono font-black text-xs text-[#0a1e40] bg-slate-100 px-2 py-1 rounded inline-block">
                          {b.bookingId || b._id}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <span>📅 {new Date(b.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span className="text-slate-300">•</span>
                          <span className="font-semibold text-slate-600">{b.timeSlot}</span>
                        </div>
                      </td>

                      {/* Customer Contact */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900">{b.customerName}</div>
                        <div className="text-xs text-slate-600 flex items-center gap-2 mt-0.5">
                          <a href={`tel:${b.customerPhone}`} className="text-indigo-600 hover:underline font-semibold flex items-center gap-0.5">
                            📞 {b.customerPhone}
                          </a>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 truncate max-w-[120px]">{b.city || 'Kolkata'}</span>
                        </div>
                      </td>

                      {/* Service & Amount */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 text-xs">{b.service?.title || 'General Service'}</div>
                        <div className="text-xs font-black text-emerald-700 mt-0.5">
                          ₹{b.totalAmount}
                          {b.coupon && <span className="ml-1 text-[10px] text-amber-600 font-bold bg-amber-50 px-1 rounded">Coupon</span>}
                        </div>
                      </td>

                      {/* Status Pill */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black border ${sc.bg} ${sc.text} ${sc.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </td>

                      {/* Technician */}
                      <td className="px-5 py-4">
                        {b.technician ? (
                          <div className="text-xs">
                            <div className="font-bold text-slate-800 flex items-center gap-1">
                              <span>👷</span> {b.technician?.user?.fullname || 'Technician'}
                            </div>
                            <div className="text-[11px] text-slate-500">{b.technician?.user?.phone || b.technician?.phone || 'Assigned'}</div>
                          </div>
                        ) : (
                          <select
                            defaultValue=""
                            disabled={updatingId === b._id}
                            onChange={e => assignTech(b._id, e.target.value)}
                            className="text-xs rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-semibold text-slate-700 outline-none focus:ring-1 focus:ring-[#0a1e40]"
                          >
                            <option value="">+ Assign Tech</option>
                            {techs.map(t => (
                              <option key={t._id} value={t._id}>
                                {t.user?.fullname || 'Technician'} ({t.specialization?.[0] || 'Gen'})
                              </option>
                            ))}
                          </select>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Confirm */}
                          {b.status === 'pending' && (
                            <button
                              disabled={updatingId === b._id}
                              onClick={() => updateStatus(b._id, 'confirmed')}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
                              title="Confirm booking"
                            >
                              Confirm
                            </button>
                          )}

                          {/* Quick Complete */}
                          {['technician_assigned', 'on_the_way', 'in_progress'].includes(b.status) && (
                            <button
                              disabled={updatingId === b._id}
                              onClick={() => updateStatus(b._id, 'completed')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
                              title="Mark as completed"
                            >
                              Complete
                            </button>
                          )}

                          {/* View details modal button */}
                          <button
                            onClick={() => setActiveBooking(b)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition"
                          >
                            Details
                          </button>

                          {/* Delete booking */}
                          <button
                            onClick={() => deleteBooking(b._id, b.bookingId)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                            title="Delete booking permanently"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Pagination cur={cur} pages={pages} onChange={setPage} />
      </div>

      {/* Full Booking Details Modal */}
      {activeBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#0a1e40] text-white p-5 flex items-center justify-between rounded-t-3xl">
              <div>
                <div className="text-xs text-yellow-400 font-bold uppercase tracking-wider">Booking Audit & Control</div>
                <h3 className="text-lg font-black">{activeBooking.bookingId || activeBooking._id}</h3>
              </div>
              <button
                onClick={() => setActiveBooking(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Quick Status Control Bar */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-500 font-bold">Current Status</div>
                  <div className="text-sm font-black text-[#0a1e40] uppercase mt-0.5">{activeBooking.status.replace('_', ' ')}</div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button onClick={() => updateStatus(activeBooking._id, 'pending')} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-900 hover:bg-amber-200">Pending</button>
                  <button onClick={() => updateStatus(activeBooking._id, 'confirmed')} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-900 hover:bg-blue-200">Confirmed</button>
                  <button onClick={() => updateStatus(activeBooking._id, 'on_the_way')} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-900 hover:bg-indigo-200">On The Way</button>
                  <button onClick={() => updateStatus(activeBooking._id, 'in_progress')} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-100 text-sky-900 hover:bg-sky-200">In Progress</button>
                  <button onClick={() => updateStatus(activeBooking._id, 'completed')} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-900 hover:bg-emerald-200">Completed</button>
                  <button onClick={() => updateStatus(activeBooking._id, 'cancelled')} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-900 hover:bg-red-200">Cancelled</button>
                </div>
              </div>

              {/* Customer & Address Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider text-slate-400">Customer Details</h4>
                  <div className="font-bold text-slate-900">{activeBooking.customerName}</div>
                  <div className="text-xs text-slate-600">
                    <div>📱 Phone: <a href={`tel:${activeBooking.customerPhone}`} className="text-indigo-600 font-bold underline">{activeBooking.customerPhone}</a></div>
                    <div className="mt-1">✉️ Email: <a href={`mailto:${activeBooking.customerEmail}`} className="text-indigo-600 underline">{activeBooking.customerEmail}</a></div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider text-slate-400">Service Location</h4>
                  <div className="text-xs text-slate-800 leading-relaxed font-medium">
                    📍 {activeBooking.address}
                  </div>
                  <div className="text-xs text-slate-600 font-bold">
                    {activeBooking.city} {activeBooking.pincode ? `• PIN: ${activeBooking.pincode}` : ''}
                  </div>
                </div>
              </div>

              {/* Service & Appointment Details */}
              <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h4 className="font-black text-slate-900 text-sm">
                    🛠️ {activeBooking.service?.title || 'Selected Service'}
                  </h4>
                  <div className="text-lg font-black text-emerald-700">₹{activeBooking.totalAmount}</div>
                </div>
                <div className="grid grid-cols-2 text-xs gap-2 text-slate-600">
                  <div><strong>Date:</strong> {new Date(activeBooking.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  <div><strong>Slot:</strong> {activeBooking.timeSlot}</div>
                  {activeBooking.notes && <div className="col-span-2 bg-yellow-50 p-2.5 rounded-xl text-yellow-900 border border-yellow-200"><strong>Customer Notes:</strong> {activeBooking.notes}</div>}
                </div>
              </div>

              {/* Assigned Technician */}
              <div className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Assigned Technician</div>
                  <div className="text-sm font-black text-slate-900 mt-0.5">
                    {activeBooking.technician ? activeBooking.technician.user?.fullname || 'Technician Assigned' : 'No technician assigned yet'}
                  </div>
                  {activeBooking.technician?.user?.phone && (
                    <div className="text-xs text-slate-500 mt-0.5">Contact: {activeBooking.technician.user.phone}</div>
                  )}
                </div>
                <div className="w-48">
                  <select
                    value={activeBooking.technician?._id || ''}
                    onChange={e => assignTech(activeBooking._id, e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-300 bg-white p-2 font-bold"
                  >
                    <option value="">Choose / Re-assign</option>
                    {techs.map(t => (
                      <option key={t._id} value={t._id}>
                        {t.user?.fullname} ({t.specialization?.[0] || 'Gen'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status History Trail */}
              {activeBooking.statusHistory && activeBooking.statusHistory.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">Timeline / Audit History</h4>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                    {activeBooking.statusHistory.map((h, i) => (
                      <div key={i} className="flex items-center justify-between text-xs border-b border-slate-200/60 pb-1.5 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="font-bold uppercase text-slate-800">{h.status.replace('_', ' ')}</span>
                          {h.note && <span className="text-slate-500 italic">({h.note})</span>}
                        </div>
                        <div className="text-slate-400 font-mono text-[11px]">{new Date(h.changedAt).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  onClick={() => deleteBooking(activeBooking._id, activeBooking.bookingId)}
                  className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-xl text-xs font-bold transition"
                >
                  🗑️ Delete Booking
                </button>
                <button
                  onClick={() => setActiveBooking(null)}
                  className="px-6 py-2 bg-[#0a1e40] text-white rounded-xl text-xs font-black shadow-md hover:bg-slate-900 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   2. CUSTOMERS TAB
   ========================================================================= */
function CustomersTab() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data: res } = await client.get('/api/auth/users', {
        params: {
          search: search || undefined,
          role: role === 'all' ? undefined : role,
          status: status === 'all' ? undefined : status,
          limit: 100
        }
      });
      setData(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [search, role, status]);

  const toggleActive = async (u) => {
    try {
      await client.put(`/api/auth/users/${u._id}`, { isActive: !u.isActive });
      fetchAll();
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  };

  const del = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await client.delete(`/api/auth/users/${id}`);
      fetchAll();
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  };

  const { sliced, pages, cur } = usePagination(data, page, PAGE_SIZE);

  return (
    <section className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-3">
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search customer name, email, phone..."
          className="flex-1 min-w-[240px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#0a1e40]"
        />
        <select
          value={role}
          onChange={e => { setRole(e.target.value); setPage(1); }}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold"
        >
          <option value="all">All Roles</option>
          <option value="customer">Customers</option>
          <option value="technician">Technicians</option>
          <option value="admin">Admins</option>
        </select>
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold"
        >
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b text-xs text-slate-500 font-bold uppercase tracking-wider text-left">
              <tr>
                <th className="px-5 py-3.5">User Name</th>
                <th className="px-5 py-3.5">Email & Phone</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Joined Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-500">Loading accounts...</td></tr>
              ) : sliced.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-500">No users found</td></tr>
              ) : (
                sliced.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{u.fullname}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">
                      <div>{u.email}</div>
                      <div className="text-slate-400">{u.phone || 'No phone'}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={u.role}
                        onChange={async e => {
                          await client.put(`/api/auth/users/${u._id}`, { role: e.target.value });
                          fetchAll();
                        }}
                        className="rounded-lg border px-2 py-1 text-xs font-bold bg-white"
                      >
                        <option value="customer">Customer</option>
                        <option value="technician">Technician</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleActive(u)}
                        className={`px-2.5 py-1 rounded-full text-xs font-black border ${u.isActive ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}
                      >
                        {u.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => del(u._id)} className="px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination cur={cur} pages={pages} onChange={setPage} />
      </div>
    </section>
  );
}

/* =========================================================================
   3. TECHNICIANS TAB
   ========================================================================= */
function TechniciansTab() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ user: '', specialization: 'CCTV Installation & Repair', experienceYears: 2, phone: '' });

  const fetchAll = async () => {
    const { data: res } = await client.get('/api/technicians');
    setData(res.data || []);
  };

  useEffect(() => {
    fetchAll();
    client.get('/api/auth/users', { params: { limit: 100 } }).then(r => setUsers(r.data.data || [])).catch(() => {});
  }, []);

  let filtered = data;
  if (search) {
    filtered = filtered.filter(t => (t.user?.fullname + t.phone + t.specialization).toLowerCase().includes(search.toLowerCase()));
  }
  const { sliced, pages, cur } = usePagination(filtered, page, PAGE_SIZE);

  const create = async (e) => {
    e.preventDefault();
    try {
      await client.post('/api/technicians', {
        user: form.user,
        specialization: [form.specialization],
        experienceYears: parseInt(form.experienceYears) || 1,
        phone: form.phone
      });
      setShowCreate(false);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const toggle = async (t, field) => {
    await client.put(`/api/technicians/${t._id}`, { [field]: !t[field] });
    fetchAll();
  };

  const del = async (id) => {
    if (!confirm('Delete technician?')) return;
    await client.delete(`/api/technicians/${id}`);
    fetchAll();
  };

  return (
    <section className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap justify-between gap-3">
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search technicians..."
          className="flex-1 min-w-[220px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none"
        />
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-5 py-2.5 rounded-xl bg-[#0a1e40] text-yellow-400 font-black text-xs uppercase tracking-wider hover:bg-slate-900 transition"
        >
          {showCreate ? 'Close Form' : '+ Add Technician'}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={create} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 grid md:grid-cols-4 gap-3">
          <select value={form.user} onChange={e => setForm({ ...form, user: e.target.value })} className="rounded-xl border p-2.5 text-sm bg-slate-50" required>
            <option value="">Select User Profile *</option>
            {users.map(u => <option key={u._id} value={u._id}>{u.fullname} ({u.email})</option>)}
          </select>
          <input value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} placeholder="Specialization (CCTV, Network)" className="rounded-xl border p-2.5 text-sm" required />
          <input type="number" value={form.experienceYears} onChange={e => setForm({ ...form, experienceYears: e.target.value })} placeholder="Years Experience" className="rounded-xl border p-2.5 text-sm" />
          <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Direct Contact Phone" className="rounded-xl border p-2.5 text-sm" required />
          <button type="submit" className="md:col-span-4 py-2.5 rounded-xl bg-yellow-400 text-[#0a1e40] font-black">Register Technician</button>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b text-xs text-slate-500 font-bold uppercase text-left">
              <tr>
                <th className="px-5 py-3.5">Technician</th>
                <th className="px-5 py-3.5">Specialization</th>
                <th className="px-5 py-3.5">Experience</th>
                <th className="px-5 py-3.5">Rating</th>
                <th className="px-5 py-3.5">Verified</th>
                <th className="px-5 py-3.5">Available</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sliced.map(t => (
                <tr key={t._id} className="hover:bg-slate-50">
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {t.user?.fullname}
                    <div className="text-xs text-slate-500 font-normal">{t.phone || t.user?.phone}</div>
                  </td>
                  <td className="px-5 py-3.5 text-xs">{t.specialization?.join(', ')}</td>
                  <td className="px-5 py-3.5 text-xs font-bold">{t.experienceYears} yrs</td>
                  <td className="px-5 py-3.5 text-xs text-amber-600 font-bold">★ {t.rating || 5.0}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => toggle(t, 'isVerified')} className={`px-2 py-1 rounded-full text-xs font-black border ${t.isVerified ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                      {t.isVerified ? 'Verified' : 'Unverified'}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => toggle(t, 'isAvailable')} className={`px-2 py-1 rounded-full text-xs font-black border ${t.isAvailable ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {t.isAvailable ? 'Available' : 'Busy'}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => del(t._id)} className="px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination cur={cur} pages={pages} onChange={setPage} />
      </div>
    </section>
  );
}

/* =========================================================================
   4. SERVICES TAB
   ========================================================================= */
function ServicesTab() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', slug: '', description: '', category: 'cctv', price: '', oldPrice: '', image: '', features: '' });

  const fetchAll = async () => {
    const { data: res } = await client.get('/api/services', { params: { limit: 100 } });
    setData(res.data || []);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  let filtered = data;
  if (search) filtered = filtered.filter(s => (s.title + s.category).toLowerCase().includes(search.toLowerCase()));
  if (cat !== 'all') filtered = filtered.filter(s => s.category === cat);
  const { sliced, pages, cur } = usePagination(filtered, page, PAGE_SIZE);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : undefined,
        features: form.features ? form.features.split(',').map(s => s.trim()) : []
      };
      if (editing) await client.put(`/api/services/${editing}`, payload);
      else await client.post('/api/services', payload);
      setEditing(null);
      setForm({ title: '', slug: '', description: '', category: 'cctv', price: '', oldPrice: '', image: '', features: '' });
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const del = async (id) => {
    if (!confirm('Delete service?')) return;
    await client.delete(`/api/services/${id}`);
    fetchAll();
  };

  const startEdit = (s) => {
    setEditing(s._id);
    setForm({
      title: s.title,
      slug: s.slug,
      description: s.description,
      category: s.category,
      price: String(s.price),
      oldPrice: s.oldPrice ? String(s.oldPrice) : '',
      image: s.image || '',
      features: (s.features || []).join(', ')
    });
  };

  return (
    <section className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-3">
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search services..."
          className="flex-1 min-w-[200px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none"
        />
        <select
          value={cat}
          onChange={e => { setCat(e.target.value); setPage(1); }}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold"
        >
          <option value="all">All Categories</option>
          <option value="cctv">CCTV</option>
          <option value="computer">Computer</option>
          <option value="networking">Networking</option>
          <option value="amc">AMC</option>
          <option value="biometric">Biometric</option>
          <option value="other">Other</option>
        </select>
      </div>

      <form onSubmit={submit} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 grid md:grid-cols-2 gap-3">
        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title *" className="rounded-xl border p-2.5 text-sm" required />
        <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="Slug (unique identifier) *" className="rounded-xl border p-2.5 text-sm" required />
        <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Price (₹) *" type="number" className="rounded-xl border p-2.5 text-sm" required />
        <input value={form.oldPrice} onChange={e => setForm({ ...form, oldPrice: e.target.value })} placeholder="Old Price (Optional discount)" type="number" className="rounded-xl border p-2.5 text-sm" />
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="rounded-xl border p-2.5 text-sm">
          <option value="cctv">CCTV</option>
          <option value="computer">Computer</option>
          <option value="networking">Networking</option>
          <option value="amc">AMC</option>
          <option value="biometric">Biometric</option>
          <option value="other">Other</option>
        </select>
        <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="Image URL" className="rounded-xl border p-2.5 text-sm" />
        <input value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} placeholder="Key Features (comma separated)" className="md:col-span-2 rounded-xl border p-2.5 text-sm" />
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description *" rows={2} className="md:col-span-2 rounded-xl border p-2.5 text-sm" required />
        <div className="md:col-span-2 flex gap-2">
          <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#0a1e40] text-white font-black text-sm">{editing ? 'Save Changes' : '+ Add New Service'}</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm({ title: '', slug: '', description: '', category: 'cctv', price: '', oldPrice: '', image: '', features: '' }); }} className="px-5 rounded-xl border text-sm font-bold">Cancel</button>}
        </div>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b text-xs text-slate-500 font-bold uppercase text-left">
              <tr>
                <th className="px-5 py-3.5">Service</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sliced.map(s => (
                <tr key={s._id} className="hover:bg-slate-50">
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {s.title}
                    <div className="text-xs text-slate-400 font-normal">{s.slug}</div>
                  </td>
                  <td className="px-5 py-3.5 text-xs uppercase font-bold">{s.category}</td>
                  <td className="px-5 py-3.5 text-xs font-black text-emerald-700">₹{s.price}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button onClick={() => startEdit(s)} className="px-3 py-1 rounded-lg border text-xs font-bold">Edit</button>
                    <button onClick={() => del(s._id)} className="px-3 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-bold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination cur={cur} pages={pages} onChange={setPage} />
      </div>
    </section>
  );
}

/* =========================================================================
   5. PRODUCTS TAB
   ========================================================================= */
function ProductsTab() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ name: '', sku: '', category: 'accessories', price: '', stock: '', image: '' });
  const [editing, setEditing] = useState(null);

  const fetchAll = async () => {
    const { data: res } = await client.get('/api/products');
    setData(res.data || []);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  let filtered = data;
  if (search) filtered = filtered.filter(p => (p.name + p.sku + p.category).toLowerCase().includes(search.toLowerCase()));
  const { sliced, pages, cur } = usePagination(filtered, page, PAGE_SIZE);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) || 0 };
      if (editing) await client.put(`/api/products/${editing}`, payload);
      else await client.post('/api/products', payload);
      setEditing(null);
      setForm({ name: '', sku: '', category: 'accessories', price: '', stock: '', image: '' });
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const del = async (id) => {
    if (!confirm('Delete product?')) return;
    await client.delete(`/api/products/${id}`);
    fetchAll();
  };

  const startEdit = (p) => {
    setEditing(p._id);
    setForm({ name: p.name, sku: p.sku, category: p.category, price: String(p.price), stock: String(p.stock), image: p.image || '' });
  };

  return (
    <section className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex gap-3">
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search products & SKU..."
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none"
        />
      </div>

      <form onSubmit={submit} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 grid md:grid-cols-3 gap-3">
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Product Name *" className="rounded-xl border p-2.5 text-sm" required />
        <input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="SKU *" className="rounded-xl border p-2.5 text-sm" required />
        <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category *" className="rounded-xl border p-2.5 text-sm" required />
        <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Price (₹) *" type="number" className="rounded-xl border p-2.5 text-sm" required />
        <input value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="Stock Quantity" type="number" className="rounded-xl border p-2.5 text-sm" />
        <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="Image URL" className="rounded-xl border p-2.5 text-sm" />
        <button type="submit" className="md:col-span-3 py-2.5 rounded-xl bg-[#0a1e40] text-white font-black text-sm">{editing ? 'Update Product' : '+ Add Product'}</button>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b text-xs text-slate-500 font-bold uppercase text-left">
              <tr>
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">SKU</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Stock</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sliced.map(p => (
                <tr key={p._id} className="hover:bg-slate-50">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{p.name}</td>
                  <td className="px-5 py-3.5 font-mono text-xs">{p.sku}</td>
                  <td className="px-5 py-3.5 text-xs">{p.category}</td>
                  <td className="px-5 py-3.5 text-xs font-black text-emerald-700">₹{p.price}</td>
                  <td className="px-5 py-3.5 text-xs">
                    <span className={`px-2 py-0.5 rounded-full font-bold ${p.stock < 5 ? 'bg-red-50 text-red-700' : 'bg-slate-100'}`}>{p.stock} units</span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button onClick={() => startEdit(p)} className="px-3 py-1 rounded-lg border text-xs font-bold">Edit</button>
                    <button onClick={() => del(p._id)} className="px-3 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-bold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination cur={cur} pages={pages} onChange={setPage} />
      </div>
    </section>
  );
}

/* =========================================================================
   6. PAYMENTS TAB
   ========================================================================= */
function PaymentsTab() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  const fetchAll = async () => {
    const { data: res } = await client.get('/api/payments');
    setData(res.data || []);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  let filtered = data;
  if (search) filtered = filtered.filter(p => (p.razorpayOrderId + p.razorpayPaymentId + p.booking?.bookingId).toLowerCase().includes(search.toLowerCase()));
  if (status !== 'all') filtered = filtered.filter(p => p.status === status);
  const { sliced, pages, cur } = usePagination(filtered, page, PAGE_SIZE);

  return (
    <section className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-3">
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search payment order, id, booking..."
          className="flex-1 min-w-[240px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none"
        />
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold">
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b text-xs text-slate-500 font-bold uppercase text-left">
              <tr>
                <th className="px-5 py-3.5">Booking Ref</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Method</th>
                <th className="px-5 py-3.5">Razorpay Order ID</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sliced.map(p => (
                <tr key={p._id} className="hover:bg-slate-50">
                  <td className="px-5 py-3.5 font-mono text-xs font-bold">{p.booking?.bookingId || p.booking}</td>
                  <td className="px-5 py-3.5 font-bold text-emerald-700">₹{p.amount}</td>
                  <td className="px-5 py-3.5 text-xs uppercase">{p.method || 'Online'}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{p.razorpayOrderId || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${p.status === 'paid' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination cur={cur} pages={pages} onChange={setPage} />
      </div>
    </section>
  );
}

/* =========================================================================
   7. AMC PLANS TAB
   ========================================================================= */
function AmcTab() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ name: '', slug: '', price: '', period: 'yearly', forType: 'Small Office / Home', features: '4 Regular Maintenance Visits, Emergency Callout, Priority Tech Support', isPopular: false });
  const [editing, setEditing] = useState(null);

  const fetchAll = async () => {
    const { data: res } = await client.get('/api/amc-plans');
    setData(res.data || []);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: parseFloat(form.price), features: form.features.split(',').map(s => s.trim()) };
    try {
      if (editing) await client.put(`/api/amc-plans/${editing}`, payload);
      else await client.post('/api/amc-plans', payload);
      setEditing(null);
      setForm({ name: '', slug: '', price: '', period: 'yearly', forType: 'Small Office / Home', features: '4 Regular Maintenance Visits, Emergency Callout, Priority Tech Support', isPopular: false });
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const del = async (id) => {
    if (!confirm('Delete AMC plan?')) return;
    await client.delete(`/api/amc-plans/${id}`);
    fetchAll();
  };

  const startEdit = (a) => {
    setEditing(a._id);
    setForm({ name: a.name, slug: a.slug, price: String(a.price), period: a.period, forType: a.forType, features: (a.features || []).join(', '), isPopular: a.isPopular });
  };

  return (
    <section className="space-y-4">
      <form onSubmit={submit} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 grid md:grid-cols-3 gap-3">
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Plan Name *" className="rounded-xl border p-2.5 text-sm" required />
        <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="Slug *" className="rounded-xl border p-2.5 text-sm" required />
        <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Price (₹) *" type="number" className="rounded-xl border p-2.5 text-sm" required />
        <select value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} className="rounded-xl border p-2.5 text-sm">
          <option value="yearly">Yearly</option>
          <option value="monthly">Monthly</option>
        </select>
        <input value={form.forType} onChange={e => setForm({ ...form, forType: e.target.value })} placeholder="Target Audience (e.g. Small Office)" className="rounded-xl border p-2.5 text-sm" required />
        <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.isPopular} onChange={e => setForm({ ...form, isPopular: e.target.checked })} /> Mark as Featured/Popular</label>
        <input value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} placeholder="Features comma separated" className="md:col-span-3 rounded-xl border p-2.5 text-sm" />
        <button type="submit" className="md:col-span-3 py-2.5 rounded-xl bg-[#0a1e40] text-white font-black text-sm">{editing ? 'Update AMC Plan' : '+ Create AMC Plan'}</button>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b text-xs text-slate-500 font-bold uppercase text-left">
              <tr>
                <th className="px-5 py-3.5">Plan</th>
                <th className="px-5 py-3.5">Target</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Period</th>
                <th className="px-5 py-3.5">Featured</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map(a => (
                <tr key={a._id} className="hover:bg-slate-50">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{a.name}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-600">{a.forType}</td>
                  <td className="px-5 py-3.5 font-bold text-emerald-700">₹{a.price}</td>
                  <td className="px-5 py-3.5 text-xs uppercase">{a.period}</td>
                  <td className="px-5 py-3.5">{a.isPopular ? '⭐ Yes' : 'No'}</td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button onClick={() => startEdit(a)} className="px-3 py-1 rounded-lg border text-xs font-bold">Edit</button>
                    <button onClick={() => del(a._id)} className="px-3 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-bold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   8. REVIEWS TAB
   ========================================================================= */
function ReviewsTab() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchAll = async () => {
    const { data: res } = await client.get('/api/reviews');
    setData(res.data || []);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  let filtered = data;
  if (search) filtered = filtered.filter(r => (r.comment || '').toLowerCase().includes(search.toLowerCase()));
  const { sliced, pages, cur } = usePagination(filtered, page, PAGE_SIZE);

  const del = async (id) => {
    if (!confirm('Delete review?')) return;
    await client.delete(`/api/reviews/${id}`);
    fetchAll();
  };

  return (
    <section className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search customer reviews..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b text-xs text-slate-500 font-bold uppercase text-left">
              <tr>
                <th className="px-5 py-3.5">Reviewer</th>
                <th className="px-5 py-3.5">Rating</th>
                <th className="px-5 py-3.5">Comment</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sliced.map(r => (
                <tr key={r._id} className="hover:bg-slate-50">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{r.user?.fullname || 'Customer'}</td>
                  <td className="px-5 py-3.5 text-amber-500 font-bold">{'★'.repeat(r.rating || 5)}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-700 max-w-sm">{r.comment}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => del(r._id)} className="px-3 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-bold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination cur={cur} pages={pages} onChange={setPage} />
      </div>
    </section>
  );
}

/* =========================================================================
   9. COUPONS TAB
   ========================================================================= */
function CouponsTab() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ code: '', discountType: 'percent', discountValue: '', minAmount: '', expiry: '', usageLimit: '100' });
  const [editing, setEditing] = useState(null);

  const fetchAll = async () => {
    const { data: res } = await client.get('/api/coupons');
    setData(res.data || []);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      code: form.code.toUpperCase(),
      discountType: form.discountType,
      discountValue: parseFloat(form.discountValue),
      minAmount: parseFloat(form.minAmount) || 0,
      expiry: new Date(form.expiry).toISOString(),
      usageLimit: parseInt(form.usageLimit) || 100
    };
    try {
      if (editing) await client.put(`/api/coupons/${editing}`, payload);
      else await client.post('/api/coupons', payload);
      setEditing(null);
      setForm({ code: '', discountType: 'percent', discountValue: '', minAmount: '', expiry: '', usageLimit: '100' });
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const del = async (id) => {
    if (!confirm('Delete coupon?')) return;
    await client.delete(`/api/coupons/${id}`);
    fetchAll();
  };

  const toggle = async (c) => {
    await client.put(`/api/coupons/${c._id}`, { isActive: !c.isActive });
    fetchAll();
  };

  return (
    <section className="space-y-4">
      <form onSubmit={submit} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 grid md:grid-cols-3 gap-3">
        <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="Promo Code (e.g. FESTIVE20) *" className="rounded-xl border p-2.5 text-sm uppercase font-mono font-bold" required />
        <select value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })} className="rounded-xl border p-2.5 text-sm">
          <option value="percent">Percentage (%)</option>
          <option value="flat">Flat Amount (₹)</option>
        </select>
        <input value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })} placeholder="Discount Value *" type="number" className="rounded-xl border p-2.5 text-sm" required />
        <input value={form.minAmount} onChange={e => setForm({ ...form, minAmount: e.target.value })} placeholder="Min Order Amount (₹)" type="number" className="rounded-xl border p-2.5 text-sm" />
        <input value={form.expiry} onChange={e => setForm({ ...form, expiry: e.target.value })} type="date" className="rounded-xl border p-2.5 text-sm" required />
        <input value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: e.target.value })} placeholder="Max Total Uses" type="number" className="rounded-xl border p-2.5 text-sm" />
        <button type="submit" className="md:col-span-3 py-2.5 rounded-xl bg-[#0a1e40] text-white font-black text-sm">{editing ? 'Update Coupon' : '+ Create Coupon'}</button>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b text-xs text-slate-500 font-bold uppercase text-left">
              <tr>
                <th className="px-5 py-3.5">Code</th>
                <th className="px-5 py-3.5">Discount</th>
                <th className="px-5 py-3.5">Min Order</th>
                <th className="px-5 py-3.5">Expiry</th>
                <th className="px-5 py-3.5">Active</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map(c => (
                <tr key={c._id} className="hover:bg-slate-50">
                  <td className="px-5 py-3.5 font-mono font-black text-[#0a1e40]">{c.code}</td>
                  <td className="px-5 py-3.5 font-bold">{c.discountValue}{c.discountType === 'percent' ? '%' : '₹'}</td>
                  <td className="px-5 py-3.5 text-xs">₹{c.minAmount || 0}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{new Date(c.expiry).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => toggle(c)} className={`px-2.5 py-1 rounded-full text-xs font-black border ${c.isActive ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {c.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => del(c._id)} className="px-3 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-bold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   10. QUOTES TAB
   ========================================================================= */
function QuotesTab() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

  const fetchAll = async () => {
    const { data: res } = await client.get('/api/quotes');
    setData(res.data || []);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const { sliced, pages, cur } = usePagination(data, page, PAGE_SIZE);

  const update = async (id, s) => {
    await client.patch(`/api/quotes/${id}/status`, { status: s });
    fetchAll();
  };

  const del = async (id) => {
    if (!confirm('Delete quote?')) return;
    await client.delete(`/api/quotes/${id}`);
    fetchAll();
  };

  return (
    <section className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b text-xs text-slate-500 font-bold uppercase text-left">
              <tr>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Service Requested</th>
                <th className="px-5 py-3.5">Message / Requirement</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sliced.map(q => (
                <tr key={q._id} className="hover:bg-slate-50">
                  <td className="px-5 py-3.5 font-bold">
                    {q.name}
                    <div className="text-xs text-slate-500 font-normal">{q.phone} • {q.email}</div>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-bold">{q.serviceType}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-600 max-w-xs truncate">{q.message}</td>
                  <td className="px-5 py-3.5">
                    <select value={q.status} onChange={e => update(q._id, e.target.value)} className="rounded-lg border px-2 py-1 text-xs font-bold bg-white">
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="quoted">Quoted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => del(q._id)} className="px-3 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-bold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination cur={cur} pages={pages} onChange={setPage} />
      </div>
    </section>
  );
}

/* =========================================================================
   11. SETTINGS TAB
   ========================================================================= */
function SettingsTab() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    const { data: res } = await client.get('/api/settings');
    setForm(res.data || {});
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: res } = await client.put('/api/settings', form);
      setForm(res.data);
      alert('Website settings updated successfully.');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <div className="py-20 text-center font-bold text-slate-500">Loading settings...</div>;

  return (
    <form onSubmit={save} className="space-y-6 max-w-4xl">
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-600">Company Name</label>
          <input value={form.siteName || ''} onChange={e => setForm({ ...form, siteName: e.target.value })} className="mt-1 w-full rounded-xl border p-2.5 text-sm bg-slate-50" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600">Official Tagline</label>
          <input value={form.tagline || ''} onChange={e => setForm({ ...form, tagline: e.target.value })} className="mt-1 w-full rounded-xl border p-2.5 text-sm bg-slate-50" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600">Primary Phone Number</label>
          <input value={form.contactPhone || '9635006403'} onChange={e => setForm({ ...form, contactPhone: e.target.value })} className="mt-1 w-full rounded-xl border p-2.5 text-sm bg-slate-50" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600">Primary Email Address</label>
          <input value={form.contactEmail || 'itsolutions.amd@gmail.com'} onChange={e => setForm({ ...form, contactEmail: e.target.value })} className="mt-1 w-full rounded-xl border p-2.5 text-sm bg-slate-50" />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-slate-600">Registered Office Address</label>
          <input value={form.address || '24 T C Road, Kolkata - 700053'} onChange={e => setForm({ ...form, address: e.target.value })} className="mt-1 w-full rounded-xl border p-2.5 text-sm bg-slate-50" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600">WhatsApp Hotline</label>
          <input value={form.whatsapp || '9635006403'} onChange={e => setForm({ ...form, whatsapp: e.target.value })} className="mt-1 w-full rounded-xl border p-2.5 text-sm bg-slate-50" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600">Service Coverage City</label>
          <input value={form.city || 'Kolkata'} onChange={e => setForm({ ...form, city: e.target.value })} className="mt-1 w-full rounded-xl border p-2.5 text-sm bg-slate-50" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600">GSTIN Number</label>
          <input value={form.gstin || '19BAAPK5344N1ZD'} onChange={e => setForm({ ...form, gstin: e.target.value })} className="mt-1 w-full rounded-xl border p-2.5 text-sm bg-slate-50 font-mono" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600">Emergency 24/7 Support</label>
          <input value={form.supportText || '24/7 On-Demand Technician Dispatch'} onChange={e => setForm({ ...form, supportText: e.target.value })} className="mt-1 w-full rounded-xl border p-2.5 text-sm bg-slate-50" />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-8 py-3 rounded-xl bg-[#0a1e40] text-yellow-400 font-black text-sm shadow-md hover:bg-slate-900 transition disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
}

/* =========================================================================
   Pagination Helper
   ========================================================================= */
function Pagination({ cur, pages, onChange }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-200 bg-slate-50 text-sm">
      <div className="text-xs font-bold text-slate-500">Page {cur} of {pages}</div>
      <div className="flex gap-1.5">
        <button
          disabled={cur <= 1}
          onClick={() => onChange(cur - 1)}
          className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold disabled:opacity-40 hover:bg-slate-50"
        >
          Prev
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-8 h-8 rounded-lg text-xs font-black transition ${p === cur ? 'bg-[#0a1e40] text-white shadow-sm' : 'bg-white border border-slate-300 hover:bg-slate-50'}`}
          >
            {p}
          </button>
        ))}
        <button
          disabled={cur >= pages}
          onClick={() => onChange(cur + 1)}
          className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold disabled:opacity-40 hover:bg-slate-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
