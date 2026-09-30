import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  SITE_CONFIG,
  CATEGORIES,
  ALL_SERVICES_CATALOG,
  FAQS_LIST,
} from '../src/data/servicesData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error(`❌ Pre-render error: ${TEMPLATE_PATH} does not exist. Run vite build first.`);
  process.exit(1);
}

const baseTemplate = fs.readFileSync(TEMPLATE_PATH, 'utf8');

// Define all static public routes to pre-render
const routes = [
  {
    path: '/',
    title: 'AMD IT SOLUTION | CCTV, Computer, Network & AMC Kolkata',
    description:
      'Certified IT solutions in Kolkata. 24/7 CCTV surveillance, computer & laptop repair, networking & AMC contracts. Doorstep service in 2 hours. Call 9635006403.',
    heading: 'PREMIUM IT SOLUTIONS, CCTV SURVEILLANCE & AMC IN KOLKATA',
    summary:
      "ADM TECHNO SOLUTION (operating as AMD IT SOLUTION) is Kolkata's premier technology infrastructure provider. We specialize in high-definition CCTV camera installation, computer repairs, SSD upgrades, Cat6 networking, and corporate AMC contracts.",
    breadcrumbs: [],
    faqs: FAQS_LIST.slice(0, 6),
  },
  {
    path: '/services',
    title: 'All IT Services & CCTV Solutions Kolkata | AMD IT',
    description:
      'Explore complete IT & security services in Kolkata. CCTV kits, laptop repair, Wi-Fi mesh, Cat6 LAN & corporate AMC. Transparent pricing with warranty.',
    heading: 'Complete IT Services & Surveillance Solutions Directory Kolkata',
    summary:
      'Browse our complete catalog of certified IT solutions for homes, retail stores, corporate offices, and institutions across Greater Kolkata and West Bengal.',
    breadcrumbs: [{ name: 'All Services', url: '/services' }],
    faqs: FAQS_LIST.slice(0, 4),
  },
  {
    path: '/about',
    title: 'About AMD IT SOLUTION | Certified IT Partner Kolkata',
    description:
      'Serving 5,000+ businesses across Kolkata and West Bengal since 2012. Meet our certified hardware & network engineers providing trusted 24/7 IT support.',
    heading: 'About ADM TECHNO SOLUTION (AMD IT SOLUTION) — Kolkata',
    summary:
      'Established in 2012, ADM TECHNO SOLUTION has served over 5,000 satisfied residential and business clients in Kolkata with genuine hardware, rapid SLAs, and certified field engineers.',
    breadcrumbs: [{ name: 'About Us', url: '/about' }],
  },
  {
    path: '/contact',
    title: 'Contact AMD IT SOLUTION Kolkata | 24/7 IT Support',
    description:
      'Get in touch with AMD IT SOLUTION at 24 T C Road, Kolkata. Call 9635006403 for emergency IT service, free CCTV quotes, or doorstep technician visits.',
    heading: 'Contact ADM TECHNO SOLUTION Support & Central Helpline',
    summary:
      'Reach our centralized dispatch and engineering support desk for immediate on-site visits across Kolkata, Howrah, Salt Lake, and New Town.',
    breadcrumbs: [{ name: 'Contact Us', url: '/contact' }],
  },
  {
    path: '/faq',
    title: 'IT & CCTV Service FAQs | AMD IT SOLUTION Kolkata',
    description:
      'Frequently asked questions about CCTV camera setups, computer repairs, warranty policies, AMC pricing, and doorstep technician visits in Kolkata.',
    heading: 'Frequently Asked Questions & IT Support Knowledge Base',
    summary:
      'Detailed answers to the most common questions regarding camera installations, warranties, payment options, and repair response times in Kolkata.',
    breadcrumbs: [{ name: 'FAQ', url: '/faq' }],
    faqs: FAQS_LIST,
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy | AMD IT SOLUTION Kolkata',
    description:
      'Privacy policy and data protection standards for AMD IT SOLUTION customers, website visitors, and service booking users.',
    heading: 'ADM TECHNO SOLUTION Privacy Policy',
    summary:
      'Official privacy practices outlining how we collect, store, and safeguard customer data during service execution and online bookings.',
    breadcrumbs: [{ name: 'Privacy Policy', url: '/privacy-policy' }],
  },
  {
    path: '/terms',
    title: 'Terms of Service | AMD IT SOLUTION Kolkata',
    description:
      'Terms and conditions for on-site IT repairs, CCTV installations, warranty coverage, and Annual Maintenance Contracts with AMD IT SOLUTION.',
    heading: 'ADM TECHNO SOLUTION Terms of Service',
    summary:
      'Standard terms of service, hardware manufacturer warranty conditions, and corporate SLA guidelines.',
    breadcrumbs: [{ name: 'Terms of Service', url: '/terms' }],
  },
];

// Add Category Silo Routes
for (const cat of CATEGORIES) {
  routes.push({
    path: `/services/${cat.slug}`,
    title: cat.metaTitle,
    description: cat.metaDescription,
    heading: cat.h1,
    summary: cat.heroSubheading,
    category: cat,
    breadcrumbs: [
      { name: 'All Services', url: '/services' },
      { name: cat.name, url: `/services/${cat.slug}` },
    ],
    faqs: FAQS_LIST.slice(0, 4),
  });
}

// Add Individual Service Detail Routes
for (const svc of ALL_SERVICES_CATALOG) {
  routes.push({
    path: `/services/${svc.category}/${svc.slug}`,
    title: svc.metaTitle,
    description: svc.metaDescription,
    heading: `${svc.title} — Turnkey Solution in Kolkata`,
    summary: svc.detailedSummary || svc.description,
    service: svc,
    breadcrumbs: [
      { name: 'All Services', url: '/services' },
      { name: svc.categoryName, url: `/services/${svc.category}` },
      { name: svc.title, url: `/services/${svc.category}/${svc.slug}` },
    ],
    faqs: FAQS_LIST.slice(0, 4),
  });
}

function buildStructuredData(r) {
  const canonicalUrl = `${SITE_CONFIG.domain}${r.path === '/' ? '' : r.path}`;
  const graph = [
    {
      '@type': ['LocalBusiness', 'ProfessionalService'],
      '@id': `${SITE_CONFIG.domain}/#organization`,
      name: SITE_CONFIG.siteName,
      alternateName: ['AMD IT SOLUTION', 'ADM Techno Solution Kolkata'],
      url: SITE_CONFIG.domain,
      logo: `${SITE_CONFIG.domain}/favicon.svg`,
      image: SITE_CONFIG.defaultOgImage,
      telephone: SITE_CONFIG.phone,
      email: SITE_CONFIG.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE_CONFIG.address.streetAddress,
        addressLocality: SITE_CONFIG.address.addressLocality,
        addressRegion: SITE_CONFIG.address.addressRegion,
        postalCode: SITE_CONFIG.address.postalCode,
        addressCountry: SITE_CONFIG.address.addressCountry,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: SITE_CONFIG.geo.latitude,
        longitude: SITE_CONFIG.geo.longitude,
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: SITE_CONFIG.rating,
        reviewCount: String(SITE_CONFIG.reviewCount),
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_CONFIG.domain}/#website`,
      url: SITE_CONFIG.domain,
      name: SITE_CONFIG.siteName,
      publisher: { '@id': `${SITE_CONFIG.domain}/#organization` },
    },
  ];

  if (r.breadcrumbs && r.breadcrumbs.length > 0) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: r.breadcrumbs.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.name,
        item: `${SITE_CONFIG.domain}${b.url}`,
      })),
    });
  }

  if (r.service) {
    graph.push({
      '@type': 'Service',
      '@id': `${canonicalUrl}#service`,
      name: r.service.title,
      serviceType: r.service.categoryName,
      description: r.service.description,
      image: r.service.image,
      provider: { '@id': `${SITE_CONFIG.domain}/#organization` },
      offers: {
        '@type': 'Offer',
        price: String(r.service.price),
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        url: canonicalUrl,
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: String(r.service.ratingVal || 4.9),
        reviewCount: String(r.service.reviewCount || 340),
      },
    });
  }

  if (r.faqs && r.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}#faq`,
      mainEntity: r.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

function buildPreRenderHtml(r) {
  const canonicalUrl = `${SITE_CONFIG.domain}${r.path === '/' ? '' : r.path}`;
  const ldJson = buildStructuredData(r);

  let html = baseTemplate;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${r.title}</title>`);

  // Replace Meta Description
  html = html.replace(
    /<meta name="description" content=".*?" \/>/i,
    `<meta name="description" content="${r.description}" />`
  );

  // Replace Canonical Link
  html = html.replace(
    /<link rel="canonical" href=".*?" \/>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  // Replace Open Graph Tags
  html = html.replace(
    /<meta property="og:title" content=".*?" \/>/i,
    `<meta property="og:title" content="${r.title}" />`
  );
  html = html.replace(
    /<meta property="og:description" content=".*?" \/>/i,
    `<meta property="og:description" content="${r.description}" />`
  );
  html = html.replace(
    /<meta property="og:url" content=".*?" \/>/i,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );

  // Replace Twitter Card Tags
  html = html.replace(
    /<meta name="twitter:title" content=".*?" \/>/i,
    `<meta name="twitter:title" content="${r.title}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content=".*?" \/>/i,
    `<meta name="twitter:description" content="${r.description}" />`
  );

  // Replace JSON-LD schema
  const jsonLdString = JSON.stringify(ldJson, null, 2);
  html = html.replace(
    /<script id="seo-schema-root" type="application\/ld\+json">[\s\S]*?<\/script>/i,
    `<script id="seo-schema-root" type="application/ld+json">\n${jsonLdString}\n</script>`
  );

  // Inject semantic pre-hydration body markup
  const semanticShell = `
    <header style="background:#0a1e40;color:#fff;padding:12px 20px;">
      <div style="max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
        <div><strong>ADM TECHNO SOLUTION (AMD IT SOLUTION)</strong> — 24 T C Road, Kolkata - 700053</div>
        <div><a href="tel:9635006403" style="color:#facc15;font-weight:bold;text-decoration:none;">📞 Helpline: 9635006403</a></div>
      </div>
      <nav aria-label="Main Navigation" style="max-width:1200px;margin:10px auto 0;display:flex;gap:15px;flex-wrap:wrap;">
        <a href="/" style="color:#fff;text-decoration:none;">Home</a>
        <a href="/services" style="color:#fff;text-decoration:none;">All Services</a>
        <a href="/services/cctv" style="color:#fff;text-decoration:none;">CCTV</a>
        <a href="/services/computer" style="color:#fff;text-decoration:none;">Computer Repair</a>
        <a href="/services/networking" style="color:#fff;text-decoration:none;">Networking</a>
        <a href="/services/amc" style="color:#fff;text-decoration:none;">AMC</a>
        <a href="/services/biometric" style="color:#fff;text-decoration:none;">Biometrics</a>
        <a href="/about" style="color:#fff;text-decoration:none;">About</a>
        <a href="/contact" style="color:#fff;text-decoration:none;">Contact</a>
      </nav>
    </header>

    <main style="max-width:1200px;margin:24px auto;padding:0 20px;font-family:sans-serif;">
      ${
        r.breadcrumbs && r.breadcrumbs.length > 0
          ? `<nav aria-label="Breadcrumb" style="font-size:13px;color:#64748b;margin-bottom:16px;">
              <a href="/" style="color:#1e4a9a;text-decoration:none;">Home</a> /
              ${r.breadcrumbs
                .map((b, i) =>
                  i === r.breadcrumbs.length - 1
                    ? ` <strong>${b.name}</strong>`
                    : ` <a href="${b.url}" style="color:#1e4a9a;text-decoration:none;">${b.name}</a> /`
                )
                .join('')}
            </nav>`
          : ''
      }

      <h1 style="color:#0a1e40;font-size:28px;margin-bottom:12px;">${r.heading}</h1>
      <p style="color:#334155;line-height:1.6;font-size:16px;max-width:850px;">${r.summary}</p>

      ${
        r.service
          ? `<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:20px;margin:20px 0;">
              <h2 style="color:#0a1e40;font-size:20px;margin-top:0;">Turnkey Package Details: ₹${r.service.price.toLocaleString()}</h2>
              <p style="color:#475569;">${r.service.detailedSummary || r.service.description}</p>
              <h3>Included Specifications & Warranty:</h3>
              <ul>
                ${r.service.features.map((f) => `<li>${f}</li>`).join('')}
              </ul>
              <p><strong>Warranty:</strong> ${r.service.warranty}</p>
              <p><strong>Delivery SLA:</strong> ${r.service.deliveryTime}</p>
              <p>
                <a href="/booking?service=${r.service.slug}" style="display:inline-block;background:#facc15;color:#0a1e40;padding:10px 20px;border-radius:20px;font-weight:bold;text-decoration:none;">Book This Service Online →</a>
                <a href="tel:9635006403" style="display:inline-block;margin-left:10px;color:#0a1e40;text-decoration:underline;">Call 9635006403</a>
              </p>
            </div>`
          : ''
      }

      ${
        r.category
          ? `<div style="margin:24px 0;">
              <h2>Available Packages in this Silo:</h2>
              <ul>
                ${ALL_SERVICES_CATALOG.filter((s) => s.category === r.category.id)
                  .map(
                    (s) =>
                      `<li><a href="/services/${r.category.slug}/${s.slug}"><strong>${s.title}</strong></a> — Starting from ₹${s.price.toLocaleString()} (${s.description})</li>`
                  )
                  .join('')}
              </ul>
            </div>`
          : ''
      }

      ${
        r.faqs && r.faqs.length > 0
          ? `<section style="margin:30px 0;padding-top:20px;border-top:1px solid #e2e8f0;">
              <h2 style="color:#0a1e40;">Frequently Asked Questions</h2>
              ${r.faqs
                .map(
                  (f) =>
                    `<div style="margin-bottom:15px;">
                      <h3 style="margin-bottom:4px;font-size:16px;color:#1e293b;">${f.q}</h3>
                      <p style="margin-top:0;color:#475569;font-size:14px;">${f.a}</p>
                    </div>`
                )
                .join('')}
            </section>`
          : ''
      }
    </main>

    <footer style="background:#06122e;color:#cbd5e1;padding:24px 20px;text-align:center;font-size:13px;">
      <p>© 2026 ADM TECHNO SOLUTION (AMD IT SOLUTION) — 24 T C Road, Kolkata - 700053</p>
      <p>
        <a href="/privacy-policy" style="color:#94a3b8;margin-right:12px;">Privacy Policy</a>
        <a href="/terms" style="color:#94a3b8;">Terms of Service</a>
      </p>
    </footer>
  `;

  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>/i,
    `<div id="root">${semanticShell}</div>`
  );

  return html;
}

function runPreRenderer() {
  console.log(`\n🚀 Starting SSG Pre-rendering Engine for ${routes.length} routes...`);

  let count = 0;
  for (const r of routes) {
    const renderedHtml = buildPreRenderHtml(r);

    let targetDir;
    if (r.path === '/') {
      targetDir = DIST_DIR;
    } else {
      targetDir = path.join(DIST_DIR, r.path.replace(/^\//, ''));
    }

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetFile = path.join(targetDir, 'index.html');
    fs.writeFileSync(targetFile, renderedHtml, 'utf8');
    count++;
  }

  console.log(`✅ Successfully pre-rendered ${count} production HTML routes into dist/!`);
}

runPreRenderer();
