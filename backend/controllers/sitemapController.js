const { SitemapStream, streamToPromise } = require('sitemap');
const Product = require('../models/Product');

const getSitemap = async (req, res) => {
  try {
    res.header('Content-Type', 'application/xml; charset=utf-8');
    
    // 1. Get Canonical Production Hostname (Ensures https://beadsandbloom.in is always used)
    let hostname = 'https://beadsandbloom.in';
    if (process.env.SITE_URL) {
      hostname = process.env.SITE_URL;
    } else if (process.env.FRONTEND_URL_PROD) {
      hostname = process.env.FRONTEND_URL_PROD;
    }
    hostname = hostname.trim().replace(/\/$/, '');

    const smStream = new SitemapStream({ hostname });

    // 2. Core Pages & Topical Categories
    smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
    smStream.write({ url: '/shop', changefreq: 'daily', priority: 0.9 });
    smStream.write({ url: '/sale', changefreq: 'daily', priority: 0.8 });
    smStream.write({ url: '/collection/bridal', changefreq: 'weekly', priority: 0.8 });
    smStream.write({ url: '/collection/festive', changefreq: 'weekly', priority: 0.8 });
    smStream.write({ url: '/collection/casual', changefreq: 'weekly', priority: 0.8 });
    smStream.write({ url: '/about', changefreq: 'monthly', priority: 0.7 });
    smStream.write({ url: '/bridal-guide', changefreq: 'weekly', priority: 0.8 });
    smStream.write({ url: '/care-guide', changefreq: 'weekly', priority: 0.8 });
    smStream.write({ url: '/size-chart', changefreq: 'monthly', priority: 0.6 });
    smStream.write({ url: '/contact', changefreq: 'monthly', priority: 0.5 });
    smStream.write({ url: '/terms', changefreq: 'monthly', priority: 0.5 });

    // 3. Dynamic Products from MongoDB
    const products = await Product.find({}, 'slug updatedAt').lean();
    products.forEach((product) => {
      if (product.slug) {
        smStream.write({
          url: `/product/${product.slug}`,
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: product.updatedAt ? product.updatedAt.toISOString() : undefined,
        });
      }
    });

    smStream.end();
    const sitemap = await streamToPromise(smStream);
    res.send(sitemap);
  } catch (e) {
    console.error("Sitemap Generation Error:", e);
    res.status(500).end();
  }
};

module.exports = { getSitemap };