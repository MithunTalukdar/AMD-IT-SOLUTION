import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Service from './models/Service.js';

const SEED_SERVICES = [
  {
    title: '2 Camera HD Home Surveillance Kit',
    slug: 'cctv-home-kit',
    category: 'cctv',
    price: 6499,
    oldPrice: 9999,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80',
    description: 'Complete high-definition 2-camera surveillance package with night vision, 1TB recording HDD, and live mobile monitoring.',
    features: [
      '2x 1080p HD Dome/Bullet Cameras (Hikvision / CP Plus)',
      '4-Channel HD DVR with HDMI & VGA output',
      '1TB Surveillance HDD (up to 30 days recording)',
      'Night vision up to 20m & smart motion detection',
      'Live mobile app view with remote playback',
      'Standard cabling, installation & 1 Year on-site warranty',
    ],
    isActive: true,
  },
  {
    title: '4 Camera Commercial & Shop Combo',
    slug: 'cctv-shop-combo',
    category: 'cctv',
    price: 12999,
    oldPrice: 18500,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    description: 'Enterprise grade 4-camera solution designed for shops, warehouses, offices and residential buildings with audio recording option.',
    features: [
      '4x 2MP/5MP Full HD Weatherproof Cameras',
      '8-Channel HD DVR (Expandable to 8 cameras)',
      '2TB Seagate/WD Purple Surveillance Hard Drive',
      'Color Night Vision + Audio Recording mic',
      'Multi-user mobile app & centralized PC monitoring',
      'Full installation, conduit piping & 2 Years warranty',
    ],
    isActive: true,
  },
  {
    title: 'IP Camera & NVR Enterprise Surveillance',
    slug: 'cctv-ip-enterprise',
    category: 'cctv',
    price: 18999,
    oldPrice: 26000,
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80',
    description: 'Ultra HD 4K IP camera network with PoE switches, NVR, AI human/vehicle detection, and multi-location cloud backup.',
    features: [
      '4K Ultra HD IP PoE Cameras (Hikvision / Dahua)',
      '16-Channel 4K NVR with AI Smart Analytics',
      'PoE Gigabit Switch with surge protection',
      'AI Facial recognition & perimeter breach alerts',
      'Multi-branch cloud monitoring on single screen',
      'Free 1 Year AMC included',
    ],
    isActive: true,
  },
  {
    title: 'Computer & Laptop Repair / Full Service',
    slug: 'computer-repair-service',
    category: 'computer',
    price: 599,
    oldPrice: 1200,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80',
    description: 'Complete internal cleaning, thermal paste replacement, OS optimization, virus cleanup, and comprehensive hardware health check.',
    features: [
      'Internal dust cleaning & Arctic MX-4 thermal paste renewal',
      'Fan lubrication & cooling system optimization',
      'OS tune-up, junk file clearing & virus scan',
      'Battery, SSD, RAM & motherboard diagnostics',
      'Free doorstep pickup & drop available',
      '30-day service guarantee',
    ],
    isActive: true,
  },
  {
    title: 'Superfast SSD & RAM Speed Boost Upgrade',
    slug: 'ssd-speed-upgrade',
    category: 'computer',
    price: 2199,
    oldPrice: 3500,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80',
    description: 'Make your old laptop or desktop 10x faster with genuine NVMe/SATA SSD and high-speed RAM with OS cloning.',
    features: [
      '256GB / 512GB / 1TB Crucial / Kingston High-Speed SSD',
      'Complete OS & data cloning without data loss',
      'Boot time reduction from minutes to 8 seconds',
      'Compatible with Dell, HP, Lenovo, Asus, Acer, Apple',
      '3 to 5 Years brand replacement warranty',
    ],
    isActive: true,
  },
  {
    title: 'Custom PC Assembly (Office / Gaming / Editing)',
    slug: 'custom-pc-assembly',
    category: 'computer',
    price: 18999,
    oldPrice: 24000,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80',
    description: 'Custom built computers for office work, accounting (Tally), video editing, graphic design, and high-performance gaming.',
    features: [
      'Intel Core i3 / i5 / i7 or AMD Ryzen processors',
      'High speed DDR4/DDR5 RAM & NVMe SSD storage',
      'Dedicated NVIDIA GTX/RTX graphics options',
      'Genuine Windows 11 Pro + Microsoft Office setup',
      'Cable management, stress-testing & 3-year warranty',
    ],
    isActive: true,
  },
  {
    title: 'Printer Repair & Cartridge Refilling',
    slug: 'printer-repair-service',
    category: 'computer',
    price: 499,
    oldPrice: 900,
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&q=80',
    description: 'Repair for HP, Canon, Epson, Brother laser & inkjet printers. Paper jam fix, roller repair, cartridge refill & network setup.',
    features: [
      'Laser & Ink Tank printer troubleshooting',
      'Paper jam, gear noise, roller replacement',
      'High-yield genuine cartridge refilling & toner replacement',
      'Wi-Fi & network printer sharing across office',
      'Doorstep engineer visit within 2 hours',
    ],
    isActive: true,
  },
  {
    title: 'High-Speed Office Wi-Fi & Mesh Setup',
    slug: 'office-wifi-mesh-setup',
    category: 'networking',
    price: 3999,
    oldPrice: 6000,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80',
    description: 'Zero dead zone Wi-Fi 6 mesh networking for offices, cafes, showrooms and large houses. Supports 50+ concurrent devices.',
    features: [
      'Dual Band Wi-Fi 6 Routers & Access Points (TP-Link / Ubiquiti)',
      'Seamless roaming across multiple floors without disconnection',
      'Bandwidth management & guest network isolation',
      'Speed optimization for video conferencing (Zoom/Meet)',
      '1 Year network configuration & support warranty',
    ],
    isActive: true,
  },
  {
    title: 'Structured LAN Cabling & Server Rack Setup',
    slug: 'structured-lan-cabling-rack',
    category: 'networking',
    price: 7999,
    oldPrice: 12000,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
    description: 'Clean, labeled Cat6/Cat6A structured cabling, server rack assembly, patch panel punching, and gigabit switch installation.',
    features: [
      'D-Link / Molex / Schneider Cat6 cabling with conduit casing',
      '4U / 6U / 9U / 12U Wall mount & floor server rack setup',
      'Patch panel punching, cable numbering & port labeling',
      'Gigabit managed/unmanaged switch setup',
      'Fluke network testing for 100% packet integrity',
    ],
    isActive: true,
  },
  {
    title: 'Firewall, Router & Secure VPN Configuration',
    slug: 'firewall-router-vpn-config',
    category: 'networking',
    price: 5499,
    oldPrice: 8500,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80',
    description: 'Protect business data from cyber threats with Fortinet/Sophos firewall rules, load balancing dual ISPs, and site-to-site VPN.',
    features: [
      'Dual ISP Failover / Load Balancing configuration',
      'Secure Work-from-Home VPN setup for remote staff',
      'Website & social media blocking policies',
      'Intrusion prevention & anti-malware filtering',
      'Dedicated network security audit report',
    ],
    isActive: true,
  },
  {
    title: 'Annual AMC — Small Office / Shop Plan',
    slug: 'amc-small-office-plan',
    category: 'amc',
    price: 4999,
    oldPrice: 9000,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80',
    description: 'Year-round proactive maintenance for up to 5 PCs, 1 printer, and Wi-Fi router. Never let tech downtime stop your business.',
    features: [
      '4 Scheduled preventive maintenance visits per year',
      'Unlimited remote support via AnyDesk / TeamViewer',
      'Regular OS updates, antivirus renewal & cleanup',
      '10% Flat discount on all hardware replacement parts',
      'Priority emergency engineer visit within 4 hours',
    ],
    isActive: true,
  },
  {
    title: 'Annual AMC — Corporate Pro Plan (10-30 PCs)',
    slug: 'amc-corporate-pro-plan',
    category: 'amc',
    price: 9999,
    oldPrice: 16000,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
    description: 'Comprehensive corporate maintenance covering computers, CCTV cameras, network switches, printers & biometric machines.',
    features: [
      '12 Monthly routine visits + Unlimited emergency visits',
      'Guaranteed 2-Hour response time SLA across Kolkata',
      'Full coverage of PCs, CCTV DVR, Wi-Fi & Biometric machines',
      '20% Discount on hardware parts + Free standby replacement PC',
      'Monthly network security & backup compliance report',
    ],
    isActive: true,
  },
  {
    title: 'Annual AMC — Enterprise Plan (Large Office / Warehouse)',
    slug: 'amc-enterprise-plan',
    category: 'amc',
    price: 19999,
    oldPrice: 28000,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    description: 'Dedicated enterprise infrastructure maintenance with twice-monthly visits, dedicated certified engineer, 24/7 SLA, and full hardware coverage.',
    features: [
      '24 Scheduled visits (Twice Monthly) + 24/7 SLA support',
      'Dedicated certified engineer assigned to your account',
      'Full coverage of servers, PCs, multi-location CCTV & network racks',
      '30% Discount on all hardware parts & standby equipment',
      'Quarterly IT audit, cybersecurity report & cloud backup checks',
    ],
    isActive: true,
  },
  {
    title: 'Biometric Attendance & Access Control System',
    slug: 'biometric-attendance-access',
    category: 'biometric',
    price: 7500,
    oldPrice: 11000,
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80',
    description: 'Fingerprint & Face recognition attendance system with automatic payroll calculation, cloud report, and electronic magnetic door lock.',
    features: [
      'Essl / Realtime Biometric Device with Face & Fingerprint sensor',
      'Electronic Magnetic Lock (EM Lock) for glass / wooden doors',
      'Automated salary/attendance export to Excel & Tally',
      'Cloud mobile app for remote HR punch monitoring',
      'Installation, wiring & staff training included',
    ],
    isActive: true,
  },
];

async function seed() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/amd_it_solution';
  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('Connected!');

  // Remove test / junk services (titles like Svc mug..., Test Service mug...)
  const deleteResult = await Service.deleteMany({
    $or: [
      { title: { $regex: /mug/i } },
      { slug: { $regex: /mug/i } },
      { title: { $regex: /test/i } },
    ],
  });
  console.log(`Deleted ${deleteResult.deletedCount} test/dummy services.`);

  // Upsert all official seed services
  for (const item of SEED_SERVICES) {
    await Service.findOneAndUpdate(
      { slug: item.slug },
      { $set: item },
      { upsert: true, new: true }
    );
    console.log(`✓ Seeded: ${item.title} (${item.category}) - ₹${item.price}`);
  }

  const total = await Service.countDocuments({ isActive: true });
  console.log(`\n🎉 Done! Total active services in DB: ${total}`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
