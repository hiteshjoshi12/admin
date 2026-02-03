const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const Product = require('../models/Product');

const getSitemap = async (req, res) => {
  let sitemap;
  
  try {
    const header = { 'Content-Type': 'application/xml', 'Content-Encoding': 'gzip' };
    
    // --- FIX START ---
    let hostname = process.env.FRONTEND_URL || 'https://www.beadsandbloom.com';

    // If the env variable has multiple URLs (comma separated), take the first one
    if (hostname.includes(',')) {
        hostname = hostname.split(',')[0];
    }
    
    // Trim any whitespace
    hostname = hostname.trim();
    // --- FIX END ---

    const smStream = new SitemapStream({ hostname });
    const pipeline = smStream.pipe(createGzip());

    // 2. Add Static Pages
    smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
    smStream.write({ url: '/about', changefreq: 'monthly', priority: 0.7 });
    smStream.write({ url: '/shop', changefreq: 'daily', priority: 0.9 });
    smStream.write({ url: '/contact', changefreq: 'monthly', priority: 0.5 });
    smStream.write({ url: '/login', changefreq: 'monthly', priority: 0.3 });
    smStream.write({ url: '/signup', changefreq: 'monthly', priority: 0.3 });

    // 3. Add Dynamic Product Pages
    const products = await Product.find({}, '_id updatedAt'); 

    products.forEach((product) => {
      smStream.write({
        url: `/product/${product._id}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: product.updatedAt,
      });
    });

    streamToPromise(pipeline).then((sm) => (sitemap = sm));
    smStream.end();

    pipeline.pipe(res).on('error', (e) => {
      throw e;
    });

    res.header(header);
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

module.exports = { getSitemap };