import { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  technician_assigned: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  on_the_way: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  in_progress: 'bg-purple-100 text-purple-700 border-purple-200',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const STEPS = ['pending','confirmed','technician_assigned','on_the_way','in_progress','completed'];

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/api/bookings/my');
      setBookings(data.data);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const cancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try { await client.patch(`/api/bookings/${id}/cancel`); fetch(); } catch (e) { alert(e.response?.data?.message || e.message); }
  };

  const payNow = async (booking) => {
    if (!confirm(`Pay ₹${booking.totalAmount} online for ${booking.bookingId}?`)) return;
    const loadScript = () => new Promise((res, rej) => {
      if (window.Razorpay) return res(true);
      const s = document.createElement('script'); s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => res(true); s.onerror = () => rej(new Error('Razorpay SDK failed')); document.body.appendChild(s);
    });
    try {
      const { data: order } = await client.post('/api/payments/create-order', { bookingId: booking.bookingId });
      await loadScript();
      const { orderId, amount, currency, keyId } = order.data;
      const rzp = new window.Razorpay({
        key: keyId,
        amount: Math.round(amount * 100),
        currency,
        name: 'AMD IT SOLUTION',
        description: booking.service?.title || 'Service Booking',
        order_id: orderId,
        prefill: { name: booking.customerName, email: booking.customerEmail, contact: booking.customerPhone },
        theme: { color: '#0a1e40' },
        handler: async (resp) => {
          try {
            await client.post('/api/payments/verify', {
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
              bookingId: booking.bookingId,
            });
            alert('Payment verified — booking confirmed!');
            fetch();
          } catch (e) { alert(e.response?.data?.message || 'Verification failed'); }
        },
        modal: { ondismiss: async () => {
          try { await client.post('/api/payments/mark-failed', { razorpay_order_id: orderId, reason: 'cancelled' }); } catch {}
        }},
      });
      rzp.on('payment.failed', async () => {
        try { await client.post('/api/payments/mark-failed', { razorpay_order_id: orderId, reason: 'failed' }); } catch {}
      });
      rzp.open();
    } catch (e) { alert(e.response?.data?.message || e.message); }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0a1e40] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <h1 className="text-2xl font-black">My Bookings</h1>
          <p className="text-sm text-slate-300">Welcome, {user?.fullname} • Track every booking with unique ID</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-full text-xs font-bold border ${filter === 'all' ? 'bg-[#0a1e40] text-white' : 'bg-white border-slate-200'}`}>All ({bookings.length})</button>
          {STEPS.concat('cancelled').map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${filter === s ? 'bg-yellow-400 text-[#0a1e40] border-amber-300' : 'bg-white border-slate-200'}`}>{s.replace('_',' ')}</button>
          ))}
        </div>

        {loading ? <div className="text-center py-16 text-slate-500">Loading…</div> : filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <div className="text-4xl">📋</div>
            <p className="mt-2 font-bold text-[#0a1e40]">No bookings yet</p>
            <a href="/booking" className="mt-3 inline-flex px-5 py-2 bg-[#0a1e40] text-white rounded-full font-bold">Book a Service →</a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map(b => (
              <div key={b._id} className="bg-white rounded-[18px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#0a1e40] to-[#1e4a9a]" />
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="font-mono font-black text-[#0a1e40] text-sm">{b.bookingId}</div>
                    <span className={`text-xs font-black px-2 py-1 rounded-full border ${STATUS_COLORS[b.status]}`}>{b.status.replace('_',' ')}</span>
                  </div>
                  <div className="mt-2 flex gap-3">
                    <img src={b.service?.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&q=80'} alt="" className="w-16 h-16 rounded-xl object-cover border" />
                    <div>
                      <div className="font-bold text-sm text-[#0a1e40]">{b.service?.title}</div>
                      <div className="text-xs text-slate-500">{new Date(b.date).toLocaleDateString()} • {b.timeSlot}</div>
                      <div className="text-xs font-bold">₹{b.totalAmount} • {b.city}</div>
                    </div>
                  </div>

                  {/* Timeline mini */}
                  <div className="mt-3 flex gap-1">
                    {STEPS.map((s, i) => {
                      const reached = STEPS.indexOf(b.status) >= i || b.status === 'completed';
                      const active = b.status === s;
                      return <div key={s} className={`flex-1 h-1.5 rounded-full ${reached ? 'bg-emerald-500' : 'bg-slate-200'} ${active ? 'ring-2 ring-yellow-400' : ''}`} title={s} />;
                    })}
                  </div>
                  <div className="mt-1 flex justify-between text-[9px] tracking-wide font-bold text-slate-500">
                    <span>Pending</span><span>Confirmed</span><span>Assigned</span><span>On way</span><span>Work</span><span>Done</span>
                  </div>

                  {b.technician && (
                    <div className="mt-3 bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-2 text-xs">
                      <div className="font-bold text-indigo-900">Technician: {b.technician?.user?.fullname || b.technician?.phone || 'Assigned'}</div>
                      <div className="text-indigo-700">{b.technician?.user?.phone || ''}</div>
                    </div>
                  )}

                  <div className="mt-3 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                    <div>{b.address}, {b.city} {b.pincode}</div>
                    <div className="text-slate-500">{b.customerPhone} • {b.customerEmail}</div>
                  </div>

                  <div className="mt-3 flex gap-2 flex-wrap">
                    <a href={`/booking/${b.bookingId || b._id}`} className="flex-1 text-center py-2 rounded-full border border-slate-200 font-bold text-xs">View Details</a>
                    {b.status === 'pending' && (
                      <button onClick={() => payNow(b)} className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0a1e40] font-black text-xs">Pay Now</button>
                    )}
                    {['pending','confirmed','technician_assigned'].includes(b.status) && (
                      <button onClick={() => cancel(b._id)} className="px-4 py-2 rounded-full bg-red-50 border border-red-200 text-red-700 font-bold text-xs">Cancel</button>
                    )}
                  </div>
                  {b.status === 'pending' && <div className="mt-2 text-[11px] text-slate-500">💡 Pay online for instant confirmation (verified via backend HMAC)</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
