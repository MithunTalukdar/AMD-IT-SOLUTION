import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const STATIC_SERVICES = [
  { _id: 'cctv-home-kit', slug: 'cctv-home-kit', title: '2 Camera HD Home Surveillance Kit', category: 'cctv', price: 6499, image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80' },
  { _id: 'cctv-shop-combo', slug: 'cctv-shop-combo', title: '4 Camera Commercial & Shop Combo', category: 'cctv', price: 12999, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80' },
  { _id: 'cctv-ip-enterprise', slug: 'cctv-ip-enterprise', title: 'IP Camera & NVR Enterprise Surveillance', category: 'cctv', price: 18999, image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&q=80' },
  { _id: 'computer-repair-service', slug: 'computer-repair-service', title: 'Computer & Laptop Repair / Full Service', category: 'computer', price: 599, image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80' },
  { _id: 'ssd-speed-upgrade', slug: 'ssd-speed-upgrade', title: 'Superfast SSD & RAM Speed Boost Upgrade', category: 'computer', price: 2199, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&q=80' },
  { _id: 'custom-pc-assembly', slug: 'custom-pc-assembly', title: 'Custom PC Assembly (Office / Gaming / Editing)', category: 'computer', price: 18999, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80' },
  { _id: 'printer-repair-service', slug: 'printer-repair-service', title: 'Printer Repair & Cartridge Refilling', category: 'computer', price: 499, image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&q=80' },
  { _id: 'office-wifi-mesh-setup', slug: 'office-wifi-mesh-setup', title: 'High-Speed Office Wi-Fi & Mesh Setup', category: 'networking', price: 3999, image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&q=80' },
  { _id: 'structured-lan-cabling-rack', slug: 'structured-lan-cabling-rack', title: 'Structured LAN Cabling & Server Rack Setup', category: 'networking', price: 7999, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80' },
  { _id: 'firewall-router-vpn-config', slug: 'firewall-router-vpn-config', title: 'Firewall, Router & Secure VPN Configuration', category: 'networking', price: 5499, image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=80' },
  { _id: 'amc-small-office-plan', slug: 'amc-small-office-plan', title: 'Annual AMC — Small Office / Shop Plan', category: 'amc', price: 4999, image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80' },
  { _id: 'amc-corporate-pro-plan', slug: 'amc-corporate-pro-plan', title: 'Annual AMC — Corporate Pro Plan (10-30 PCs)', category: 'amc', price: 9999, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80' },
  { _id: 'amc-enterprise-plan', slug: 'amc-enterprise-plan', title: 'Annual AMC — Enterprise Plan (Large Office / Warehouse)', category: 'amc', price: 19999, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80' },
  { _id: 'biometric-attendance-access', slug: 'biometric-attendance-access', title: 'Biometric Attendance & Access Control System', category: 'biometric', price: 7500, image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&q=80' },
];

const WIZARD_CATEGORIES = [
  { id: 'all', name: 'All Services' },
  { id: 'cctv', name: 'CCTV' },
  { id: 'computer', name: 'Computer & Laptop' },
  { id: 'networking', name: 'Networking' },
  { id: 'amc', name: 'AMC Plans' },
  { id: 'biometric', name: 'Biometric' },
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

const ALIAS_MAP = {
  'laptop-service': 'computer-repair-service',
  'computer-service': 'computer-repair-service',
  'ssd-speed-upgrade': 'ssd-speed-upgrade',
  'desktop-assemble': 'custom-pc-assembly',
  'custom-pc': 'custom-pc-assembly',
  'printer-repair': 'printer-repair-service',
  'office-wifi-setup': 'office-wifi-mesh-setup',
  'structured-lan-cabling': 'structured-lan-cabling-rack',
  'firewall-vpn-setup': 'firewall-router-vpn-config',
  'amc-basic-plan': 'amc-small-office-plan',
  'amc-professional-plan': 'amc-corporate-pro-plan',
  'amc-corporate': 'amc-corporate-pro-plan',
  'amc-enterprise': 'amc-enterprise-plan',
  'amc-enterprise-plan': 'amc-enterprise-plan',
  'biometric-attendance': 'biometric-attendance-access',
};

export default function BookingWizard({ onSuccess }) {
  const { user, token } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Query parameter inputs
  const requestedService = (searchParams.get('service') || '').trim();
  const requestedDate = (searchParams.get('date') || '').trim();
  const requestedPhone = (searchParams.get('phone') || '').trim();
  const requestedCity = (searchParams.get('city') || '').trim();

  const returnTo = useMemo(
    () => (requestedService ? `/booking?service=${encodeURIComponent(requestedService)}` : '/booking'),
    [requestedService]
  );
  const [step, setStep] = useState(1);
  const [services, setServices] = useState(STATIC_SERVICES);
  const [servicesLoaded, setServicesLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isChangingService, setIsChangingService] = useState(false);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [validationMsg, setValidationMsg] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod | online
  const [paymentState, setPaymentState] = useState('idle'); // idle | creating | verifying | success | failed

  const [form, setForm] = useState({
    service: '',
    serviceObj: null,
    date: requestedDate || '',
    timeSlot: '',
    customerName: user?.fullname || '',
    customerEmail: user?.email || '',
    customerPhone: requestedPhone || user?.phone || '',
    address: '',
    city: requestedCity || 'Kolkata',
    pincode: '',
    notes: '',
  });

  useEffect(() => {
    client.get('/api/services').then(r => {
      if (r.data?.data?.length) setServices(r.data.data);
      setServicesLoaded(true);
    }).catch(() => { setServicesLoaded(true); });
  }, []);

  // Preselect the service from ?service=<id|slug|category|title>
  useEffect(() => {
    if (!services || services.length === 0) return;

    if (!requestedService) {
      if (!form.serviceObj) {
        const def = services.find(s => s.category === 'computer') || services[0];
        setForm(f => ({ ...f, service: def._id, serviceObj: def }));
      }
      return;
    }

    const rawQ = requestedService.toLowerCase().trim();
    const resolvedSlug = ALIAS_MAP[rawQ] || rawQ;

    // 1. Match by _id or exact slug
    let match = services.find(s =>
      s._id === requestedService ||
      (s.slug || '').toLowerCase() === resolvedSlug ||
      (s.slug || '').toLowerCase() === rawQ
    );

    // 2. Match by exact title
    if (!match) {
      match = services.find(s => (s.title || '').toLowerCase() === rawQ);
    }

    // 3. Match by partial title / partial slug
    if (!match) {
      match = services.find(s =>
        (s.slug || '').toLowerCase().includes(rawQ) ||
        (s.title || '').toLowerCase().includes(rawQ)
      );
    }

    // 4. Match by category (fallback)
    if (!match) {
      match = services.find(s => (s.category || '').toLowerCase() === rawQ);
    }

    if (match) {
      if (match.category) {
        setSelectedCategory(match.category);
      }
      setForm(f => ({
        ...f,
        service: match._id,
        serviceObj: match,
        date: f.date || requestedDate || '',
        customerPhone: f.customerPhone || requestedPhone || '',
        city: f.city || requestedCity || 'Kolkata',
      }));
    }
  }, [requestedService, services, requestedDate, requestedPhone, requestedCity]);

  useEffect(() => {
    if (form.customerName === '' && user?.fullname) {
      setForm(f => ({ ...f, customerName: user.fullname, customerEmail: user.email, customerPhone: f.customerPhone || user.phone || '' }));
    }
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

  const validateStep = (s = step) => {
    if (s === 1 && !form.service) return 'Please select a service to continue.';
    if (s === 2) {
      if (!form.date) return 'Please select a date.';
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const picked = new Date(form.date + 'T00:00:00');
      if (isNaN(picked.getTime())) return 'Please select a valid date.';
      if (picked < today) return 'Please select today or a future date.';
    }
    if (s === 3 && !form.timeSlot) return 'Please select a time slot.';
    if (s === 4) {
      if (!form.customerName?.trim()) return 'Please enter your full name.';
      if (!form.customerEmail?.trim()) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail.trim())) return 'Please enter a valid email address.';
      if (!form.customerPhone?.trim()) return 'Please enter your phone number.';
      if (!/^[0-9+\-\s]{7,15}$/.test(form.customerPhone.trim())) return 'Please enter a valid phone number (7–15 digits).';
    }
    if (s === 5) {
      if (!form.address?.trim() || form.address.trim().length < 5) return 'Please enter your full service address (min 5 characters).';
      if (!form.city?.trim()) return 'Please enter your city.';
    }
    return '';
  };

  const handleNext = () => {
    const msg = validateStep();
    if (msg) { setValidationMsg(msg); return; }
    setValidationMsg('');
    setStep(step + 1);
  };

  const resolveServiceId = () => {
    const direct = services.find(s => s._id === form.service);
    if (direct && direct._id.length === 24) return direct._id;
    const candidates = [
      form.serviceObj,
      direct,
      requestedService ? services.find(s =>
        (s.category || '').toLowerCase() === requestedService.toLowerCase() ||
        (s.slug || '').toLowerCase() === requestedService.toLowerCase()
      ) : null,
    ].filter(Boolean);
    for (const c of candidates) {
      if (c._id && c._id.length === 24) return c._id;
      const byCat = services.find(s => s.category === c.category && s._id.length === 24);
      if (byCat) return byCat._id;
    }
    const anyReal = services.find(s => s._id.length === 24);
    return anyReal?._id || form.service || 'cctv';
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
      const { data: orderData } = await client.post('/api/payments/create-order', { bookingId: booking.bookingId });
      const { orderId, amount, currency, keyId } = orderData.data;

      await loadRazorpayScript();

      const options = {
        key: keyId,
        amount: Math.round(amount * 100),
        currency,
        name: 'ADM TECHNO SOLUTION',
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
      throw e;
    }
  };

  const handleCreate = async () => {
    if (submitting) return;
    if (!token) {
      setError('Please login to continue.');
      navigate('/login', { state: { from: returnTo } });
      return;
    }
    for (let s = 1; s <= 5; s++) {
      const msg = validateStep(s);
      if (msg) { setError(msg); setStep(s); return; }
    }
    setSubmitting(true); setError(''); setPaymentState('idle');
    try {
      const booking = await createBookingOnly();
      if (paymentMethod === 'cod') {
        setResult(booking);
        if (onSuccess) onSuccess(booking);
      } else {
        setResult(booking);
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
        <div className="mt-6 flex gap-3 justify-center">
          <Link to="/customer/bookings" className="px-6 py-3 bg-[#0a1e40] text-white font-bold rounded-full">View My Bookings →</Link>
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
          <Link to="/customer/bookings" className="px-6 py-3 bg-[#0a1e40] text-white font-bold rounded-full">View My Bookings →</Link>
          <button onClick={() => { setResult(null); setStep(1); }} className="px-6 py-3 border border-slate-200 rounded-full font-bold">Book Another</button>
        </div>
      </div>
    );
  }

  if (result && paymentState !== 'idle' && paymentState !== 'success') {
    return (
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-xl p-6 md:p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 grid place-items-center text-2xl mx-auto">◷</div>
        <h3 className="mt-4 text-xl font-black text-[#0a1e40]">{paymentState === 'creating' ? 'Creating secure order…' : paymentState === 'verifying' ? 'Verifying payment…' : 'Booking Pending — Awaiting Payment'}</h3>
        <div className="mt-2 inline-flex bg-slate-100 font-mono font-bold px-3 py-1 rounded-full text-xs">{result.bookingId} • {paymentState}</div>
        <p className="mt-3 text-sm text-slate-600">Booking is <span className="font-bold">pending</span> until payment is verified on backend.</p>
        {error && <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3">{error}</div>}
        <div className="mt-6 flex gap-3 justify-center">
          <button onClick={() => handleOnlinePayment(result)} className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0a1e40] font-black rounded-full">Retry Payment</button>
          <Link to="/customer/bookings" className="px-6 py-3 border border-slate-200 rounded-full font-bold">Go to My Bookings</Link>
        </div>
      </div>
    );
  }

  // Lock booking facility completely for non-logged-in visitors
  if (!token || !user) {
    return (
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-xl p-8 md:p-12 text-center max-w-xl mx-auto">
        <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-inner border border-amber-200">
          🔒
        </div>
        <h2 className="mt-5 text-2xl md:text-3xl font-black text-[#0a1e40]">Login Required for Booking</h2>
        <p className="mt-3 text-slate-600 leading-relaxed text-sm md:text-base">
          To access our instant booking facility, schedule technician visits, and view live service slots, please sign in to your account.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3.5 justify-center">
          <Link
            to={`/login?redirect=${encodeURIComponent(returnTo)}`}
            state={{ from: returnTo }}
            className="px-8 py-3.5 rounded-xl bg-[#0a1e40] hover:bg-[#1e4a9a] text-white font-bold transition shadow-lg flex items-center justify-center gap-2"
          >
            <span>Login to Continue</span>
            <span>→</span>
          </Link>
          <Link
            to={`/register?redirect=${encodeURIComponent(returnTo)}`}
            state={{ from: returnTo }}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-[#0a1e40] font-black transition shadow-lg flex items-center justify-center"
          >
            Create Free Account
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-6 text-xs font-semibold text-slate-500">
          <span>✓ Instant Slot Confirmation</span>
          <span>✓ Verified Technicians</span>
          <span>✓ Zero Advance Required</span>
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
          <span className="text-xs bg-yellow-400 text-[#0a1e40] font-black px-2.5 py-1 rounded-full">Step {step} of 6</span>
        </div>
        <div className="mt-3 flex gap-1.5">
          {steps.map((s, i) => (
            <div key={s} className={`flex-1 h-1.5 rounded-full ${i + 1 <= step ? 'bg-yellow-400' : 'bg-white/20'} transition`} />
          ))}
        </div>
      </div>

      <div className="p-4 md:p-6">
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
        {validationMsg && <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3">{validationMsg}</div>}
        {!token && step !== 6 && (
          <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-xl px-4 py-3">
            You can fill the details, but you&apos;ll need to <Link to="/login" state={{ from: returnTo }} className="underline font-bold">login</Link> before confirming the booking.
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h4 className="font-black text-[#0a1e40] text-lg">Selected Service for Booking</h4>
                <p className="text-xs text-slate-500">Review your chosen service before picking a date & time</p>
              </div>
              <Link to="/services" className="text-xs text-[#1e4a9a] hover:underline font-bold">
                View All Services Catalogue →
              </Link>
            </div>

            {/* If user clicked Change Service or no service selected yet */}
            {(!form.serviceObj || isChangingService) ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Choose a Service:
                  </div>
                  {form.serviceObj && (
                    <button
                      type="button"
                      onClick={() => setIsChangingService(false)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800"
                    >
                      Cancel ✕
                    </button>
                  )}
                </div>

                {/* Categories filter */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {WIZARD_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                        selectedCategory === cat.id
                          ? 'bg-[#0a1e40] text-yellow-400 shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {(selectedCategory === 'all'
                    ? services
                    : services.filter(s => (s.category || '').toLowerCase() === selectedCategory.toLowerCase())
                  ).map(s => (
                    <button
                      key={s._id || s.slug}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, service: s._id, serviceObj: s });
                        setIsChangingService(false);
                      }}
                      className="text-left border border-slate-200 hover:border-[#0a1e40] bg-white hover:bg-blue-50/50 p-3 rounded-xl transition flex items-center gap-3"
                    >
                      <img
                        src={s.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80'}
                        alt={s.title}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-[#0a1e40] truncate">{s.title}</div>
                        <div className="text-[11px] text-slate-500 capitalize">{s.category}</div>
                        <div className="font-black text-xs text-emerald-700 mt-0.5">₹{s.price}</div>
                      </div>
                      <span className="text-xs text-[#1e4a9a] font-bold">Select →</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Single Selected Service ONLY */
              <div className="bg-gradient-to-br from-white to-blue-50/40 border-2 border-[#0a1e40]/20 rounded-3xl p-5 md:p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
                  <div className="relative w-full md:w-44 h-36 rounded-2xl overflow-hidden bg-slate-100 shadow-sm shrink-0">
                    <img
                      src={form.serviceObj.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80'}
                      alt={form.serviceObj.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-[#0a1e40] text-yellow-400 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      {form.serviceObj.category}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-full mb-1.5">
                      <span>✓</span> Selected for Booking
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-[#0a1e40] leading-snug">
                      {form.serviceObj.title}
                    </h3>
                    {form.serviceObj.description && (
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {form.serviceObj.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-baseline gap-3">
                      <div>
                        <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">Service Price</span>
                        <span className="text-2xl font-black text-[#0a1e40]">₹{form.serviceObj.price}</span>
                      </div>
                      {form.serviceObj.oldPrice && (
                        <span className="text-xs line-through text-slate-400">
                          ₹{form.serviceObj.oldPrice}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        ✓ Certified Engineer Included
                      </span>
                    </div>
                  </div>
                </div>

                {form.serviceObj.features && form.serviceObj.features.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200/80 grid sm:grid-cols-2 gap-2">
                    {form.serviceObj.features.slice(0, 4).map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-[10px] shrink-0 font-black">✓</span>
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setIsChangingService(true)}
                    className="text-xs text-slate-600 hover:text-[#0a1e40] font-bold underline transition"
                  >
                    🔄 Change Service
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-full bg-[#0a1e40] text-white hover:bg-[#1e4a9a] font-black text-xs md:text-sm shadow-md transition flex items-center gap-1.5"
                  >
                    <span>Proceed to Pick Date & Time</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h4 className="font-black text-[#0a1e40]">Select Date</h4>
            <p className="text-xs text-slate-500">Pick a preferred service date</p>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              min={new Date().toISOString().slice(0, 10)}
              className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1e4a9a]"
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <h4 className="font-black text-[#0a1e40]">Available Time Slots — {form.date}</h4>
            <p className="text-xs text-slate-500">Choose a convenient arrival window</p>
            {loadingSlots ? (
              <div className="mt-4 text-sm text-slate-500">Loading slots…</div>
            ) : (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                {slots.map(s => (
                  <button
                    key={s.slot}
                    type="button"
                    disabled={!s.available}
                    onClick={() => setForm({ ...form, timeSlot: s.slot })}
                    className={`p-3 rounded-xl border text-sm font-bold transition ${
                      !s.available
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : form.timeSlot === s.slot
                        ? 'bg-[#0a1e40] text-white shadow-md'
                        : 'bg-white border-slate-200 hover:border-[#1e4a9a]'
                    }`}
                  >
                    {s.slot}
                    <div className="text-[11px] font-normal mt-0.5">
                      {s.available ? `${(s.capacity ?? 3) - s.booked} spots left` : 'Fully booked'}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <h4 className="font-black text-[#0a1e40]">Customer Details</h4>
            <p className="text-xs text-slate-500">Your contact information for technician updates</p>
            <input
              placeholder="Full Name *"
              value={form.customerName}
              onChange={e => setForm({ ...form, customerName: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e4a9a]"
            />
            <input
              placeholder="Email *"
              type="email"
              value={form.customerEmail}
              onChange={e => setForm({ ...form, customerEmail: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e4a9a]"
            />
            <input
              placeholder="Phone *"
              type="tel"
              value={form.customerPhone}
              onChange={e => setForm({ ...form, customerPhone: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e4a9a]"
            />
            <textarea
              placeholder="Special instructions or issue notes (optional)"
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e4a9a]"
            />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-3">
            <h4 className="font-black text-[#0a1e40]">Service Address</h4>
            <p className="text-xs text-slate-500">Where should our technician visit?</p>
            <textarea
              placeholder="Full Street Address / Flat No / Landmark *"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              rows={2}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e4a9a]"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="City *"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e4a9a]"
              />
              <input
                placeholder="Pincode"
                value={form.pincode}
                onChange={e => setForm({ ...form, pincode: e.target.value })}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1e4a9a]"
              />
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
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border text-left transition ${paymentMethod === 'cod' ? 'border-[#0a1e40] bg-blue-50 ring-2 ring-yellow-400' : 'border-slate-200 bg-white'}`}
              >
                <div className="font-black text-sm">💵 Pay After Service (COD)</div>
                <div className="text-xs text-slate-600 mt-1">No advance. Technician collects after work.</div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('online')}
                className={`p-4 rounded-2xl border text-left transition ${paymentMethod === 'online' ? 'border-[#0a1e40] bg-amber-50 ring-2 ring-yellow-400' : 'border-slate-200 bg-white'}`}
              >
                <div className="font-black text-sm">💳 Pay Online Now</div>
                <div className="text-xs text-slate-600 mt-1">Razorpay secure • UPI/Card • Instant confirm</div>
              </button>
            </div>

            {!token && <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm">Please <Link to="/login" state={{ from: returnTo }} className="underline font-bold">login to continue</Link> to confirm.</div>}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => { setValidationMsg(''); setStep(step - 1); }}
              className="px-5 py-3 rounded-xl border font-bold hover:bg-slate-50 transition"
            >
              Back
            </button>
          )}
          {step < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto px-6 py-3 rounded-xl font-black bg-[#0a1e40] text-white hover:bg-[#1e4a9a] transition shadow"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleCreate}
              className="ml-auto px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0a1e40] font-black disabled:opacity-60 shadow hover:scale-[1.02] active:scale-95 transition"
            >
              {submitting ? 'Booking…' : paymentMethod === 'cod' ? 'Confirm Booking (COD) →' : 'Confirm & Pay Online →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
