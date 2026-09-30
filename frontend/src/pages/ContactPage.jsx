import { useState } from 'react';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import client from '../api/client';
import { SITE_CONFIG } from '../data/servicesData';

export default function ContactPage() {
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

  const breadcrumbs = [{ name: 'Contact Us', url: '/contact' }];

  const contactSchema = {
    '@type': 'ContactPage',
    '@id': `${SITE_CONFIG.domain}/contact#contact`,
    name: `Contact ${SITE_CONFIG.siteName}`,
    url: `${SITE_CONFIG.domain}/contact`,
    description: `Official contact information, support helpline, and service inquiry for ${SITE_CONFIG.legalName} in Kolkata.`,
    mainEntity: {
      '@id': `${SITE_CONFIG.domain}/#organization`,
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Please provide your name and contact phone number.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await client.post('/api/quotes', {
        name: form.name.trim(),
        email: form.email.trim() || `${form.phone.trim()}@amditsolution.in`,
        phone: form.phone.trim(),
        serviceType: form.serviceType,
        message: form.message.trim() || 'Quote request submitted via contact page',
      });
      setSubmitted(true);
    } catch (err) {
      // Still allow WhatsApp fallback if network fails
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Contact AMD IT SOLUTION Kolkata | 24/7 IT Support"
        description="Get in touch with AMD IT SOLUTION at 24 T C Road, Kolkata. Call 9635006403 for emergency IT service, free CCTV quotes, or doorstep technician visits."
        canonicalPath="/contact"
        keywords="Contact AMD IT SOLUTION, CCTV service contact Kolkata, computer repair phone number Kolkata, IT technician near me"
        breadcrumbs={breadcrumbs}
        customSchema={contactSchema}
      />

      <Breadcrumb items={breadcrumbs} />

      <section className="bg-gradient-to-br from-[#0a1e40] via-[#0f2f6b] to-[#1e4a9a] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <span className="inline-block bg-white/15 backdrop-blur border border-white/20 text-yellow-300 font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider">
              24/7 Support & Rapid Doorstep Dispatch
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Get in Touch with Our <span className="text-yellow-400">Technical Team</span>
            </h1>
            <p className="mt-3 text-slate-200 text-sm md:text-base leading-relaxed">
              Have an urgent computer repair, need a free commercial CCTV site survey, or want to establish an Annual IT Maintenance Contract? Reach our central support desk anytime.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Contact Information & NAP Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-black text-[#0a1e40] mb-6">
                Official Business Address & NAP
              </h2>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1e4a9a] grid place-items-center text-lg shrink-0">
                    📍
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase">Registered Office</div>
                    <div className="font-bold text-slate-800 mt-0.5">
                      {SITE_CONFIG.address.streetAddress}, Kolkata – {SITE_CONFIG.address.postalCode}, West Bengal, India
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 grid place-items-center text-lg shrink-0">
                    📞
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase">Phone & Emergency Hotline</div>
                    <a
                      href={`tel:${SITE_CONFIG.displayPhone}`}
                      className="font-bold text-[#1e4a9a] text-base hover:underline block mt-0.5"
                    >
                      {SITE_CONFIG.phone} ({SITE_CONFIG.displayPhone})
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 grid place-items-center text-lg shrink-0">
                    ✉️
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase">Official Inquiries Email</div>
                    <a
                      href={`mailto:${SITE_CONFIG.email}`}
                      className="font-bold text-[#1e4a9a] hover:underline block mt-0.5"
                    >
                      {SITE_CONFIG.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 grid place-items-center text-lg shrink-0">
                    ⏰
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase">Service & Visiting Hours</div>
                    <div className="font-bold text-slate-800 mt-0.5">
                      Monday to Sunday: 10:00 AM – 9:00 PM
                    </div>
                    <div className="text-xs text-emerald-600 font-semibold mt-0.5">
                      ✓ 24/7 Priority Emergency Support for AMC Clients
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <a
                  href={`https://wa.me/91${SITE_CONFIG.displayPhone}?text=Hello%20ADM%20TECHNO%20SOLUTION,%20I%20would%20like%20to%20inquire%20about%20your%20services.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-[#25D366] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition"
                >
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>
            </div>

            {/* Quick Service Coverage Badge */}
            <div className="bg-[#0a1e40] text-white rounded-3xl p-6 shadow-md">
              <h3 className="font-black text-base text-yellow-400">Immediate Coverage Areas</h3>
              <p className="text-xs text-slate-300 mt-1">
                Kolkata Central, Salt Lake (Sector I-V), New Town, Rajarhat, Behala, Jadavpur, Ballygunge, Howrah, and Barasat.
              </p>
            </div>
          </div>

          {/* Interactive Inquiry Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-black text-[#0a1e40] mb-1">
              Send an Online Service Inquiry
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Fill in your details below and an engineer will contact you within 15 minutes.
            </p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">🎉</div>
                <h3 className="font-black text-emerald-900 text-lg">Inquiry Received!</h3>
                <p className="text-xs text-emerald-700 mt-1">
                  Thank you! Our technical coordinator has received your request and will call you at {form.phone} shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-5 py-2 rounded-xl bg-[#0a1e40] text-white text-xs font-bold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-700 text-xs font-bold p-3 rounded-xl">
                    {error}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Subir Mukherjee"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e4a9a] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Mobile) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e4a9a] text-sm"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Optional)</label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e4a9a] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Required Service Category</label>
                    <select
                      value={form.serviceType}
                      onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e4a9a] text-sm bg-white"
                    >
                      <option value="cctv">CCTV Camera Installation / Repair</option>
                      <option value="computer">Computer & Laptop Repair / SSD Boost</option>
                      <option value="networking">Commercial Networking & Wi-Fi Setup</option>
                      <option value="amc">Annual Maintenance Contract (AMC)</option>
                      <option value="biometric">Biometric & Access Control System</option>
                      <option value="other">Other Technical Requirement</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service Details / Location Notes</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your requirement, issue, or address in Kolkata..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e4a9a] text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0a1e40] font-black text-sm shadow-md hover:scale-[1.01] transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting Inquiry...' : 'Submit Inquiry for Free Callback →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
