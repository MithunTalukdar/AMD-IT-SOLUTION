import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/client';

const STEPS = ['pending','confirmed','technician_assigned','on_the_way','in_progress','completed'];

export default function BookingDetail() {
  const { id } = useParams();
  const [b, setB] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    client.get(`/api/bookings/${id}`).then(r => setB(r.data.data)).catch(e => setErr(e.response?.data?.message || e.message)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="py-20 text-center text-slate-500">Loading booking…</div>;
  if (err) return <div className="max-w-3xl mx-auto p-6"><div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700">{err}</div></div>;
  if (!b) return null;

  const idx = STEPS.indexOf(b.status);

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <a href="javascript:history.back()" className="text-sm text-[#1e4a9a] font-bold">← Back</a>
        <div className="mt-4 bg-white rounded-[24px] border border-slate-200 shadow overflow-hidden">
          <div className="bg-[#0a1e40] text-white px-6 py-5 flex justify-between">
            <div>
              <div className="font-mono font-black text-yellow-400">{b.bookingId}</div>
              <div className="text-sm opacity-80">Booked {new Date(b.createdAt).toLocaleString()}</div>
            </div>
            <span className="self-start bg-yellow-400 text-[#0a1e40] font-black text-xs px-3 py-1 rounded-full">{b.status.replace('_',' ')}</span>
          </div>

          <div className="p-6">
            {/* Timeline */}
            <div className="flex gap-1 mb-6">
              {STEPS.map((s, i) => (
                <div key={s} className={`flex-1 text-center`}>
                  <div className={`w-8 h-8 rounded-full mx-auto grid place-items-center text-xs font-black ${i <= idx && b.status !== 'cancelled' ? 'bg-[#0a1e40] text-yellow-400' : 'bg-slate-200 text-slate-500'}`}>{i < idx ? '✓' : i + 1}</div>
                  <div className={`mt-1 text-[9px] font-bold tracking-wide ${i <= idx ? 'text-[#0a1e40]' : 'text-slate-400'}`}>{s.replace('_','\n')}</div>
                  <div className={`h-1 mt-1 rounded-full ${i < idx ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                </div>
              ))}
            </div>
            {b.status === 'cancelled' && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-sm text-red-700 mb-4">This booking was cancelled.</div>}

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-50 border rounded-2xl p-4">
                <div className="font-black text-[#0a1e40]">Service</div>
                <div>{b.service?.title}</div>
                <div className="text-xs text-slate-500">{b.serviceType} • ₹{b.totalAmount}</div>
                <div className="mt-2"><span className="text-xs text-slate-500">Date & Slot:</span> <span className="font-bold">{new Date(b.date).toLocaleDateString()} • {b.timeSlot}</span></div>
              </div>
              <div className="bg-slate-50 border rounded-2xl p-4">
                <div className="font-black text-[#0a1e40]">Customer</div>
                <div>{b.customerName}</div>
                <div className="text-xs">{b.customerEmail} • {b.customerPhone}</div>
                <div className="mt-2 text-xs">{b.address}, {b.city} {b.pincode}</div>
                {b.notes && <div className="mt-1 text-xs text-slate-500">Notes: {b.notes}</div>}
              </div>
            </div>

            {b.technician && (
              <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
                <div className="font-black text-indigo-900">Technician</div>
                <div className="text-sm">{b.technician?.user?.fullname} • {b.technician?.user?.phone} • {b.technician?.specialization?.join(', ')}</div>
                <div className="text-xs text-indigo-700">Assigned • {b.technician?.isVerified ? 'Verified' : 'Pending verification'}</div>
              </div>
            )}

            <div className="mt-4 bg-white border rounded-2xl p-4">
              <div className="font-black text-sm">Status History</div>
              <div className="mt-2 space-y-2">
                {b.statusHistory?.map((h, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <span className="font-mono bg-slate-100 rounded-full px-2 py-1 border">{new Date(h.changedAt).toLocaleString()}</span>
                    <span className="font-bold">{h.status.replace('_',' ')}</span>
                    {h.note && <span className="text-slate-500">— {h.note}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <a href="/customer/bookings" className="px-5 py-2 rounded-full bg-[#0a1e40] text-white font-bold">My Bookings</a>
              <a href="/" className="px-5 py-2 rounded-full border font-bold">Home</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
