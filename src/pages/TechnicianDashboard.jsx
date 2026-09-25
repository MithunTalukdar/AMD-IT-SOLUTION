import { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/api/bookings');
      setBookings(data.data);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const update = async (id, status) => {
    try { await client.patch(`/api/bookings/${id}/status`, { status }); fetch(); } catch (e) { alert(e.response?.data?.message || e.message); }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-indigo-900 to-[#1e4a9a] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <h1 className="text-2xl font-black">Technician — My Assignments</h1>
          <p className="text-sm text-indigo-200"> {user?.fullname} • Update live status for customer tracking</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {loading ? <div className="py-16 text-center text-slate-500">Loading assignments…</div> : bookings.length === 0 ? (
          <div className="bg-white border rounded-2xl p-10 text-center">
            <div className="text-4xl">🔧</div>
            <p className="mt-2 font-bold">No assignments yet</p>
            <p className="text-sm text-slate-500">Wait for admin to assign you bookings.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {bookings.map(b => (
              <div key={b._id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <div className="flex justify-between">
                  <div className="font-mono font-black text-sm text-[#0a1e40]">{b.bookingId}</div>
                  <span className="text-xs font-black px-2 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">{b.status.replace('_',' ')}</span>
                </div>
                <div className="mt-2 font-bold text-sm">{b.service?.title}</div>
                <div className="text-xs text-slate-500">{new Date(b.date).toLocaleDateString()} • {b.timeSlot} • {b.city}</div>
                <div className="mt-2 bg-slate-50 border rounded-xl px-3 py-2 text-xs">
                  <div className="font-bold">{b.customerName} • {b.customerPhone}</div>
                  <div>{b.address}, {b.city} {b.pincode}</div>
                  {b.notes && <div className="text-slate-500">Note: {b.notes}</div>}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {b.status === 'technician_assigned' && <button onClick={() => update(b._id, 'on_the_way')} className="px-4 py-2 rounded-full bg-cyan-600 text-white text-xs font-bold">On the Way →</button>}
                  {b.status === 'on_the_way' && <button onClick={() => update(b._id, 'in_progress')} className="px-4 py-2 rounded-full bg-purple-600 text-white text-xs font-bold">Start Work</button>}
                  {b.status === 'in_progress' && <button onClick={() => update(b._id, 'completed')} className="px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold">Mark Completed ✓</button>}
                  <a href={`tel:${b.customerPhone}`} className="px-4 py-2 rounded-full border text-xs font-bold">Call Customer</a>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(b.address + ' ' + b.city)}`} target="_blank" className="px-4 py-2 rounded-full bg-[#0a1e40] text-white text-xs font-bold">Map</a>
                </div>
                <div className="mt-2 text-xs text-slate-400">History: {b.statusHistory?.map(h => h.status).join(' → ')}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
