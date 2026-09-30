import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { SITE_CONFIG, CATEGORIES } from '../data/servicesData';

export default function About() {
  const breadcrumbs = [{ name: 'About Us', url: '/about' }];

  const aboutSchema = {
    '@type': 'AboutPage',
    '@id': `${SITE_CONFIG.domain}/about#about`,
    name: `About ${SITE_CONFIG.siteName}`,
    url: `${SITE_CONFIG.domain}/about`,
    description: `Leading IT services and CCTV technology provider in Kolkata, serving residential and enterprise clients since ${SITE_CONFIG.foundedYear}.`,
    mainEntity: {
      '@id': `${SITE_CONFIG.domain}/#organization`,
    },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="About AMD IT SOLUTION | Certified IT Partner Kolkata"
        description="Serving 5,000+ businesses across Kolkata and West Bengal since 2012. Meet our certified hardware & network engineers providing trusted 24/7 IT support."
        canonicalPath="/about"
        keywords="About AMD IT SOLUTION, IT company Kolkata, certified CCTV technicians, computer engineer West Bengal"
        breadcrumbs={breadcrumbs}
        customSchema={aboutSchema}
      />

      <Breadcrumb items={breadcrumbs} />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#0a1e40] via-[#0f2f6b] to-[#1e4a9a] text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <span className="inline-block bg-yellow-400 text-[#0a1e40] font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider">
              Established {SITE_CONFIG.foundedYear} • 14+ Years of Engineering Excellence
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Kolkata’s Most Trusted <span className="text-yellow-400">IT Infrastructure</span> Partner
            </h1>
            <p className="mt-4 text-slate-200 text-sm md:text-base leading-relaxed">
              ADM TECHNO SOLUTION (operating under AMD IT SOLUTION) was established with a singular mission: to provide transparent, verified, and enterprise-grade technology services directly to homes, retail shops, and corporate enterprises across West Bengal.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: '5,000+', label: 'Delivered Projects' },
            { num: '1,240+', label: '5-Star Google Reviews' },
            { num: '14+', label: 'Years Serving Kolkata' },
            { num: '2 Hours', label: 'Average Emergency SLA' },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg text-center">
              <div className="text-2xl md:text-3xl font-black text-[#0a1e40]">{stat.num}</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Narrative Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5 text-slate-700 leading-relaxed text-sm md:text-base">
            <h2 className="text-2xl md:text-3xl font-black text-[#0a1e40]">
              Built On Integrity, Certified Technicians, and Zero Hidden Costs
            </h2>
            <p>
              In an industry plagued by unverified freelancers and arbitrary pricing, we built ADM TECHNO SOLUTION around strict engineering standards. Every camera we install, every cable we lay, and every computer motherboard we repair is backed by genuine manufacturer bills and our comprehensive service guarantee.
            </p>
            <p>
              From small boutique retail outlets requiring 2-camera security in New Town to multi-floor corporate IT networks in Salt Lake Sector V, our dedicated fleet of field technicians delivers fast, on-site support with complete testing before handover.
            </p>

            <div className="pt-4 grid sm:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4">
                <div className="font-black text-[#0a1e40] text-base">🛡️ 100% Genuine Hardware</div>
                <p className="text-xs text-slate-500 mt-1">Authorized dealer products from Hikvision, CP Plus, Dell, HP, Kingston & TP-Link.</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4">
                <div className="font-black text-[#0a1e40] text-base">⚡ Rapid Response SLA</div>
                <p className="text-xs text-slate-500 mt-1">Doorstep engineers mobilized across Kolkata, Howrah, and 24 Parganas.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-black text-[#0a1e40] mb-4">Official Business Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Corporate Name</span>
                <span className="font-bold text-slate-800">{SITE_CONFIG.legalName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Registered Office</span>
                <span className="font-bold text-slate-800">{SITE_CONFIG.address.streetAddress}, Kolkata</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Helpline / Phone</span>
                <a href={`tel:${SITE_CONFIG.displayPhone}`} className="font-bold text-[#1e4a9a]">{SITE_CONFIG.displayPhone}</a>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Official Email</span>
                <a href={`mailto:${SITE_CONFIG.email}`} className="font-bold text-[#1e4a9a]">{SITE_CONFIG.email}</a>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Working Hours</span>
                <span className="font-bold text-slate-800">10:00 AM – 9:00 PM (Daily)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Coverage</span>
                <span className="font-bold text-slate-800">Kolkata & Pan-West Bengal</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3">
              <Link to="/contact" className="flex-1 py-3 text-center rounded-xl bg-[#0a1e40] text-white font-bold text-xs hover:bg-[#1e4a9a] transition">
                Contact Office
              </Link>
              <Link to="/services" className="flex-1 py-3 text-center rounded-xl bg-yellow-400 text-[#0a1e40] font-black text-xs hover:bg-yellow-300 transition">
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Silo Categories Showcase */}
      <section className="bg-white border-t border-slate-200 py-14 md:py-18">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <span className="text-xs font-black tracking-wider text-[#1e4a9a] uppercase">What We Excel At</span>
          <h2 className="text-2xl md:text-3xl font-black text-[#0a1e40] mt-1">Our Core Technology Competencies</h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((c) => (
              <Link key={c.id} to={`/services/${c.slug}`} className="p-5 rounded-2xl border border-slate-200 hover:border-[#1e4a9a] hover:shadow-md transition text-left group">
                <div className="text-3xl mb-2">{c.icon}</div>
                <div className="font-black text-[#0a1e40] group-hover:text-[#1e4a9a] transition text-sm">{c.name}</div>
                <div className="text-xs text-slate-500 mt-1 line-clamp-2">{c.heroSubheading}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
