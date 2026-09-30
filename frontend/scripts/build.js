import { execSync } from 'child_process';

console.log('====================================================');
console.log('🚀 AMD IT SOLUTION — Full Production Build Pipeline');
console.log('====================================================\n');

// 1. Run Vite build
console.log('📦 [1/3] Building client assets with Vite...');
execSync('npx vite build', { stdio: 'inherit' });

// 2. Generate XML Sitemap
console.log('\n🗺️  [2/3] Generating SEO XML sitemap...');
await import('./generate-sitemap.js');

// 3. Pre-render Static HTML Silos
console.log('\n⚡ [3/3] Pre-rendering static HTML pages for Googlebot...');
await import('./prerender.js');

console.log('\n====================================================');
console.log('✅ ALL BUILD STEPS COMPLETED WITH ZERO ERRORS!');
console.log('====================================================\n');
