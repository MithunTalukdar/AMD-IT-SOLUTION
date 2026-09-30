import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { SITE_CONFIG } from '../data/servicesData';

export default function PrivacyPolicy() {
  const breadcrumbs = [{ name: 'Privacy Policy', url: '/privacy-policy' }];

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Privacy Policy | AMD IT SOLUTION Kolkata"
        description="Privacy policy and data protection standards for AMD IT SOLUTION customers, website visitors, and service booking users."
        canonicalPath="/privacy-policy"
        keywords="privacy policy AMD IT SOLUTION, data privacy, terms of data use"
        breadcrumbs={breadcrumbs}
      />

      <Breadcrumb items={breadcrumbs} />

      <section className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-6 text-slate-700 text-sm md:text-base leading-relaxed">
          <h1 className="text-2xl md:text-3xl font-black text-[#0a1e40] border-b border-slate-200 pb-4">
            Privacy Policy
          </h1>

          <p className="text-xs text-slate-400">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <p>
            At <strong>{SITE_CONFIG.legalName}</strong> (also accessible via {SITE_CONFIG.domain}), one of our main priorities is the privacy of our visitors and service clients. This Privacy Policy document contains types of information that is collected and recorded by us and how we use it.
          </p>

          <h2 className="text-lg font-bold text-[#0a1e40]">1. Information We Collect</h2>
          <p>
            When you book an on-site service, request a quote, or register an account, we may collect personal information including your full name, phone number, email address, physical service address, and specific hardware or CCTV configuration preferences.
          </p>

          <h2 className="text-lg font-bold text-[#0a1e40]">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm">
            <li>To dispatch certified technicians directly to your specified address.</li>
            <li>To generate official GST tax invoices and record hardware warranty terms.</li>
            <li>To provide timely booking status updates via SMS, Phone call, or WhatsApp.</li>
            <li>To maintain our service history and uphold customer support SLAs.</li>
          </ul>

          <h2 className="text-lg font-bold text-[#0a1e40]">3. Data Security & Storage</h2>
          <p>
            We implement industry-standard encryption protocols (including HTTPS/TLS and bcrypt password hashing). We never sell, lease, or monetize your personal information to third-party marketing companies.
          </p>

          <h2 className="text-lg font-bold text-[#0a1e40]">4. Contact Us Concerning Privacy</h2>
          <p>
            If you have questions regarding this Privacy Policy, please contact our data officer at:
            <br />
            <strong>Email:</strong> <a href={`mailto:${SITE_CONFIG.email}`} className="text-[#1e4a9a] underline">{SITE_CONFIG.email}</a>
            <br />
            <strong>Phone:</strong> {SITE_CONFIG.phone}
            <br />
            <strong>Address:</strong> {SITE_CONFIG.address.streetAddress}, Kolkata – {SITE_CONFIG.address.postalCode}, West Bengal, India.
          </p>
        </div>
      </section>
    </div>
  );
}
