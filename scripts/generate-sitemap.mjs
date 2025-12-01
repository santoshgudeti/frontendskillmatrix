import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

function generateSitemap() {
  // Service IDs from servicesData.js
  const serviceIds = [
    'jd-resume-upload',
    'sending-assessment',
    'candidate-assessment',
    'assessment-reports',
    'interview-scheduling',
    'candidate-upload',
    'document-verification',
    'offer-letter-automation',
    'job-posting-portal',
    'applicant-intake'
  ];

  // Main pages
  const mainPages = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/features', priority: '0.9', changefreq: 'monthly' },
    { path: '/services', priority: '0.9', changefreq: 'monthly' },
    { path: '/pricing', priority: '0.8', changefreq: 'monthly' },
    { path: '/how-it-works', priority: '0.8', changefreq: 'monthly' },
    { path: '/about', priority: '0.7', changefreq: 'monthly' },
    { path: '/blog', priority: '0.7', changefreq: 'weekly' },
    { path: '/contact', priority: '0.7', changefreq: 'monthly' },
    { path: '/careers', priority: '0.7', changefreq: 'monthly' }
  ];

  // Generate service page entries
  const servicePages = serviceIds.map(id => ({
    path: `/services/${id}`,
    priority: '0.8',
    changefreq: 'monthly'
  }));

  // Combine all pages
  const allPages = [...mainPages, ...servicePages];

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>https://skillmatrix.com${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write sitemap to public directory
  const publicDir = join(process.cwd(), 'public');
  const sitemapPath = join(publicDir, 'sitemap.xml');

  // Ensure public directory exists
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
  }

  writeFileSync(sitemapPath, sitemap);

  console.log('Sitemap generated successfully!');
  console.log(`Sitemap written to: ${sitemapPath}`);
  console.log(`Total URLs included: ${allPages.length}`);
}

generateSitemap();