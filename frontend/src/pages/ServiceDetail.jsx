import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import SiteSurveyModal from '../components/SiteSurveyModal';
import {
  ALL_SERVICES_CATALOG,
  FAQS_LIST,
  getServiceBySlug,
  getCategoryById,
  getServicesByCategory,
  SITE_CONFIG,
} from '../data/servicesData';

export default function ServiceDetail() {
  const { category, slug } = useParams();
  const targetSlug = slug || category;
  const service = getServiceBySlug(targetSlug);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);

  // If service does not exist in catalog, redirect to services index
  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const categoryData = getCategoryById(service.category);
  const relatedServices = getServicesByCategory(service.category).filter(
    (s) => s.slug !== service.slug
  );

  const breadcrumbs = [
    { name: 'All Services', url: '/services' },
    {
      name: categoryData?.name || service.categoryName,
      url: `/services/${service.category}`,
    },
    {
      name: service.title,
      url: `/services/${service.category}/${service.slug}`,
    },
  ];

  // Service Schema (Schema.org)
  const serviceSchema = {
    '@type': 'Service',
    '@id': `${SITE_CONFIG.domain}/services/${service.category}/${service.slug}#service`,
    name: service.title,
    serviceType: service.categoryName,
    description: service.description,
    image: service.image,
    provider: {
      '@id': `${SITE_CONFIG.domain}/#organization`,
    },
    areaServed: [
      { '@type': 'City', name: 'Kolkata' },
      { '@type': 'City', name: 'Howrah' },
      { '@type': 'AdministrativeArea', name: 'West Bengal' },
    ],
    offers: {
      '@type': 'Offer',
      price: String(service.price),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `${SITE_CONFIG.domain}/services/${service.category}/${service.slug}`,
      priceValidUntil: '2027-12-31',
      seller: {
        '@id': `${SITE_CONFIG.domain}/#organization`,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(service.ratingVal || 4.9),
      reviewCount: String(service.reviewCount || 340),
      bestRating: '5',
      worstRating: '1',
    },
  };

  const serviceFaqs = FAQS_LIST.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title={service.metaTitle}
        description={service.metaDescription}
        canonicalPath={`/services/${service.category}/${service.slug}`}
        keywords={`${service.title} Kolkata, ${service.categoryName}, IT service Kolkata, doorstep service`}
        ogType="article"
        ogImage={service.image}
        ogImageAlt={`${service.title} in Kolkata`}
        breadcrumbs={breadcrumbs}
        serviceSchema={serviceSchema}
        faqSchema={serviceFaqs}
      />

      <Breadcrumb items={breadcrumbs} />

      {/* Main Service Presentation */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Imagery & Visual Trust Badges */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-[24px] overflow-hidden border border-slate-200 shadow-xl bg-white relative">
              <img
                src={service.image}
                alt={`${service.title} - Professional Installation in Kolkata`}
                width="800"
                height="500"
                decoding="async"
                fetchPriority="high"
                className="w-full h-[320px] md:h-[440px] object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#0a1e40]/90 backdrop-blur text-yellow-400 text-xs font-black px-3 py-1.5 rounded-full shadow">
                {service.icon} {service.badge}
              </div>
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow">
                ⭐ {service.rating}
              </div>
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
                <div className="text-lg">🛡️</div>
                <div className="text-xs font-black text-[#0a1e40] mt-1">{service.warranty}</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
                <div className="text-lg">⚡</div>
                <div className="text-xs font-black text-[#0a1e40] mt-1">{service.deliveryTime}</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
                <div className="text-lg">📍</div>
                <div className="text-xs font-black text-[#0a1e40] mt-1">Doorstep Visit</div>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Pricing, Features & Booking Action */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-[#1e4a9a] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              <Link to={`/services/${service.category}`} className="hover:underline">
                {service.categoryName} Silo
              </Link>
            </div>

            <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-black text-[#0a1e40] leading-tight">
              {service.title}
            </h1>

            <p className="mt-3 text-sm md:text-base text-slate-600 leading-relaxed">
              {service.description}
            </p>

            {/* Price Box */}
            <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                  Turnkey Package Price
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl font-black text-[#0a1e40]">
                    ₹{service.price.toLocaleString()}
                  </span>
                  {service.originalPrice && (
                    <>
                      <span className="text-base line-through text-slate-400">
                        ₹{service.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Save ₹{(service.originalPrice - service.price).toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                <Link
                  to={`/booking?service=${service.slug}`}
                  className="px-7 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0a1e40] font-black text-sm text-center shadow-lg hover:scale-105 transition"
                >
                  Book Service Now →
                </Link>
                <a
                  href={`tel:${SITE_CONFIG.displayPhone}`}
                  className="px-5 py-3 rounded-full border border-slate-300 bg-white text-[#0a1e40] font-bold text-sm text-center hover:bg-slate-50 transition"
                >
                  📞 Call: {SITE_CONFIG.displayPhone}
                </a>
              </div>
            </div>

            {/* Included Features */}
            <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-black text-[#0a1e40] uppercase tracking-wider mb-3">
                What&apos;s Included in this Turnkey Package:
              </h2>
              <ul className="space-y-2.5">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-xs font-black shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Detailed summary */}
            {service.detailedSummary && (
              <div className="mt-6 p-5 rounded-2xl bg-blue-50/60 border border-blue-100 text-slate-700 text-sm leading-relaxed">
                <h3 className="font-bold text-[#0a1e40] mb-1">Architecture & Deployment Details:</h3>
                <p>{service.detailedSummary}</p>
                <div className="mt-3 text-xs text-slate-500 font-semibold">
                  <span>Targeted Application: {service.idealFor}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Silo Internal Linking: Other services in same category */}
      {relatedServices.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 border-t border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-black tracking-wider text-[#1e4a9a] uppercase">
                Within Same Silo
              </span>
              <h2 className="text-xl md:text-2xl font-black text-[#0a1e40]">
                More {service.categoryName} Options
              </h2>
            </div>
            <Link
              to={`/services/${service.category}`}
              className="text-xs md:text-sm font-bold text-[#1e4a9a] hover:underline"
            >
              View All {service.categoryName} →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedServices.map((rel) => (
              <article
                key={rel.slug}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden p-4 shadow-sm hover:shadow-md hover:border-[#1e4a9a] transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 rounded-xl overflow-hidden mb-3">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      loading="lazy"
                      decoding="async"
                      width="400"
                      height="250"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 bg-[#0a1e40] text-yellow-400 text-[11px] font-black px-2 py-0.5 rounded-full">
                      ₹{rel.price.toLocaleString()}
                    </span>
                  </div>
                  <h3 className="font-black text-[#0a1e40] text-base leading-snug">
                    <Link
                      to={`/services/${rel.category}/${rel.slug}`}
                      className="hover:text-[#1e4a9a] transition"
                    >
                      {rel.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {rel.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/services/${rel.category}/${rel.slug}`}
                    className="text-xs font-bold text-[#1e4a9a] hover:underline"
                  >
                    View Specs →
                  </Link>
                  <Link
                    to={`/booking?service=${rel.slug}`}
                    className="px-3.5 py-1.5 rounded-full bg-[#0a1e40] text-yellow-400 font-black text-xs hover:bg-[#1e4a9a] transition"
                  >
                    Book Now
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Silo FAQ Section */}
      <section className="bg-white border-t border-slate-200 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-[#0a1e40]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Have questions about booking or installation in Kolkata?
            </p>
          </div>

          <div className="space-y-3">
            {serviceFaqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-sm">
                  {faq.q}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteSurveyModal
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
        defaultService={service.category}
      />
    </div>
  );
}
