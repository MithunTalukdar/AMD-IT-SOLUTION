import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  SITE_CONFIG,
  CATEGORIES,
  ALL_SERVICES_CATALOG,
} from '../src/data/servicesData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateXmlSitemap() {
  const domain = SITE_CONFIG.domain.replace(/\/+$/, '');
  const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const urls = [
    // Tier 1: Home
    {
      loc: `${domain}/`,
      lastmod: now,
      changefreq: 'daily',
      priority: '1.0',
    },
    // Tier 2: Services Directory Hub
    {
      loc: `${domain}/services`,
      lastmod: now,
      changefreq: 'daily',
      priority: '0.9',
    },
    // Informational & Trust Hubs
    {
      loc: `${domain}/about`,
      lastmod: now,
      changefreq: 'monthly',
      priority: '0.7',
    },
    {
      loc: `${domain}/contact`,
      lastmod: now,
      changefreq: 'monthly',
      priority: '0.7',
    },
    {
      loc: `${domain}/faq`,
      lastmod: now,
      changefreq: 'weekly',
      priority: '0.7',
    },
    {
      loc: `${domain}/privacy-policy`,
      lastmod: now,
      changefreq: 'yearly',
      priority: '0.5',
    },
    {
      loc: `${domain}/terms`,
      lastmod: now,
      changefreq: 'yearly',
      priority: '0.5',
    },
  ];

  // Tier 2 Silo Hubs: Categories
  for (const cat of CATEGORIES) {
    urls.push({
      loc: `${domain}/services/${cat.slug}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: '0.8',
    });
  }

  // Tier 3 Silo Detail Pages: Individual Services
  for (const service of ALL_SERVICES_CATALOG) {
    urls.push({
      loc: `${domain}/services/${service.category}/${service.slug}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: '0.8',
    });
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`;
  xml += `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n`;
  xml += `        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n`;

  for (const item of urls) {
    xml += `  <url>\n`;
    xml += `    <loc>${item.loc}</loc>\n`;
    xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const publicTarget = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(publicTarget, xml, 'utf8');
  console.log(`✓ Sitemap written to: ${publicTarget} (${urls.length} URLs)`);

  const distDir = path.resolve(__dirname, '../dist');
  if (fs.existsSync(distDir)) {
    const distTarget = path.join(distDir, 'sitemap.xml');
    fs.writeFileSync(distTarget, xml, 'utf8');
    console.log(`✓ Sitemap copied to: ${distTarget}`);
  }

  return urls.length;
}

generateXmlSitemap();
