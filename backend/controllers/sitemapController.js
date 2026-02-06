const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const Product = require('../models/Product');

const getSitemap = async (req, res) => {
  try {
    const header = { 'Content-Type': 'application/xml', 'Content-Encoding': 'gzip' };
    
    // 1. Get Hostname from ENV
    let hostname = process.env.FRONTEND_URL || 'https://beadsandbloom.in';
    if (hostname.includes(',')) {
        hostname = hostname.split(',')[0];
    }
    hostname = hostname.trim();

    const smStream = new SitemapStream({ hostname });
    const pipeline = smStream.pipe(createGzip());

    // 2. Add Static Pages
    smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
    smStream.write({ url: '/about', changefreq: 'monthly', priority: 0.7 });
    smStream.write({ url: '/shop', changefreq: 'daily', priority: 0.9 });
    smStream.write({ url: '/contact', changefreq: 'monthly', priority: 0.5 });

    // 3. Add Dynamic Product Pages (USING SLUGS)
    // ✅ FIX: Fetch 'slug' instead of '_id'
    const products = await Product.find({}, 'slug updatedAt').lean(); 

    products.forEach((product) => {
      if (product.slug) { // Ensure slug exists before writing
        smStream.write({
          // ✅ FIX: The URL MUST match your frontend route path="/product/:slug"
          url: `/product/${product.slug}`, 
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: product.updatedAt,
        });
      }
    });

    smStream.end();

    // 4. Response
    const sitemap = await streamToPromise(pipeline);
    res.header(header);
    res.send(sitemap);

  } catch (e) {
    console.error("Sitemap Error:", e);
    res.status(500).end();
  }
};

module.exports = { getSitemap };