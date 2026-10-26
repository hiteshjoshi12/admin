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

    // Static page lastmod timestamps correspond to actual editorial revision dates, NOT deploy dates
    const STATIC_PAGE_LASTMODS = {
      '/': '2026-10-26T12:00:00.000Z',
      '/shop': '2026-10-26T12:00:00.000Z',
      '/collection/bridal': '2026-10-25T10:00:00.000Z',
      '/collection/festive': '2026-10-25T10:00:00.000Z',
      '/collection/casual': '2026-10-25T10:00:00.000Z',
      '/about': '2026-10-20T10:00:00.000Z',
      '/bridal-guide': '2026-10-22T08:00:00.000Z',
      '/care-guide': '2026-10-15T09:00:00.000Z',
      '/size-chart': '2026-10-18T14:00:00.000Z',
      '/contact': '2026-10-12T11:00:00.000Z',
      '/terms': '2026-10-10T09:00:00.000Z',
      '/privacy-policy': '2026-10-10T09:00:00.000Z',
    };

    // 2. Core Pages & Topical Categories (Excludes /sale and private routes)
    smStream.write({ url: '/', changefreq: 'daily', priority: 1.0, lastmod: STATIC_PAGE_LASTMODS['/'] });
    smStream.write({ url: '/shop', changefreq: 'daily', priority: 0.9, lastmod: STATIC_PAGE_LASTMODS['/shop'] });
    smStream.write({ url: '/collection/bridal', changefreq: 'weekly', priority: 0.8, lastmod: STATIC_PAGE_LASTMODS['/collection/bridal'] });
    smStream.write({ url: '/collection/festive', changefreq: 'weekly', priority: 0.8, lastmod: STATIC_PAGE_LASTMODS['/collection/festive'] });
    smStream.write({ url: '/collection/casual', changefreq: 'weekly', priority: 0.8, lastmod: STATIC_PAGE_LASTMODS['/collection/casual'] });
    smStream.write({ url: '/about', changefreq: 'monthly', priority: 0.7, lastmod: STATIC_PAGE_LASTMODS['/about'] });
    smStream.write({ url: '/bridal-guide', changefreq: 'weekly', priority: 0.8, lastmod: STATIC_PAGE_LASTMODS['/bridal-guide'] });
    smStream.write({ url: '/care-guide', changefreq: 'weekly', priority: 0.8, lastmod: STATIC_PAGE_LASTMODS['/care-guide'] });
    smStream.write({ url: '/size-chart', changefreq: 'monthly', priority: 0.6, lastmod: STATIC_PAGE_LASTMODS['/size-chart'] });
    smStream.write({ url: '/contact', changefreq: 'monthly', priority: 0.5, lastmod: STATIC_PAGE_LASTMODS['/contact'] });
    smStream.write({ url: '/terms', changefreq: 'monthly', priority: 0.5, lastmod: STATIC_PAGE_LASTMODS['/terms'] });
    smStream.write({ url: '/privacy-policy', changefreq: 'monthly', priority: 0.5, lastmod: STATIC_PAGE_LASTMODS['/privacy-policy'] });

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