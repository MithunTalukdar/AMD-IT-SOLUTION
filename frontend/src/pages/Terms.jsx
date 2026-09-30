import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { SITE_CONFIG } from '../data/servicesData';

export default function Terms() {
  const breadcrumbs = [{ name: 'Terms of Service', url: '/terms' }];

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Terms of Service | AMD IT SOLUTION Kolkata"
        description="Terms and conditions for on-site IT repairs, CCTV installations, warranty coverage, and Annual Maintenance Contracts with AMD IT SOLUTION."
        canonicalPath="/terms"
        keywords="terms of service AMD IT SOLUTION, IT repair terms, CCTV warranty conditions"
        breadcrumbs={breadcrumbs}
      />

      <Breadcrumb items={breadcrumbs} />

      <section className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-6 text-slate-700 text-sm md:text-base leading-relaxed">
          <h1 className="text-2xl md:text-3xl font-black text-[#0a1e40] border-b border-slate-200 pb-4">
            Terms of Service
          </h1>

          <p className="text-xs text-slate-400">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <p>
            Welcome to <strong>{SITE_CONFIG.legalName}</strong>. By booking a technician, purchasing hardware, or engaging our AMC contracts, you agree to comply with and be bound by the following terms and conditions.
          </p>

          <h2 className="text-lg font-bold text-[#0a1e40]">1. Service Scope & Execution</h2>
          <p>
            Our technicians perform on-site diagnosis, repair, network cabling, CCTV camera installation, and software configuration. While we take every measure to safeguard customer data during repairs, customers are encouraged to back up critical files prior to major motherboard repairs or operating system reinstallation.
          </p>

          <h2 className="text-lg font-bold text-[#0a1e40]">2. Hardware Warranty Terms</h2>
          <p>
            Brand replacement warranties (such as Hikvision CCTV cameras, Seagate/WD Hard Drives, Crucial/Kingston SSDs) are honored according to manufacturer guidelines. Our workmanship guarantee covers installation defects for 30 to 90 days from the service date.
          </p>

          <h2 className="text-lg font-bold text-[#0a1e40]">3. Payment & Invoicing</h2>
          <p>
            Standard service fees and hardware costs are payable upon job completion and testing. GST tax invoices are provided for all transactions. Annual Maintenance Contracts (AMC) follow the payment schedule agreed upon in the signed corporate SLA.
          </p>

          <h2 className="text-lg font-bold text-[#0a1e40]">4. Jurisdiction</h2>
          <p>
            Any disputes arising in connection with services rendered shall be subject to the exclusive jurisdiction of the courts located in Kolkata, West Bengal, India.
          </p>
        </div>
      </section>
    </div>
  );
}
