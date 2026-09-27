import { useState } from 'react';
import { Link } from 'react-router-dom';
import SiteSurveyModal from './SiteSurveyModal';

const plans = [
  {
    name: 'Basic AMC Plan',
    slug: 'amc-small-office-plan',
    price: 4999,
    originalPrice: 9000,
    period: '/year',
    badge: 'Starter Choice',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    forWhom: 'Shops & Small Offices',
    coverage: 'Up to 5 PCs + 1 Printer + Wi-Fi Router',
    responseSLA: '4-Hour Emergency Response',
    popular: false,
    cta: 'Choose Basic Plan',
    features: [
      '4 Scheduled preventive maintenance visits / year',
      'Unlimited remote support via AnyDesk / TeamViewer',
      'OS tune-up, junk clearing & antivirus updates',
      'Printer troubleshooting & Wi-Fi router optimization',
      '10% Flat discount on all replacement spare parts',
      'Doorstep engineer visit within 4 hours for emergencies',
    ],
  },
  {
    name: 'Corporate Pro AMC',
    slug: 'amc-corporate-pro-plan',
    price: 9999,
    originalPrice: 16000,
    period: '/year',
    badge: '★ MOST POPULAR • BEST VALUE',
    badgeColor: 'bg-yellow-400 text-[#0a1e40]',
    forWhom: 'Growing Offices & Retail Stores',
    coverage: '10 to 30 PCs + CCTV DVR + Network Switch + Biometric',
    responseSLA: 'Guaranteed 2-Hour SLA Across Kolkata',
    popular: true,
    cta: 'Book Corporate Pro AMC',
    features: [
      '12 Monthly routine maintenance visits included',
      'Unlimited emergency breakdown visits with 2-Hr SLA',
      'Full coverage: Computers, CCTV Cameras, Wi-Fi & Biometric',
      'Free standby backup PC during major hardware repairs',
      '20% Flat discount on genuine hardware parts',
      'Monthly network security audit & cloud backup compliance',
    ],
  },
  {
    name: 'Enterprise AMC',
    slug: 'amc-enterprise-plan',
    price: 19999,
    originalPrice: 28000,
    period: '/year',
    badge: 'Enterprise Grade',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    forWhom: 'Corporate Houses & Multi-Branch Offices',
    coverage: '30+ PCs / Multi-Site / Server Racks & Cloud NVR',
    responseSLA: 'Dedicated Engineer + 24/7 WhatsApp SLA',
    popular: false,
    cta: 'Choose Enterprise Plan',
    features: [
      '24 Scheduled visits (Twice Monthly) + 24/7 priority support',
      'Dedicated certified account engineer assigned to your office',
      'Full server rack, managed switches, firewall & VPN coverage',
      '30% Discount on hardware + free loaner equipment',
      'Quarterly cybersecurity assessment & disaster recovery plan',
      'Multi-branch single contract with consolidated GST billing',
    ],
  },
];

export default function AMCSection() {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);

  return (
    <section id="amc" className="bg-gradient-to-b from-[#0a1e40] via-[#0b244d] to-[#0a1e40] text-white py-14 md:py-20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-[#0a1e40] font-black text-xs px-3.5 py-1.5 rounded-full shadow-md">
            🛡️ ANNUAL MAINTENANCE CONTRACT (AMC)
          </div>
          <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Zero Tech Downtime. <span className="text-yellow-400">Total Peace of Mind.</span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            One comprehensive annual plan covering your computers, CCTV, printers, biometric & office network. Certified engineers at your doorstep within 2 hours.
          </p>

          {/* Quick trust metrics */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-4 text-xs font-bold text-slate-300">
            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">✓ 2-Hour Response SLA</span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">✓ 100% Certified Engineers</span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">✓ Standby Backup Hardware</span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">✓ GST Invoicing</span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {plans.map((p) => {
            const isPop = p.popular;
            return (
              <div
                key={p.name}
                className={`relative rounded-[28px] transition-all duration-300 flex flex-col justify-between ${
                  isPop
                    ? 'bg-white text-slate-800 border-2 border-yellow-400 shadow-[0_20px_60px_rgba(250,204,21,0.3)] md:-translate-y-2'
                    : 'bg-white/[0.07] backdrop-blur-xl border border-white/15 text-white hover:bg-white/[0.12] hover:border-white/30'
                } p-6 md:p-7`}
              >
                {/* Popular Pill */}
                {isPop && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-[#0a1e40] font-black text-xs px-4 py-1 rounded-full shadow-lg whitespace-nowrap tracking-wide">
                    {p.badge}
                  </div>
                )}

                <div>
                  {/* Non-popular badge */}
                  {!isPop && (
                    <span className={`inline-block text-[11px] font-black px-2.5 py-0.5 rounded-full border mb-2 ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                  )}

                  <div className={`text-xl font-black ${isPop ? 'text-[#0a1e40]' : 'text-white'}`}>
                    {p.name}
                  </div>
                  <div className={`text-xs mt-0.5 font-medium ${isPop ? 'text-slate-500' : 'text-slate-300'}`}>
                    {p.forWhom}
                  </div>

                  {/* Pricing Display */}
                  <div className="mt-4 pb-4 border-b border-slate-200/40 flex items-baseline gap-2">
                    <span className={`text-3xl md:text-4xl font-black ${isPop ? 'text-[#0a1e40]' : 'text-yellow-400'}`}>
                      ₹{p.price.toLocaleString()}
                    </span>
                    <span className={`text-xs font-semibold ${isPop ? 'text-slate-500' : 'text-slate-400'}`}>
                      {p.period}
                    </span>
                    <span className="text-xs line-through text-slate-400 ml-auto font-medium">
                      ₹{p.originalPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Coverage & SLA Highlight Box */}
                  <div className={`mt-4 rounded-2xl p-3 text-xs space-y-1.5 ${isPop ? 'bg-blue-50/70 border border-blue-100 text-[#0a1e40]' : 'bg-white/5 border border-white/10 text-slate-200'}`}>
                    <div><span className="font-bold text-yellow-500">Coverage:</span> {p.coverage}</div>
                    <div><span className="font-bold text-emerald-400">SLA:</span> {p.responseSLA}</div>
                  </div>

                  {/* Features Checklist */}
                  <div className="mt-5 space-y-2.5">
                    <div className={`text-[11px] font-bold uppercase tracking-wider ${isPop ? 'text-slate-400' : 'text-slate-400'}`}>
                      What&apos;s Included:
                    </div>
                    {p.features.map((f, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs font-medium leading-relaxed">
                        <span className={`w-4 h-4 rounded-full grid place-items-center text-[10px] shrink-0 font-black mt-0.5 ${
                          isPop ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          ✓
                        </span>
                        <span className={isPop ? 'text-slate-700' : 'text-slate-200'}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="mt-7 pt-4 border-t border-slate-200/40">
                  <Link
                    to={`/booking?service=${p.slug}`}
                    className={`block w-full py-3.5 rounded-full font-black text-xs md:text-sm text-center shadow-lg transition-all transform active:scale-95 ${
                      isPop
                        ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-[#0a1e40] hover:shadow-yellow-400/50 hover:scale-[1.02]'
                        : 'bg-white/15 border border-white/20 text-white hover:bg-yellow-400 hover:text-[#0a1e40] hover:border-yellow-400'
                    }`}
                  >
                    {p.cta} →
                  </Link>
                  <div className={`mt-2 text-center text-[11px] font-medium ${isPop ? 'text-slate-400' : 'text-slate-400'}`}>
                    Instant confirmation • Pay after first visit or online
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom AMC & Enterprise Consultation Banner */}
        <div className="mt-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[28px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="max-w-2xl text-center md:text-left">
            <span className="bg-yellow-400 text-[#0a1e40] font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Need Multi-Branch or Custom AMC?
            </span>
            <h3 className="mt-2 text-xl md:text-2xl font-black text-white">
              Have 50+ computers, multiple warehouses, or specific SLA requirements?
            </h3>
            <p className="mt-1.5 text-xs md:text-sm text-slate-300 leading-relaxed">
              Our technical architects will conduct a <span className="text-yellow-400 font-bold">free site inspection</span> and prepare a tailored AMC contract with custom SLAs, dedicated engineers, and standby spares.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <a
              href="tel:9635006403"
              className="py-3 px-6 rounded-full bg-yellow-400 text-[#0a1e40] font-black text-xs md:text-sm text-center shadow-md hover:bg-yellow-300 transition"
            >
              📞 Call AMC Head: 9635006403
            </a>
            <button
              type="button"
              onClick={() => setIsSurveyOpen(true)}
              className="py-3 px-6 rounded-full bg-white text-[#0a1e40] font-bold text-xs md:text-sm text-center hover:bg-yellow-400 transition shadow"
            >
              Request Free Site Survey →
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Free Site Survey Modal */}
      <SiteSurveyModal
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
        defaultService="amc"
      />
    </section>
  );
}
