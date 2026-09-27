import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuickBooking() {
  const navigate = useNavigate();
  const [service, setService] = useState('cctv');
  const [location, setLocation] = useState('Kolkata');
  const [date, setDate] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (service) params.set('service', service);
    if (date) params.set('date', date);
    if (phone) params.set('phone', phone);
    if (location) params.set('city', location);
    navigate(`/booking?${params.toString()}`);
  };

  return (
    <section id="quick-book" className="relative -mt-6 md:-mt-10 px-4 md:px-6 z-20">
      <div className="max-w-7xl mx-auto bg-white rounded-[20px] md:rounded-[24px] shadow-[0_20px_60px_rgba(15,47,107,0.18)] border border-slate-200 p-4 md:p-6 lg:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg md:text-xl font-black text-[#0a1e40] flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-yellow-400 grid place-items-center text-sm">⚡</span>
            Quick Book a Service
          </h2>
          <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-bold">No advance payment — Pay after service</span>
        </div>

        <form className="grid md:grid-cols-12 gap-3 md:gap-4 items-end" onSubmit={handleSubmit}>
          <div className="md:col-span-3">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Select Service</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1e4a9a] focus:border-transparent"
            >
              <option value="cctv">CCTV Installation & Repair</option>
              <option value="computer">Computer / Laptop Repair</option>
              <option value="networking">Networking & Wi-Fi Setup</option>
              <option value="amc">AMC Annual Maintenance</option>
              <option value="biometric">Biometric & Access Control</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Your Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1e4a9a]"
            >
              <option value="Kolkata">Kolkata</option>
              <option value="Howrah">Howrah</option>
              <option value="Salt Lake">Salt Lake</option>
              <option value="New Town">New Town</option>
              <option value="Barasat">Barasat</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Date</label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1e4a9a]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Phone Number</label>
            <input
              type="tel"
              placeholder="Enter mobile"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1e4a9a]"
            />
          </div>

          <div className="md:col-span-3 flex gap-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#0a1e40] text-white font-black shadow-lg hover:bg-[#1e4a9a] transition active:scale-95"
            >
              Book Selected Service →
            </button>
          </div>
        </form>

        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="bg-slate-100 rounded-full px-3 py-1">✓ Free site visit</span>
          <span className="bg-slate-100 rounded-full px-3 py-1">✓ 2 hrs response</span>
          <span className="bg-slate-100 rounded-full px-3 py-1">✓ Verified technicians</span>
          <span className="bg-slate-100 rounded-full px-3 py-1">✓ Warranty included</span>
        </div>
      </div>
    </section>
  );
}
