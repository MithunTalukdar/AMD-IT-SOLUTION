import { execSync } from 'child_process';

console.log('====================================================');
console.log('🚀 AMD IT SOLUTION — Full Monorepo Build Pipeline');
console.log('====================================================\n');

// 1. Build Backend
console.log('⚙️ [1/2] Building Backend TypeScript...');
execSync('npm --prefix backend run build', { stdio: 'inherit' });

// 2. Build Frontend (Vite + Sitemap + Pre-render)
console.log('\n🎨 [2/2] Building Frontend + SEO Engine...');
execSync('npm --prefix frontend run build', { stdio: 'inherit' });

console.log('\n====================================================');
console.log('✅ MONOREPO BUILD & SEO PIPELINE COMPLETED SUCCESSFULLY!');
console.log('====================================================\n');
