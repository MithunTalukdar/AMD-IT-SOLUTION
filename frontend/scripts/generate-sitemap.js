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
  const domain = (process.env.VITE_SITE_URL || process.env.SITE_URL || SITE_CONFIG.domain).replace(/\/+$/, '');
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
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const item of urls) {
    xml += `  <url>\n`;
    xml += `    <loc>${item.loc}</loc>\n`;
    xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  indexXml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  indexXml += `  <sitemap>\n`;
  indexXml += `    <loc>${domain}/sitemap.xml</loc>\n`;
  indexXml += `    <lastmod>${now}</lastmod>\n`;
  indexXml += `  </sitemap>\n`;
  indexXml += `</sitemapindex>\n`;

  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const distDir = path.resolve(__dirname, '../dist');

  // Write sitemap.xml
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'sitemap-v1.xml'), xml, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'sitemap_index.xml'), indexXml, 'utf8');
  console.log(`✓ Sitemaps written to public/: sitemap.xml, sitemap-v1.xml, sitemap_index.xml (${urls.length} URLs)`);

  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
    fs.writeFileSync(path.join(distDir, 'sitemap-v1.xml'), xml, 'utf8');
    fs.writeFileSync(path.join(distDir, 'sitemap_index.xml'), indexXml, 'utf8');
    console.log(`✓ Sitemaps copied to dist/: sitemap.xml, sitemap-v1.xml, sitemap_index.xml`);
  }

  return urls.length;
}

generateXmlSitemap();
