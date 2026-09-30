import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import SiteSurveyModal from '../components/SiteSurveyModal';
import {
  CATEGORIES,
  ALL_SERVICES_CATALOG,
  FAQS_LIST,
  getCategoryById,
  getServicesByCategory,
  SITE_CONFIG,
} from '../data/servicesData';

export default function CategorySilo() {
  const { category } = useParams();
  const catData = getCategoryById(category);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);

  // If invalid category slug, redirect cleanly to /services
  if (!catData) {
    return <Navigate to="/services" replace />;
  }

  const categoryServices = getServicesByCategory(catData.id);
  const otherCategories = CATEGORIES.filter((c) => c.id !== catData.id);

  const breadcrumbs = [
    { name: 'All Services', url: '/services' },
    { name: catData.name, url: `/services/${catData.slug}` },
  ];

  const categoryFaqs = FAQS_LIST.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title={catData.metaTitle}
        description={catData.metaDescription}
        canonicalPath={`/services/${catData.slug}`}
        keywords={`${catData.name} Kolkata, ${catData.name} installation, ${catData.name} repair West Bengal`}
        breadcrumbs={breadcrumbs}
        faqSchema={categoryFaqs}
      />

      <Breadcrumb items={breadcrumbs} />

      {/* Silo Hero Header */}
      <section className="bg-gradient-to-br from-[#0a1e40] via-[#0f2f6b] to-[#1e4a9a] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-3.5 py-1 text-xs font-semibold text-yellow-300">
              <span>{catData.icon}</span>
              <span>Official Category Silo • Kolkata & Pan-Bengal</span>
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {catData.h1}
            </h1>

            <p className="mt-4 text-slate-200 text-sm md:text-base leading-relaxed">
              {catData.heroSubheading}
            </p>

            {/* Value checklist */}
            <div className="mt-6 grid sm:grid-cols-2 gap-2.5">
              {catData.benefits.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs md:text-sm text-yellow-200">
                  <span className="w-5 h-5 rounded-full bg-yellow-400 text-[#0a1e40] grid place-items-center text-xs font-black shrink-0">
                    ✓
                  </span>
                  <span>{b}</span>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => setIsSurveyOpen(true)}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0a1e40] font-black text-sm shadow-lg hover:scale-105 transition"
              >
                Request Free Site Survey →
              </button>
              <a
                href={`tel:${SITE_CONFIG.displayPhone}`}
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white hover:text-[#0a1e40] text-white font-bold text-sm border border-white/20 backdrop-blur transition flex items-center gap-2"
              >
                <span>📞</span>
                <span>Call Expert: {SITE_CONFIG.displayPhone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid within this Silo */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black tracking-wider text-[#1e4a9a] uppercase">
              Targeted Solutions
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[#0a1e40]">
              Available {catData.name} Packages
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Select a specialized plan below for detailed specifications, pricing, and doorstep booking.
            </p>
          </div>
          <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
            ⚡ Guaranteed Same-Day or 24-Hr Doorstep Execution
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryServices.map((service) => (
            <article
              key={service.slug}
              className="bg-white rounded-[22px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={`${service.title} in Kolkata`}
                    loading="lazy"
                    decoding="async"
                    width="600"
                    height="400"
                    className="w-full h-full object-cover hover:scale-105 transition duration-700"
                  />
                  <span className="absolute top-3 left-3 bg-[#0a1e40]/90 backdrop-blur text-yellow-400 text-xs font-black px-3 py-1 rounded-full shadow">
                    {service.icon} {service.badge}
                  </span>
                  <span className="absolute top-3 right-3 bg-white/95 backdrop-blur text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full shadow">
                    ⭐ {service.rating}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-black text-lg text-[#0a1e40] leading-snug">
                    <Link
                      to={`/services/${catData.slug}/${service.slug}`}
                      className="hover:text-[#1e4a9a] transition"
                    >
                      {service.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                    {service.features.slice(0, 4).map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-[10px] shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span className="line-clamp-1">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-2 bg-slate-50/50">
                <div className="flex items-end justify-between mb-4 pt-3">
                  <div>
                    <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
                      Starting Price
                    </span>
                    <span className="text-xl font-black text-[#0a1e40]">
                      ₹{service.price.toLocaleString()}
                    </span>
                  </div>
                  {service.originalPrice && (
                    <div className="text-right">
                      <span className="text-xs line-through text-slate-400 block">
                        ₹{service.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-black text-emerald-600">
                        Save {Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/services/${catData.slug}/${service.slug}`}
                    className="flex-1 py-2.5 text-center rounded-xl bg-white border border-slate-200 text-[#0a1e40] font-bold text-xs hover:border-[#1e4a9a] transition"
                  >
                    View Details →
                  </Link>
                  <Link
                    to={`/booking?service=${service.slug}`}
                    className="flex-1 py-2.5 text-center rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0a1e40] font-black text-xs shadow hover:scale-105 transition"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ Section specific to this Silo */}
      <section className="bg-white border-y border-slate-200 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <span className="text-xs font-black tracking-wider text-[#1e4a9a] uppercase">
              Got Questions?
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[#0a1e40] mt-1">
              Frequently Asked Questions About {catData.name}
            </h2>
          </div>

          <div className="space-y-4">
            {categoryFaqs.map((faq, index) => (
              <div key={index} className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
                  <span className="text-amber-500 font-black">Q:</span>
                  {faq.q}
                </h3>
                <p className="mt-2 text-xs md:text-sm text-slate-600 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-Silo Internal Linking Architecture */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-black tracking-wider text-[#1e4a9a] uppercase">
            Topical Hierarchy
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#0a1e40]">
            Explore Related IT Services
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Seamlessly combine our IT infrastructure, CCTV, hardware maintenance, and networking services.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {otherCategories.map((c) => (
            <Link
              key={c.id}
              to={`/services/${c.slug}`}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#1e4a9a] hover:-translate-y-0.5 transition block group"
            >
              <div className="text-2xl mb-2">{c.icon}</div>
              <h3 className="font-black text-[#0a1e40] group-hover:text-[#1e4a9a] transition text-base">
                {c.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {c.heroSubheading}
              </p>
              <span className="mt-3 inline-flex items-center text-xs font-bold text-[#1e4a9a] group-hover:underline">
                Explore {c.name} Silo →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <SiteSurveyModal
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
        defaultService={catData.id}
      />
    </div>
  );
}
