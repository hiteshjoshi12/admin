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

    const STATIC_LASTMOD = '2026-10-26T12:00:00.000Z';

    // 2. Core Pages & Topical Categories (Excludes /sale and private routes)
    smStream.write({ url: '/', changefreq: 'daily', priority: 1.0, lastmod: STATIC_LASTMOD });
    smStream.write({ url: '/shop', changefreq: 'daily', priority: 0.9, lastmod: STATIC_LASTMOD });
    smStream.write({ url: '/collection/bridal', changefreq: 'weekly', priority: 0.8, lastmod: STATIC_LASTMOD });
    smStream.write({ url: '/collection/festive', changefreq: 'weekly', priority: 0.8, lastmod: STATIC_LASTMOD });
    smStream.write({ url: '/collection/casual', changefreq: 'weekly', priority: 0.8, lastmod: STATIC_LASTMOD });
    smStream.write({ url: '/about', changefreq: 'monthly', priority: 0.7, lastmod: STATIC_LASTMOD });
    smStream.write({ url: '/bridal-guide', changefreq: 'weekly', priority: 0.8, lastmod: STATIC_LASTMOD });
    smStream.write({ url: '/care-guide', changefreq: 'weekly', priority: 0.8, lastmod: STATIC_LASTMOD });
    smStream.write({ url: '/size-chart', changefreq: 'monthly', priority: 0.6, lastmod: STATIC_LASTMOD });
    smStream.write({ url: '/contact', changefreq: 'monthly', priority: 0.5, lastmod: STATIC_LASTMOD });
    smStream.write({ url: '/terms', changefreq: 'monthly', priority: 0.5, lastmod: STATIC_LASTMOD });
    smStream.write({ url: '/privacy-policy', changefreq: 'monthly', priority: 0.5, lastmod: STATIC_LASTMOD });

    // 3. Dynamic Products from MongoDB with Google Image Extensions
    const products = await Product.find({}, 'name slug images image updatedAt').lean();
    products.forEach((product) => {
      if (product.slug) {
        const imageList = [];
        if (product.image) imageList.push(product.image);
        if (Array.isArray(product.images)) {
          product.images.forEach((img) => {
            if (img && !imageList.includes(img)) imageList.push(img);
          });
        }

        const imgEntries = imageList.map((imgUrl) => ({
          url: imgUrl,
          title: product.name,
          caption: `${product.name} — Handcrafted Punjabi Jutti by Beads and Bloom`
        }));

        smStream.write({
          url: `/product/${product.slug}`,
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: product.updatedAt ? product.updatedAt.toISOString() : undefined,
          ...(imgEntries.length > 0 ? { img: imgEntries } : {})
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