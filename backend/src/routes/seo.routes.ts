import { Router, Request, Response } from 'express';
import Service from '../models/Service.js';

const router = Router();
const DOMAIN = (process.env.FRONTEND_URL || 'https://amditsolution.in')
  .split(',')[0]
  .trim()
  .replace(/\/+$/, '');

const STATIC_ROUTES = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: '/services', priority: '0.9', changefreq: 'daily' },
  { path: '/services/cctv', priority: '0.8', changefreq: 'weekly' },
  { path: '/services/computer', priority: '0.8', changefreq: 'weekly' },
  { path: '/services/networking', priority: '0.8', changefreq: 'weekly' },
  { path: '/services/amc', priority: '0.8', changefreq: 'weekly' },
  { path: '/services/biometric', priority: '0.8', changefreq: 'weekly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/faq', priority: '0.7', changefreq: 'weekly' },
  { path: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
  { path: '/terms', priority: '0.5', changefreq: 'yearly' },
];

const DEFAULT_SERVICES = [
  { slug: 'cctv-home-kit', category: 'cctv' },
  { slug: 'cctv-shop-combo', category: 'cctv' },
  { slug: 'cctv-ip-enterprise', category: 'cctv' },
  { slug: 'laptop-service', category: 'computer' },
  { slug: 'ssd-speed-upgrade', category: 'computer' },
  { slug: 'desktop-assemble', category: 'computer' },
  { slug: 'printer-repair', category: 'computer' },
  { slug: 'office-wifi-setup', category: 'networking' },
  { slug: 'structured-lan-cabling', category: 'networking' },
  { slug: 'firewall-vpn-setup', category: 'networking' },
  { slug: 'amc-basic-plan', category: 'amc' },
  { slug: 'amc-corporate-pro-plan', category: 'amc' },
  { slug: 'amc-enterprise-plan', category: 'amc' },
  { slug: 'biometric-attendance', category: 'biometric' },
];

// GET /sitemap.xml
router.get('/sitemap.xml', async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let serviceList: { slug: string; category: string; updatedAt?: Date }[] = [];

    try {
      const dbServices = await Service.find({ isActive: true })
        .select('slug category updatedAt')
        .lean()
        .exec();
      if (dbServices && dbServices.length > 0) {
        serviceList = dbServices as any;
      } else {
        serviceList = DEFAULT_SERVICES;
      }
    } catch (e) {
      serviceList = DEFAULT_SERVICES;
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`;
    xml += `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n`;
    xml += `        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n`;

    // Static pages & Silos
    for (const r of STATIC_ROUTES) {
      xml += `  <url>\n`;
      xml += `    <loc>${DOMAIN}${r.path}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${r.changefreq}</changefreq>\n`;
      xml += `    <priority>${r.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Dynamic services
    for (const s of serviceList) {
      const lastmodDate = s.updatedAt
        ? new Date(s.updatedAt).toISOString().split('T')[0]
        : today;
      xml += `  <url>\n`;
      xml += `    <loc>${DOMAIN}/services/${s.category}/${s.slug}</loc>\n`;
      xml += `    <lastmod>${lastmodDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>\n`;

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    return res.send(xml);
  } catch (err: any) {
    return res.status(500).send('Error generating dynamic sitemap');
  }
});

// GET /robots.txt
router.get('/robots.txt', (req: Request, res: Response) => {
  const robotsTxt = `# ==============================================================================
# ROBOTS.TXT — ADM TECHNO SOLUTION (AMD IT SOLUTION)
# Target Domain: ${DOMAIN}
# Strict Crawl Budget & Indexing Policy adhering to Google Search Central
# ==============================================================================

User-agent: *
Allow: /
Allow: /services
Allow: /services/*
Allow: /about
Allow: /contact
Allow: /faq
Allow: /privacy-policy
Allow: /terms
Allow: /assets/
Allow: /favicon.svg
Allow: /og-image.jpg
Allow: /site.webmanifest
Allow: /google*.html

# Shield Private, Administrative, User Portals & Transactional Endpoints
Disallow: /admin
Disallow: /admin/*
Disallow: /customer
Disallow: /customer/*
Disallow: /technician
Disallow: /technician/*
Disallow: /booking
Disallow: /booking/*
Disallow: /login
Disallow: /register
Disallow: /api/
Disallow: /api/*

# Block query parameters to avoid duplicate content crawl waste
Disallow: /*?*search=*
Disallow: /*?*token=*

# Canonical Host & Dynamic Sitemap Directives
Host: ${DOMAIN}
Sitemap: ${DOMAIN}/sitemap.xml
`;

  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.header('Cache-Control', 'public, max-age=86400');
  return res.send(robotsTxt);
});

// GET /google08d5bc3643a89d67.html (Google Search Console Verification)
router.get('/google08d5bc3643a89d67.html', (req: Request, res: Response) => {
  res.header('Content-Type', 'text/html; charset=utf-8');
  return res.send('google-site-verification: google08d5bc3643a89d67.html');
});

export default router;
