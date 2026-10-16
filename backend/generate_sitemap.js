const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');

async function buildStaticSitemap() {
  await mongoose.connect(process.env.MONGO_URI);
  const products = await Product.find({}, 'slug updatedAt').lean();
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  const staticPages = [
    { url: '', changefreq: 'daily', priority: '1.0' },
    { url: 'shop', changefreq: 'daily', priority: '0.9' },
    { url: 'sale', changefreq: 'daily', priority: '0.8' },
    { url: 'collection/bridal', changefreq: 'weekly', priority: '0.8' },
    { url: 'collection/festive', changefreq: 'weekly', priority: '0.8' },
    { url: 'collection/casual', changefreq: 'weekly', priority: '0.8' },
    { url: 'about', changefreq: 'monthly', priority: '0.7' },
    { url: 'size-chart', changefreq: 'monthly', priority: '0.6' },
    { url: 'contact', changefreq: 'monthly', priority: '0.5' },
    { url: 'terms', changefreq: 'monthly', priority: '0.5' },
  ];
  
  const today = new Date().toISOString().split('T')[0];
  
  staticPages.forEach(p => {
    xml += '  <url>\n';
    xml += `    <loc>https://beadsandbloom.in/${p.url}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
    xml += `    <priority>${p.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  products.forEach(p => {
    if (p.slug) {
      const mod = p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : today;
      xml += '  <url>\n';
      xml += `    <loc>https://beadsandbloom.in/product/${p.slug}</loc>\n`;
      xml += `    <lastmod>${mod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += '  </url>\n';
    }
  });
  
  xml += '</urlset>\n';
  
  const targetPath = path.resolve(__dirname, '../Frontend/public/sitemap.xml');
  fs.writeFileSync(targetPath, xml, 'utf8');
  console.log(`✅ Generated sitemap with ${staticPages.length + products.length} URLs into ${targetPath}`);
  process.exit(0);
}

buildStaticSitemap().catch(e => { console.error(e); process.exit(1); });
