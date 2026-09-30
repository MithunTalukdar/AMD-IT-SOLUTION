import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SiteSurveyModal from '../components/SiteSurveyModal';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import {
  ALL_SERVICES_CATALOG,
  CATEGORIES,
  FAQS_LIST,
  SITE_CONFIG,
} from '../data/servicesData';

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceForModal, setSelectedServiceForModal] = useState(null);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);

  // Sync category param when clicked
  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  const filteredServices = useMemo(() => {
    return ALL_SERVICES_CATALOG.filter((item) => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const breadcrumbs = [{ name: 'Services Directory', url: '/services' }];

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="All IT Services & CCTV Solutions Kolkata | AMD IT"
        description="Explore complete IT & security services in Kolkata. CCTV kits, laptop repair, Wi-Fi mesh, Cat6 LAN & corporate AMC. Transparent pricing with warranty."
        canonicalPath="/services"
        keywords="IT services catalog Kolkata, CCTV camera prices, laptop repair costs, networking services, AMC pricing Kolkata"
        breadcrumbs={breadcrumbs}
        faqSchema={FAQS_LIST.slice(0, 4)}
      />

      <Breadcrumb items={breadcrumbs} />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#0a1e40] via-[#0f2f6b] to-[#1e4a9a] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-3 py-1 text-xs font-semibold text-yellow-300">
              ⚡ Certified Engineers • Same Day Doorstep Service
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              All IT & Surveillance <span className="text-yellow-400">Services</span>
            </h1>
            <p className="mt-3 text-slate-200 text-sm md:text-base leading-relaxed">
              Explore our complete range of professional technology solutions for homes, retail shops, offices, and enterprises across Kolkata & Pan-West Bengal.
            </p>
          </div>

          {/* Search bar */}
          <div className="mt-8 max-w-2xl bg-white rounded-2xl shadow-xl p-2 flex items-center gap-2 border border-slate-200">
            <span className="text-slate-400 pl-3 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Search services (e.g., CCTV 4 camera, Laptop repair, Wi-Fi setup, AMC)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-slate-800 text-sm md:text-base font-medium placeholder-slate-400 focus:outline-none bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-xl font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Silo Categories Tab Bar with Direct Semantic Links */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all shadow-sm ${
                activeCategory === 'all'
                  ? 'bg-yellow-400 text-[#0a1e40] shadow-[0_4px_14px_rgba(250,204,21,0.4)] scale-105'
                  : 'bg-white/15 text-white hover:bg-white/25 border border-white/10'
              }`}
            >
              <span>✨</span>
              <span>All Services</span>
            </button>
            {CATEGORIES.map((c) => {
              const isActive = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => handleCategoryChange(c.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all shadow-sm ${
                    isActive
                      ? 'bg-yellow-400 text-[#0a1e40] shadow-[0_4px_14px_rgba(250,204,21,0.4)] scale-105'
                      : 'bg-white/15 text-white hover:bg-white/25 border border-white/10'
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#0a1e40]">
              {activeCategory === 'all'
                ? 'All Available Services'
                : CATEGORIES.find((c) => c.id === activeCategory)?.name}
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Showing {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} ready to book
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeCategory !== 'all' && (
              <Link
                to={`/services/${activeCategory}`}
                className="text-xs font-bold text-[#1e4a9a] hover:underline bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200"
              >
                View Dedicated {CATEGORIES.find((c) => c.id === activeCategory)?.name} Silo Hub →
              </Link>
            )}
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              ✓ 100% Genuine Hardware & Warranty
            </span>
          </div>
        </div>

        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-[24px] border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-black text-[#0a1e40]">No services found</h3>
            <p className="text-sm text-slate-500 mt-1">
              Try searching with a different keyword or reset filters.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2.5 bg-[#0a1e40] text-white rounded-full text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((s) => (
              <article
                key={s.id}
                className="bg-white rounded-[22px] border border-slate-200 overflow-hidden shadow-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header & Image */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={s.image}
                      alt={`${s.title} in Kolkata`}
                      loading="lazy"
                      decoding="async"
                      width="600"
                      height="400"
                      className="w-full h-full object-cover hover:scale-105 transition duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-[#0a1e40]/90 backdrop-blur text-yellow-400 text-xs font-black px-3 py-1 rounded-full shadow">
                      {s.icon} {s.badge}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full shadow">
                      ⭐ {s.rating}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur text-[#0a1e40] text-xs font-black px-3 py-1 rounded-full shadow">
                      <Link to={`/services/${s.category}`} className="hover:underline">
                        {s.categoryName}
                      </Link>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <h3 className="font-black text-lg text-[#0a1e40] leading-tight line-clamp-2">
                      <Link
                        to={`/services/${s.category}/${s.slug || s.id}`}
                        className="hover:text-[#1e4a9a] transition"
                      >
                        {s.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {s.description}
                    </p>

                    {/* Features checklist */}
                    <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                      {s.features.slice(0, 4).map((f, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-[10px] shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span className="line-clamp-1">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer & Action Buttons */}
                <div className="p-5 pt-0 border-t border-slate-100 mt-2 bg-slate-50/50">
                  <div className="flex items-end justify-between mb-4 pt-3">
                    <div>
                      <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Starting from</div>
                      <div className="text-xl font-black text-[#0a1e40]">₹{s.price.toLocaleString()}</div>
                    </div>
                    {s.originalPrice && (
                      <div className="text-right">
                        <div className="text-xs line-through text-slate-400">₹{s.originalPrice.toLocaleString()}</div>
                        <div className="text-[11px] font-black text-emerald-600">Save {Math.round(((s.originalPrice - s.price) / s.originalPrice) * 100)}%</div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/services/${s.category}/${s.slug || s.id}`}
                      className="px-3.5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:border-[#1e4a9a] text-center transition"
                    >
                      Specs
                    </Link>
                    <Link
                      to={`/booking?service=${s.id || s.slug || s.serviceKey}`}
                      className="flex-1 py-3 text-center rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0a1e40] font-black text-xs md:text-sm shadow-md hover:scale-[1.02] active:scale-95 transition"
                    >
                      Book Now →
                    </Link>
                    <button
                      onClick={() => setSelectedServiceForModal(s)}
                      className="px-3.5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100 transition"
                      aria-label={`View quick summary for ${s.title}`}
                    >
                      ℹ️
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Why ADM TECHNO SOLUTION Banner */}
        <div className="mt-14 bg-gradient-to-r from-[#0a1e40] to-[#1e4a9a] rounded-[24px] p-6 md:p-10 text-white shadow-xl">
          <div className="grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8">
              <span className="bg-yellow-400 text-[#0a1e40] font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                Need a Custom Requirement?
              </span>
              <h3 className="mt-3 text-2xl md:text-3xl font-black">
                Tailored IT & Security Solutions For Any Scale
              </h3>
              <p className="mt-2 text-sm text-slate-200 max-w-xl">
                Whether you need a multi-site CCTV setup, structured cabling for an entire building, or enterprise AMC with dedicated on-site technicians, our engineers are ready.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-slate-200">
                <span>✓ Free Site Survey</span>
                <span>✓ GST Invoicing</span>
                <span>✓ Verified Engineers</span>
                <span>✓ 2-Hour Response SLA</span>
              </div>
            </div>
            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3">
              <a
                href={`tel:${SITE_CONFIG.displayPhone}`}
                className="py-3 px-6 rounded-full bg-yellow-400 text-[#0a1e40] font-black text-center shadow-lg hover:bg-yellow-300 transition"
              >
                📞 Call Expert: {SITE_CONFIG.displayPhone}
              </a>
              <button
                type="button"
                onClick={() => setIsSurveyOpen(true)}
                className="py-3 px-6 rounded-full bg-white text-[#0a1e40] font-black text-center shadow-lg hover:bg-yellow-400 transition"
              >
                Request Free Site Survey →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Free Site Survey Modal */}
      <SiteSurveyModal
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
        defaultService={activeCategory === 'all' ? 'cctv' : activeCategory}
      />

      {/* Quick Details Modal */}
      {selectedServiceForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[24px] max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 relative">
            <button
              onClick={() => setSelectedServiceForModal(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black grid place-items-center text-sm transition"
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-blue-50 text-2xl grid place-items-center">
                {selectedServiceForModal.icon}
              </span>
              <div>
                <span className="text-xs font-black uppercase text-[#1e4a9a] tracking-wider">
                  {selectedServiceForModal.categoryName}
                </span>
                <h3 className="text-xl font-black text-[#0a1e40]">
                  {selectedServiceForModal.title}
                </h3>
              </div>
            </div>

            <div className="mt-4 rounded-xl overflow-hidden h-44 bg-slate-100">
              <img
                src={selectedServiceForModal.image}
                alt={`${selectedServiceForModal.title} overview`}
                width="600"
                height="350"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>

            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              {selectedServiceForModal.description}
            </p>

            <div className="mt-5">
              <h4 className="text-sm font-black text-[#0a1e40] uppercase tracking-wider mb-2">
                What&apos;s Included in this Service:
              </h4>
              <ul className="space-y-2">
                {selectedServiceForModal.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-[10px] shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">Service Price</div>
                <div className="text-2xl font-black text-[#0a1e40]">
                  ₹{selectedServiceForModal.price.toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/services/${selectedServiceForModal.category}/${selectedServiceForModal.slug || selectedServiceForModal.id}`}
                  onClick={() => setSelectedServiceForModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs hover:border-[#1e4a9a]"
                >
                  Full Page Specs →
                </Link>
                <Link
                  to={`/booking?service=${selectedServiceForModal.id || selectedServiceForModal.slug || selectedServiceForModal.serviceKey}`}
                  onClick={() => setSelectedServiceForModal(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#0a1e40] text-white font-black text-xs hover:bg-[#1e4a9a] transition shadow"
                >
                  Book Service Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
