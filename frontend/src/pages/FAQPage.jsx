import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { FAQS_LIST, SITE_CONFIG } from '../data/servicesData';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);
  const [search, setSearch] = useState('');

  const breadcrumbs = [{ name: 'Frequently Asked Questions', url: '/faq' }];

  const filteredFaqs = FAQS_LIST.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="IT & CCTV Service FAQs | AMD IT SOLUTION Kolkata"
        description="Frequently asked questions about CCTV camera setups, computer repairs, warranty policies, AMC pricing, and doorstep technician visits in Kolkata."
        canonicalPath="/faq"
        keywords="CCTV FAQ Kolkata, computer repair questions, IT AMC cost Kolkata, laptop repair warranty"
        breadcrumbs={breadcrumbs}
        faqSchema={FAQS_LIST}
      />

      <Breadcrumb items={breadcrumbs} />

      <section className="bg-gradient-to-br from-[#0a1e40] via-[#0f2f6b] to-[#1e4a9a] text-white py-12 md:py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <span className="inline-block bg-white/15 backdrop-blur border border-white/20 text-yellow-300 font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider">
            Knowledge Base & Answers
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Frequently Asked <span className="text-yellow-400">Questions</span>
          </h1>
          <p className="mt-3 text-slate-200 text-sm md:text-base max-w-xl mx-auto">
            Everything you need to know about our doorstep IT services, CCTV camera packages, hardware warranties, and AMC agreements in Kolkata.
          </p>

          {/* Quick Search */}
          <div className="mt-6 max-w-lg mx-auto bg-white rounded-2xl p-2 flex items-center shadow-lg border border-slate-200">
            <span className="pl-3 text-slate-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Search questions (e.g. warranty, AMC, mobile view)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
            />
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
              <p className="text-slate-600 font-bold">No questions matched your search query.</p>
              <button
                onClick={() => setSearch('')}
                className="mt-3 px-4 py-2 rounded-xl bg-[#0a1e40] text-white text-xs font-bold"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className={`border rounded-2xl transition-all ${
                    isOpen ? 'border-[#1e4a9a] bg-white shadow-md' : 'border-slate-200 bg-white shadow-sm'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-bold text-sm md:text-base text-[#0a1e40] pr-4">
                      {faq.q}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full grid place-items-center font-black text-sm shrink-0 transition ${
                        isOpen ? 'bg-[#0a1e40] text-yellow-400' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100 mt-2">
                      <p className="pt-3">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-12 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 text-center shadow-sm">
          <h2 className="text-xl font-black text-[#0a1e40]">Still Have a Question?</h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Our certified technical engineers are ready to answer your inquiries and provide free quotes.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a
              href={`tel:${SITE_CONFIG.displayPhone}`}
              className="px-6 py-2.5 rounded-full bg-[#0a1e40] text-white font-bold text-xs md:text-sm shadow"
            >
              📞 Call: {SITE_CONFIG.displayPhone}
            </a>
            <Link
              to="/contact"
              className="px-6 py-2.5 rounded-full bg-yellow-400 text-[#0a1e40] font-black text-xs md:text-sm shadow"
            >
              Online Contact Form →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
