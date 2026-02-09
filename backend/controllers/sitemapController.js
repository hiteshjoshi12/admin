const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const Product = require('../models/Product');

const getSitemap = async (req, res) => {
  try {
    // Set headers to tell the browser/crawler this is an XML file and it's compressed
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');
    
    // 1. Get Hostname (Your Website URL)
    let hostname = process.env.FRONTEND_URL || 'https://beadsandbloom.in';
    
    // Safety check: remove trailing slashes or comma-separated lists
    if (hostname.includes(',')) hostname = hostname.split(',')[0];
    hostname = hostname.trim();

    const smStream = new SitemapStream({ hostname });
    const pipeline = smStream.pipe(createGzip());

    // ----------------------------------------
    // 2. ADD STATIC PAGES & COLLECTIONS
    // ----------------------------------------
    
    // Core Pages
    smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
    smStream.write({ url: '/about', changefreq: 'monthly', priority: 0.7 });
    smStream.write({ url: '/contact', changefreq: 'monthly', priority: 0.5 });
    
    // Shop & Collections
    smStream.write({ url: '/shop', changefreq: 'daily', priority: 0.9 });
    smStream.write({ url: '/sale', changefreq: 'daily', priority: 0.8 });
    
    // Specific Categories (The new pages you made)
    smStream.write({ url: '/collection/bridal', changefreq: 'weekly', priority: 0.8 });
    smStream.write({ url: '/collection/casual', changefreq: 'weekly', priority: 0.8 });
    
    // You can add more collections here manually if you create them later
    // smStream.write({ url: '/collection/party', changefreq: 'weekly', priority: 0.8 });

    // ----------------------------------------
    // 3. ADD DYNAMIC PRODUCT PAGES
    // ----------------------------------------
    
    // Fetch only the 'slug' and 'updatedAt' fields to keep it fast
    const products = await Product.find({}, 'slug updatedAt').lean(); 

    products.forEach((product) => {
      // Only add if a slug exists to prevent broken links
      if (product.slug) { 
        smStream.write({
          url: `/product/${product.slug}`, 
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: product.updatedAt ? product.updatedAt.toISOString() : undefined,
        });
      }
    });

    // ----------------------------------------
    // 4. FINALIZE & SEND
    // ----------------------------------------
    smStream.end();

    // Convert the stream to a promise and send it as the response
    const sitemap = await streamToPromise(pipeline);
    res.send(sitemap);

  } catch (e) {
    console.error("Sitemap Generation Error:", e);
    res.status(500).end();
  }
};

module.exports = { getSitemap };