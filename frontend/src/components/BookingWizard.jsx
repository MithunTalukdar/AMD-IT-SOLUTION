import { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const STATIC_SERVICES = [
  { _id: 'cctv', title: 'CCTV Installation', category: 'cctv', price: 6499, image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80' },
  { _id: 'computer', title: 'Computer & Laptop Service', category: 'computer', price: 599, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&q=80' },
  { _id: 'networking', title: 'Networking & Wi-Fi Setup', category: 'networking', price: 3999, image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&q=80' },
  { _id: 'amc', title: 'AMC Annual Plan', category: 'amc', price: 4999, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80' },
];

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => reject(new Error('Razorpay SDK failed to load'));
    document.body.appendChild(s);
  });
}

export default function BookingWizard({ onSuccess }) {
  const { user, token } = useAuth();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState(STATIC_SERVICES);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod | online
  const [paymentState, setPaymentState] = useState('idle'); // idle | creating | verifying | success | failed

  const [form, setForm] = useState({
    service: '',
    serviceObj: null,
    date: '',
    timeSlot: '',
    customerName: user?.fullname || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    address: '',
    city: 'Kolkata',
    pincode: '',
    notes: '',
  });

  useEffect(() => {
    client.get('/api/services').then(r => {
      if (r.data?.data?.length) setServices(r.data.data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (form.customerName === '' && user?.fullname) setForm(f => ({ ...f, customerName: user.fullname, customerEmail: user.email, customerPhone: user.phone || '' }));
  }, [user]);

  const fetchSlots = async (date) => {
    if (!date) return;
    setLoadingSlots(true);
    try {
      const { data } = await client.get('/api/bookings/slots', { params: { date } });
      setSlots(data.data);
    } catch { setSlots([]); } finally { setLoadingSlots(false); }
  };
  useEffect(() => { if (form.date) fetchSlots(form.date); }, [form.date]);

  const canNext = () => {
    if (step === 1) return !!form.service;
    if (step === 2) return !!form.date;
    if (step === 3) return !!form.timeSlot;
    if (step === 4) return form.customerName && form.customerEmail && form.customerPhone;
    if (step === 5) return form.address && form.city;
    return true;
  };

  const resolveServiceId = () => {
    const found = services.find(s => s._id === form.service);
    if (found && found._id.length === 24) return found._id;
    const byCat = services.find(s => s.category === form.serviceObj?.category && s._id.length === 24);
    return byCat?._id || null;
  };

  const createBookingOnly = async () => {
    const serviceId = resolveServiceId();
    if (!serviceId) throw new Error('No real services in database yet. Admin needs to create services first.');
    const payload = {
      service: serviceId,
      serviceType: form.serviceObj?.category || 'other',
      date: form.date,
      timeSlot: form.timeSlot,
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      customerPhone: form.customerPhone,
      address: form.address,
      city: form.city,
      pincode: form.pincode,
      notes: form.notes,
    };
    const { data } = await client.post('/api/bookings', payload);
    return data.data;
  };

  const handleOnlinePayment = async (booking) => {
    setPaymentState('creating');
    setError('');
    try {
      // 1. Create order (backend is source of truth, never trust frontend amount)
      const { data: orderData } = await client.post('/api/payments/create-order', { bookingId: booking.bookingId });
      const { orderId, amount, currency, keyId } = orderData.data;

      await loadRazorpayScript();

      const options = {
        key: keyId,
        amount: Math.round(amount * 100),
        currency,
        name: 'AMD IT SOLUTION',
        description: booking.service?.title || form.serviceObj?.title || 'Service Booking',
        order_id: orderId,
        prefill: {
          name: form.customerName,
          email: form.customerEmail,
          contact: form.customerPhone,
        },
        notes: { bookingId: booking.bookingId },
        theme: { color: '#0a1e40' },
        handler: async function (response) {
          setPaymentState('verifying');
          try {
            // 2. Verify signature on backend — only after verification booking confirmed
            const { data } = await client.post('/api/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking.bookingId,
            });
            setPaymentState('success');
            setResult({ ...booking, status: data.data.booking?.status || 'confirmed', payment: data.data.payment, bookingId: booking.bookingId });
            if (onSuccess) onSuccess(data.data.booking);
          } catch (e) {
            setPaymentState('failed');
            setError(e.response?.data?.message || 'Payment verification failed. Booking remains pending — you can pay again from My Bookings.');
          }
        },
        modal: {
          ondismiss: async function () {
            // User cancelled — mark failed/cancelled on backend
            try { await client.post('/api/payments/mark-failed', { razorpay_order_id: orderId, reason: 'cancelled' }); } catch {}
            setPaymentState('failed');
            setError('Payment cancelled. Your booking is pending (COD available). You can retry payment from My Bookings.');
            setResult({ ...booking, status: 'pending' });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', async function (resp) {
        try { await client.post('/api/payments/mark-failed', { razorpay_order_id: orderId, reason: 'failed' }); } catch {}
        setPaymentState('failed');
        setError(resp.error?.description || 'Payment failed. Please retry or choose COD.');
      });
      rzp.open();
    } catch (e) {
      setPaymentState('failed');
      setError(e.response?.data?.message || e.message || 'Could not create payment order (network failure). Booking is pending — retry from My Bookings.');
      // Still show booking as pending so user can retry
      throw e;
    }
  };

  const handleCreate = async () => {
    if (!token) { setError('Please login as customer to create booking.'); return; }
    setSubmitting(true); setError(''); setPaymentState('idle');
    try {
      const booking = await createBookingOnly();
      if (paymentMethod === 'cod') {
        setResult(booking);
        if (onSuccess) onSuccess(booking);
      } else {
        // online — keep booking as pending initially, then trigger razorpay
        setResult(booking); // show pending first, then payment overlay
        setSubmitting(false);
        await handleOnlinePayment(booking);
        return;
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Booking failed');
    } finally { setSubmitting(false); }
  };

  if (result && paymentState === 'success') {
    return (
      <div className="bg-white rounded-[24px] border border-emerald-200 shadow-xl p-6 md:p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-2xl mx-auto">✓</div>
        <h3 className="mt-4 text-2xl font-black text-[#0a1e40]">Payment Verified — Booking Confirmed!</h3>
        <div className="mt-2 inline-flex bg-[#0a1e40] text-yellow-400 font-black px-4 py-1 rounded-full text-sm tracking-wide">{result.bookingId}</div>
        <p className="mt-3 text-sm text-slate-600">Paid and confirmed for <span className="font-bold">{new Date(result.date).toLocaleDateString()}</span> at <span className="font-bold">{result.timeSlot}</span>. Confirmation sent to {form.customerEmail}.</p>
        <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left text-sm grid md:grid-cols-2 gap-3">
          <div><div className="text-xs text-slate-500">Service</div><div className="font-bold">{result.service?.title || form.serviceObj?.title}</div></div>
          <div><div className="text-xs text-slate-500">Amount Paid</div><div className="font-black text-emerald-700">₹{result.totalAmount} • {result.payment?.status || 'paid'}</div></div>
          <div><div className="text-xs text-slate-500">Address</div><div className="font-semibold">{result.address}, {result.city}</div></div>
          <div><div className="text-xs text-slate-500">Status</div><span className="bg-emerald-600 text-white font-black text-xs px-2 py-1 rounded-full">{result.status}</span></div>
        </div>
        <div className="mt-2 text-xs text-slate-500">Never trust frontend success — verified via HMAC on backend • Booking auto-confirmed after webhook.</div>
        <div className="mt-6 flex gap-3 justify-center">
          <a href="/customer/bookings" className="px-6 py-3 bg-[#0a1e40] text-white font-bold rounded-full">View My Bookings →</a>
          <button onClick={() => { setResult(null); setPaymentState('idle'); setStep(1); }} className="px-6 py-3 border border-slate-200 rounded-full font-bold">Book Another</button>
        </div>
      </div>
    );
  }

  if (result && paymentMethod === 'cod') {
    return (
      <div className="bg-white rounded-[24px] border border-emerald-200 shadow-xl p-6 md:p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 grid place-items-center text-2xl mx-auto">✓</div>
        <h3 className="mt-4 text-2xl font-black text-[#0a1e40]">Booking Confirmed! (Pay on Service)</h3>
        <div className="mt-2 inline-flex bg-[#0a1e40] text-yellow-400 font-black px-4 py-1 rounded-full text-sm tracking-wide">{result.bookingId}</div>
        <p className="mt-3 text-sm text-slate-600">Scheduled for <span className="font-bold">{new Date(result.date).toLocaleDateString()}</span> at <span className="font-bold">{result.timeSlot}</span>. Pay after service.</p>
        <div className="mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-sm grid md:grid-cols-2 gap-3">
          <div><div className="text-xs text-slate-500">Service</div><div className="font-bold">{result.service?.title || form.serviceObj?.title}</div></div>
          <div><div className="text-xs text-slate-500">Amount</div><div className="font-black text-[#0a1e40]">₹{result.totalAmount}</div></div>
          <div><div className="text-xs text-slate-500">Address</div><div className="font-semibold">{result.address}, {result.city}</div></div>
          <div><div className="text-xs text-slate-500">Status</div><span className="bg-yellow-400 text-[#0a1e40] font-black text-xs px-2 py-1 rounded-full">{result.status}</span></div>
        </div>
        <div className="mt-6 flex gap-3 justify-center">
          <a href="/customer/bookings" className="px-6 py-3 bg-[#0a1e40] text-white font-bold rounded-full">View My Bookings →</a>
          <button onClick={() => { setResult(null); setStep(1); }} className="px-6 py-3 border border-slate-200 rounded-full font-bold">Book Another</button>
        </div>
      </div>
    );
  }

  // If online payment is in progress but booking pending, show awaiting overlay
  if (result && paymentState !== 'idle' && paymentState !== 'success') {
    return (
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-xl p-6 md:p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 grid place-items-center text-2xl mx-auto">◷</div>
        <h3 className="mt-4 text-xl font-black text-[#0a1e40]">{paymentState === 'creating' ? 'Creating secure order…' : paymentState === 'verifying' ? 'Verifying payment…' : 'Booking Pending — Awaiting Payment'}</h3>
        <div className="mt-2 inline-flex bg-slate-100 font-mono font-bold px-3 py-1 rounded-full text-xs">{result.bookingId} • {paymentState}</div>
        <p className="mt-3 text-sm text-slate-600">Booking is <span className="font-bold">pending</span> until payment is verified on backend (HMAC). Do not trust checkout success alone.</p>
        {error && <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3">{error}</div>}
        <div className="mt-6 flex gap-3 justify-center">
          <button onClick={() => handleOnlinePayment(result)} className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0a1e40] font-black rounded-full">Retry Payment</button>
          <a href="/customer/bookings" className="px-6 py-3 border border-slate-200 rounded-full font-bold">Go to My Bookings</a>
        </div>
      </div>
    );
  }

  const steps = ['Service', 'Date', 'Time', 'Details', 'Address', 'Summary'];

  return (
    <div className="bg-white rounded-[24px] border border-slate-200 shadow-card overflow-hidden">
      <div className="bg-[#0a1e40] text-white px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black">Book Your Service</h3>
          <span className="text-xs bg-yellow-400 text-[#0a1e40] font-black px-2 py-1 rounded-full">Step {step} of 6</span>
        </div>
        <div className="mt-3 flex gap-1.5">
          {steps.map((s, i) => (
            <div key={s} className={`flex-1 h-1.5 rounded-full ${i + 1 <= step ? 'bg-yellow-400' : 'bg-white/20'} transition`} />
          ))}
        </div>
      </div>

      <div className="p-4 md:p-6">
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}

        {step === 1 && (
          <div>
            <h4 className="font-black text-[#0a1e40]">Select Service Type</h4>
            <p className="text-xs text-slate-500">Choose the service you need</p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {services.map(s => (
                <button key={s._id} onClick={() => setForm({ ...form, service: s._id, serviceObj: s })} className={`text-left border rounded-2xl overflow-hidden p-0 ${form.service === s._id ? 'border-[#0a1e40] ring-2 ring-yellow-400' : 'border-slate-200 hover:border-slate-300'} transition`}>
                  <img src={s.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80'} alt={s.title} className="w-full h-28 object-cover" />
                  <div className="p-3">
                    <div className="font-bold text-sm text-[#0a1e40]">{s.title}</div>
                    <div className="text-xs text-slate-500">{s.category}</div>
                    <div className="mt-1 font-black text-sm">₹{s.price}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h4 className="font-black text-[#0a1e40]">Select Date</h4>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} min={new Date().toISOString().slice(0, 10)} className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1e4a9a]" />
          </div>
        )}

        {step === 3 && (
          <div>
            <h4 className="font-black text-[#0a1e40]">Available Time Slots — {form.date}</h4>
            {loadingSlots ? <div className="mt-4 text-sm text-slate-500">Loading slots…</div> : (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                {slots.map(s => (
                  <button key={s.slot} disabled={!s.available} onClick={() => setForm({ ...form, timeSlot: s.slot })} className={`p-3 rounded-xl border text-sm font-bold ${!s.available ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : form.timeSlot === s.slot ? 'bg-[#0a1e40] text-white' : 'bg-white border-slate-200 hover:border-[#1e4a9a]'}`}>
                    {s.slot}<div className="text-[11px] font-normal">{s.available ? `${s.capacity - s.booked} spots left` : 'Fully booked'}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <h4 className="font-black text-[#0a1e40]">Customer Details</h4>
            <input placeholder="Full Name *" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e4a9a]" />
            <input placeholder="Email *" value={form.customerEmail} onChange={e => setForm({ ...form, customerEmail: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
            <input placeholder="Phone *" value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
            <textarea placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-3">
            <h4 className="font-black text-[#0a1e40]">Service Address</h4>
            <textarea placeholder="Full Address *" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="City *" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
              <input placeholder="Pincode" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <h4 className="font-black text-[#0a1e40]">Booking Summary & Payment</h4>
            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Service</span><span className="font-bold">{form.serviceObj?.title}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Date & Time</span><span className="font-bold">{form.date} • {form.timeSlot}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Customer</span><span className="font-bold">{form.customerName} • {form.customerPhone}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Address</span><span className="font-bold text-right max-w-[60%]">{form.address}, {form.city}</span></div>
              <div className="border-t pt-2 flex justify-between text-base"><span className="font-black">Total</span><span className="font-black text-[#0a1e40]">₹{form.serviceObj?.price}</span></div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button onClick={() => setPaymentMethod('cod')} className={`p-4 rounded-2xl border text-left ${paymentMethod === 'cod' ? 'border-[#0a1e40] bg-blue-50 ring-2 ring-yellow-400' : 'border-slate-200 bg-white'}`}>
                <div className="font-black text-sm">💵 Pay After Service (COD)</div>
                <div className="text-xs text-slate-600">No advance. Technician collects after work.</div>
              </button>
              <button onClick={() => setPaymentMethod('online')} className={`p-4 rounded-2xl border text-left ${paymentMethod === 'online' ? 'border-[#0a1e40] bg-amber-50 ring-2 ring-yellow-400' : 'border-slate-200 bg-white'}`}>
                <div className="font-black text-sm">💳 Pay Online Now</div>
                <div className="text-xs text-slate-600">Razorpay secure • UPI/Card • Instant confirm</div>
                <div className="mt-1 text-[11px] bg-yellow-400 inline-flex px-2 py-0.5 rounded-full font-bold">Verified via HMAC</div>
              </button>
            </div>
            <div className="mt-2 text-xs text-slate-500">Online payments are verified on backend. Never trust frontend success — booking confirms only after HMAC check.</div>
            {!token && <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm">Please <a href="/login" className="underline font-bold">login</a> to confirm.</div>}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          {step > 1 && <button onClick={() => setStep(step - 1)} className="px-5 py-3 rounded-xl border font-bold">Back</button>}
          {step < 6 ? (
            <button disabled={!canNext()} onClick={() => setStep(step + 1)} className={`ml-auto px-6 py-3 rounded-xl font-black ${canNext() ? 'bg-[#0a1e40] text-white' : 'bg-slate-200 text-slate-400'}`}>Next →</button>
          ) : (
            <button disabled={submitting} onClick={handleCreate} className="ml-auto px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0a1e40] font-black disabled:opacity-60">
              {submitting ? 'Creating…' : paymentMethod === 'cod' ? 'Confirm Booking (COD) →' : 'Confirm & Pay Online →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
