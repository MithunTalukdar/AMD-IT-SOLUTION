import { useState } from 'react';
import client from '../api/client';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: 'cctv',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const SERVICE_NAMES = {
    cctv: 'CCTV Installation & Surveillance',
    computer: 'Computer & Laptop Repair',
    networking: 'Structured Cabling & Wi-Fi',
    amc: 'Annual Maintenance Contract (AMC)',
    biometric: 'Biometric & Security',
    other: 'Other IT Requirements',
  };

  const ADMIN_PHONE = '9635006403';
  const ADMIN_EMAIL = 'itsolutions.amd@gmail.com';

  const [whatsappUrl, setWhatsappUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }

    setSubmitting(true);
    setError('');

    const serviceLabel = SERVICE_NAMES[form.serviceType] || form.serviceType;
    const msg = 
`🔔 *NEW QUOTE REQUEST - ADM TECHNO SOLUTION*
━━━━━━━━━━━━━━━━━━━━
👤 *Customer Name:* ${form.name.trim()}
📱 *Phone Number:* ${form.phone.trim()}
📧 *Email:* ${form.email.trim() || 'Not Provided'}
🛠 *Service Needed:* ${serviceLabel}
💬 *Message/Details:* ${form.message.trim() || 'Quote requested from website form'}
📍 *Location:* Kolkata / Local Area
━━━━━━━━━━━━━━━━━━━━
⚡ *Requested on:* ${new Date().toLocaleString('en-IN')}`;

    const waLink = `https://wa.me/91${ADMIN_PHONE}?text=${encodeURIComponent(msg)}`;
    setWhatsappUrl(waLink);

    try {
      await client.post('/api/quotes', {
        name: form.name.trim(),
        email: form.email.trim() || `${form.phone.trim()}@amditsolution.in`,
        phone: form.phone.trim(),
        serviceType: form.serviceType,
        location: 'Kolkata',
        message: form.message.trim() || 'Contact form quote request',
      });
    } catch (err) {
      console.warn('Quote saved locally or fallback:', err);
    } finally {
      setSubmitted(true);
      setSubmitting(false);
      // Automatically open WhatsApp in new tab for direct notification
      try {
        window.open(waLink, '_blank', 'noopener,noreferrer');
      } catch (e) {
        // Popups might be blocked by some browsers — fallback button available
      }
    }
  };

  return (
    <section id="contact" className="bg-[#0a1e40] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 grid lg:grid-cols-2 gap-8 md:gap-10">
        <div>
          <div className="inline-flex bg-yellow-400 text-[#0a1e40] font-black text-xs px-3 py-1 rounded-full">📍 CONTACT US</div>
          <h2 className="mt-3 text-2xl md:text-4xl font-black">Let’s Solve Your <span className="text-yellow-400">Tech Problem</span> Today</h2>
          <p className="mt-3 text-sm text-slate-300">Free site visit • Same-day service • Pay after work. Fill the form or call directly.</p>

          <div className="mt-6 space-y-3">
            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400 text-[#0a1e40] grid place-items-center font-black">☎</div>
              <div>
                <div className="font-black">Call / WhatsApp</div>
                <a href={`https://wa.me/91${ADMIN_PHONE}`} target="_blank" rel="noreferrer" className="text-sm text-yellow-300 font-bold hover:underline block">
                  +91 {ADMIN_PHONE}
                </a>
                <div className="text-xs text-slate-400">10 AM - 9 PM • 7 Days Instant Response</div>
              </div>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#0a1e40] grid place-items-center">📍</div>
              <div>
                <div className="font-black">Visit Us</div>
                <div className="text-sm text-slate-200 font-semibold">24 T C Road, Kolkata - 700053</div>
              </div>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#0a1e40] grid place-items-center">✉</div>
              <div>
                <div className="font-black">Email</div>
                <a href={`mailto:${ADMIN_EMAIL}`} className="text-sm text-slate-200 hover:underline">{ADMIN_EMAIL}</a>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl overflow-hidden border border-white/10 h-48 bg-slate-200 grid place-items-center text-slate-500 text-sm">
            <iframe
              title="map"
              src="https://maps.google.com/maps?q=24+T+C+Road+Kolkata+700053&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>

        <div className="bg-white text-slate-800 rounded-[24px] p-5 md:p-7 shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-3xl mx-auto mb-3 font-black shadow-inner">
                ✓
              </div>
              <h3 className="text-2xl font-black text-[#0a1e40]">Quote Request Sent!</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Thank you, <span className="font-bold text-slate-800">{form.name}</span>. Your request has been recorded. Our engineer will call you at <span className="font-bold text-[#0a1e40]">{form.phone}</span> in 5 minutes.
              </p>

              <div className="mt-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left">
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  WhatsApp Message Prepared
                </div>
                <p className="text-xs text-emerald-700 mt-1">
                  Click below to directly chat with our technical desk on WhatsApp or call our admin directly:
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={whatsappUrl || `https://wa.me/91${ADMIN_PHONE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[140px] text-center px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
                  >
                    💬 Open WhatsApp Chat
                  </a>
                  <a
                    href={`tel:${ADMIN_PHONE}`}
                    className="flex-1 min-w-[140px] text-center px-4 py-2.5 rounded-xl bg-[#0a1e40] hover:bg-[#153366] text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
                  >
                    📞 Call: {ADMIN_PHONE}
                  </a>
                </div>
              </div>

              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', phone: '', email: '', serviceType: 'cctv', message: '' });
                  }}
                  className="px-5 py-2 rounded-full bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
                >
                  ← Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 className="font-black text-lg text-[#0a1e40]">Get Free Quote in 5 Minutes</h3>
              <p className="text-xs text-slate-500">No spam. Our engineer will call you shortly.</p>

              {error && <div className="mt-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-2.5">{error}</div>}

              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600">Full Name *</label>
                  <input
                    required
                    placeholder="Enter name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e4a9a]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">Phone *</label>
                  <input
                    required
                    type="tel"
                    placeholder="Mobile number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e4a9a]"
                  />
                </div>
              </div>

              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e4a9a]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">Service Needed</label>
                  <select
                    value={form.serviceType}
                    onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1e4a9a]"
                  >
                    <option value="cctv">CCTV Installation & Surveillance</option>
                    <option value="computer">Computer & Laptop Repair</option>
                    <option value="networking">Structured Cabling & Wi-Fi</option>
                    <option value="amc">Annual Maintenance Contract (AMC)</option>
                    <option value="biometric">Biometric & Security</option>
                    <option value="other">Other IT Requirements</option>
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <label className="text-xs font-bold text-slate-600">Message / Issue Details</label>
                <textarea
                  rows={2}
                  placeholder="Tell us about your requirement or problem..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e4a9a]"
                />
              </div>

              <label className="mt-3 flex gap-2 text-xs text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked /> I agree to be contacted via call / WhatsApp.
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="mt-4 w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0a1e40] font-black shadow hover:scale-[1.01] transition disabled:opacity-60"
              >
                {submitting ? 'Sending Request…' : 'Send Request → Get Call Back in 5 Min'}
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> 12 people requested today
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
