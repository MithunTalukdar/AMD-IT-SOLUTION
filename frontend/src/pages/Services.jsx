import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import client from '../api/client';
import SiteSurveyModal from '../components/SiteSurveyModal';

const ALL_SERVICES_CATALOG = [
  // CCTV Surveillance
  {
    id: 'cctv-home-kit',
    serviceKey: 'cctv',
    category: 'cctv',
    categoryName: 'CCTV Surveillance',
    title: '2 Camera HD Home Surveillance Kit',
    price: 6499,
    originalPrice: 9999,
    badge: 'Bestseller',
    rating: '4.9 (340)',
    icon: '📹',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80',
    description: 'Complete high-definition 2-camera surveillance package with night vision, 1TB recording HDD, and live mobile monitoring.',
    features: [
      '2x 1080p HD Dome/Bullet Cameras (Hikvision / CP Plus)',
      '4-Channel HD DVR with HDMI & VGA output',
      '1TB Surveillance HDD (up to 30 days recording)',
      'Night vision up to 20m & smart motion detection',
      'Live mobile app view with remote playback',
      'Standard cabling, installation & 1 Year on-site warranty'
    ]
  },
  {
    id: 'cctv-shop-combo',
    serviceKey: 'cctv',
    category: 'cctv',
    categoryName: 'CCTV Surveillance',
    title: '4 Camera Commercial & Shop Combo',
    price: 12999,
    originalPrice: 18500,
    badge: 'Save 30%',
    rating: '4.9 (512)',
    icon: '🏪',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    description: 'Enterprise grade 4-camera solution designed for shops, warehouses, offices and residential buildings with audio recording option.',
    features: [
      '4x 2MP/5MP Full HD Weatherproof Cameras',
      '8-Channel HD DVR (Expandable to 8 cameras)',
      '2TB Seagate/WD Purple Surveillance Hard Drive',
      'Color Night Vision + Audio Recording mic',
      'Multi-user mobile app & centralized PC monitoring',
      'Full installation, conduit piping & 2 Years warranty'
    ]
  },
  {
    id: 'cctv-ip-enterprise',
    serviceKey: 'cctv',
    category: 'cctv',
    categoryName: 'CCTV Surveillance',
    title: 'IP Camera & NVR Enterprise Surveillance',
    price: 18999,
    originalPrice: 26000,
    badge: 'Enterprise',
    rating: '5.0 (180)',
    icon: '🏢',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80',
    description: 'Ultra HD 4K IP camera network with PoE switches, NVR, AI human/vehicle detection, and multi-location cloud backup.',
    features: [
      '4K Ultra HD IP PoE Cameras (Hikvision / Dahua)',
      '16-Channel 4K NVR with AI Smart Analytics',
      'PoE Gigabit Switch with surge protection',
      'AI Facial recognition & perimeter breach alerts',
      'Multi-branch cloud monitoring on single screen',
      'Free 1 Year AMC included'
    ]
  },

  // Computer & Laptop Services
  {
    id: 'laptop-service',
    serviceKey: 'computer',
    category: 'computer',
    categoryName: 'Computer & Laptop',
    title: 'Laptop Full Servicing & Deep Cleaning',
    price: 599,
    originalPrice: 1200,
    badge: 'Same Day',
    rating: '4.8 (890)',
    icon: '💻',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80',
    description: 'Complete internal cleaning, thermal paste replacement, OS optimization, virus cleanup, and comprehensive hardware health check.',
    features: [
      'Internal dust cleaning & Arctic MX-4 thermal paste renewal',
      'Fan lubrication & cooling system optimization',
      'OS tune-up, junk file clearing & virus scan',
      'Battery, SSD, RAM & motherboard diagnostics',
      'Free doorstep pickup & drop available',
      '30-day service guarantee'
    ]
  },
  {
    id: 'ssd-speed-upgrade',
    serviceKey: 'computer',
    category: 'computer',
    categoryName: 'Computer & Laptop',
    title: 'Superfast SSD & RAM Upgrade Package',
    price: 2199,
    originalPrice: 3500,
    badge: 'Popular',
    rating: '4.9 (670)',
    icon: '⚡',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80',
    description: 'Make your old laptop or desktop 10x faster with genuine NVMe/SATA SSD and high-speed RAM with OS cloning.',
    features: [
      '256GB / 512GB / 1TB Crucial / Kingston High-Speed SSD',
      'Complete OS & data cloning without data loss',
      'Boot time reduction from minutes to 8 seconds',
      'Compatible with Dell, HP, Lenovo, Asus, Acer, Apple',
      '3 to 5 Years brand replacement warranty'
    ]
  },
  {
    id: 'desktop-assemble',
    serviceKey: 'computer',
    category: 'computer',
    categoryName: 'Computer & Laptop',
    title: 'Custom PC Assembly (Office / Gaming / Editing)',
    price: 18999,
    originalPrice: 24000,
    badge: 'Custom Build',
    rating: '5.0 (240)',
    icon: '🖥️',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80',
    description: 'Custom built computers for office work, accounting (Tally), video editing, graphic design, and high-performance gaming.',
    features: [
      'Intel Core i3 / i5 / i7 or AMD Ryzen processors',
      'High speed DDR4/DDR5 RAM & NVMe SSD storage',
      'Dedicated NVIDIA GTX/RTX graphics options',
      'Genuine Windows 11 Pro + Microsoft Office setup',
      'Cable management, stress-testing & 3-year warranty'
    ]
  },
  {
    id: 'printer-repair',
    serviceKey: 'computer',
    category: 'computer',
    categoryName: 'Computer & Laptop',
    title: 'Printer Repair & Cartridge Refilling',
    price: 499,
    originalPrice: 900,
    badge: 'Affordable',
    rating: '4.7 (310)',
    icon: '🖨️',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&q=80',
    description: 'Repair for HP, Canon, Epson, Brother laser & inkjet printers. Paper jam fix, roller repair, cartridge refill & network setup.',
    features: [
      'Laser & Ink Tank printer troubleshooting',
      'Paper jam, gear noise, roller replacement',
      'High-yield genuine cartridge refilling & toner replacement',
      'Wi-Fi & network printer sharing across office',
      'Doorstep engineer visit within 2 hours'
    ]
  },

  // Networking & Wi-Fi
  {
    id: 'office-wifi-setup',
    serviceKey: 'networking',
    category: 'networking',
    categoryName: 'Networking & Wi-Fi',
    title: 'High-Speed Office Wi-Fi & Mesh Setup',
    price: 3999,
    originalPrice: 6000,
    badge: 'Business',
    rating: '4.9 (420)',
    icon: '📶',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80',
    description: 'Zero dead zone Wi-Fi 6 mesh networking for offices, cafes, showrooms and large houses. Supports 50+ concurrent devices.',
    features: [
      'Dual Band Wi-Fi 6 Routers & Access Points (TP-Link / Ubiquiti)',
      'Seamless roaming across multiple floors without disconnection',
      'Bandwidth management & guest network isolation',
      'Speed optimization for video conferencing (Zoom/Meet)',
      '1 Year network configuration & support warranty'
    ]
  },
  {
    id: 'structured-lan-cabling',
    serviceKey: 'networking',
    category: 'networking',
    categoryName: 'Networking & Wi-Fi',
    title: 'Structured LAN Cabling & Server Rack Setup',
    price: 7999,
    originalPrice: 12000,
    badge: 'Corporate',
    rating: '5.0 (195)',
    icon: '🌐',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
    description: 'Clean, labeled Cat6/Cat6A structured cabling, server rack assembly, patch panel punching, and gigabit switch installation.',
    features: [
      'D-Link / Molex / Schneider Cat6 cabling with conduit casing',
      '4U / 6U / 9U / 12U Wall mount & floor server rack setup',
      'Patch panel punching, cable numbering & port labeling',
      'Gigabit managed/unmanaged switch setup',
      'Fluke network testing for 100% packet integrity'
    ]
  },
  {
    id: 'firewall-vpn-setup',
    serviceKey: 'networking',
    category: 'networking',
    categoryName: 'Networking & Wi-Fi',
    title: 'Firewall, Router & Secure VPN Configuration',
    price: 5499,
    originalPrice: 8500,
    badge: 'Security',
    rating: '4.8 (130)',
    icon: '🔒',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80',
    description: 'Protect business data from cyber threats with Fortinet/Sophos firewall rules, load balancing dual ISPs, and site-to-site VPN.',
    features: [
      'Dual ISP Failover / Load Balancing configuration',
      'Secure Work-from-Home VPN setup for remote staff',
      'Website & social media blocking policies',
      'Intrusion prevention & anti-malware filtering',
      'Dedicated network security audit report'
    ]
  },

  // AMC Maintenance Plans
  {
    id: 'amc-basic-plan',
    serviceKey: 'amc',
    category: 'amc',
    categoryName: 'AMC Service',
    title: 'Annual AMC — Small Office / Shop Plan',
    price: 4999,
    originalPrice: 9000,
    badge: 'Best Value',
    rating: '4.9 (530)',
    icon: '🛡️',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80',
    description: 'Year-round proactive maintenance for up to 5 PCs, 1 printer, and Wi-Fi router. Never let tech downtime stop your business.',
    features: [
      '4 Scheduled preventive maintenance visits per year',
      'Unlimited remote support via AnyDesk / TeamViewer',
      'Regular OS updates, antivirus renewal & cleanup',
      '10% Flat discount on all hardware replacement parts',
      'Priority emergency engineer visit within 4 hours'
    ]
  },
  {
    id: 'amc-professional-plan',
    serviceKey: 'amc',
    category: 'amc',
    categoryName: 'AMC Service',
    title: 'Annual AMC — Corporate Pro Plan (10-30 PCs)',
    price: 9999,
    originalPrice: 16000,
    badge: 'Most Popular',
    rating: '5.0 (410)',
    icon: '🏆',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
    description: 'Comprehensive corporate maintenance covering computers, CCTV cameras, network switches, printers & biometric machines.',
    features: [
      '12 Monthly routine visits + Unlimited emergency visits',
      'Guaranteed 2-Hour response time SLA across Kolkata',
      'Full coverage of PCs, CCTV DVR, Wi-Fi & Biometric machines',
      '20% Discount on hardware parts + Free standby replacement PC',
      'Monthly network security & backup compliance report'
    ]
  },

  // Biometrics & Access Control
  {
    id: 'biometric-attendance',
    serviceKey: 'biometric',
    category: 'biometric',
    categoryName: 'Biometrics & Security',
    title: 'Biometric Attendance & Access Control System',
    price: 7500,
    originalPrice: 11000,
    badge: 'Enterprise',
    rating: '4.9 (290)',
    icon: '🔐',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80',
    description: 'Fingerprint & Face recognition attendance system with automatic payroll calculation, cloud report, and electronic magnetic door lock.',
    features: [
      'Essl / Realtime Biometric Device with Face & Fingerprint sensor',
      'Electronic Magnetic Lock (EM Lock) for glass / wooden doors',
      'Automated salary/attendance export to Excel & Tally',
      'Cloud mobile app for remote HR punch monitoring',
      'Installation, wiring & staff training included'
    ]
  }
];

const CATEGORIES = [
  { id: 'all', name: 'All Services', icon: '✨' },
  { id: 'cctv', name: 'CCTV Surveillance', icon: '📹' },
  { id: 'computer', name: 'Computer & Laptop', icon: '💻' },
  { id: 'networking', name: 'Networking & Wi-Fi', icon: '🌐' },
  { id: 'amc', name: 'AMC Maintenance', icon: '🛡️' },
  { id: 'biometric', name: 'Biometrics & Security', icon: '🔐' },
];

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

  return (
    <div className="min-h-screen bg-slate-50">
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

          {/* Categories Tab Bar */}
          <div className="mt-6 flex flex-wrap gap-2">
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
              <div
                key={s.id}
                className="bg-white rounded-[22px] border border-slate-200 overflow-hidden shadow-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header & Image */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-[#0a1e40]/90 backdrop-blur text-yellow-400 text-xs font-black px-3 py-1 rounded-full shadow">
                      {s.icon} {s.badge}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full shadow">
                      ⭐ {s.rating}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur text-[#0a1e40] text-xs font-black px-3 py-1 rounded-full shadow">
                      {s.categoryName}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <h3 className="font-black text-lg text-[#0a1e40] leading-tight line-clamp-2">
                      {s.title}
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
                      to={`/booking?service=${s.id || s.slug || s.serviceKey}`}
                      className="flex-1 py-3 text-center rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-[#0a1e40] font-black text-xs md:text-sm shadow-md hover:scale-[1.02] active:scale-95 transition"
                    >
                      Book Now →
                    </Link>
                    <button
                      onClick={() => setSelectedServiceForModal(s)}
                      className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100 transition"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
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
                href="tel:9635006403"
                className="py-3 px-6 rounded-full bg-yellow-400 text-[#0a1e40] font-black text-center shadow-lg hover:bg-yellow-300 transition"
              >
                📞 Call Expert: 9635006403
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
                alt={selectedServiceForModal.title}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              {selectedServiceForModal.description}
            </p>

            <div className="mt-5">
              <h4 className="text-sm font-black text-[#0a1e40] uppercase tracking-wider mb-2">
                What's Included in this Service:
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
                <button
                  onClick={() => setSelectedServiceForModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs"
                >
                  Close
                </button>
                <Link
                  to={`/booking?service=${selectedServiceForModal.id || selectedServiceForModal.slug || selectedServiceForModal.serviceKey}`}
                  onClick={() => setSelectedServiceForModal(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#0a1e40] text-white font-black text-xs hover:bg-[#1e4a9a] transition shadow"
                >
                  Book This Service →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
