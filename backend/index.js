require('dotenv').config();
const compression = require('compression');
const express = require('express');
const path = require('path');
const { connectDB } = require('./config/db.js');
const enableCors = require('./config/cors.js');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const bestSellerRoutes = require('./routes/bestSellerRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const contentRoutes = require('./routes/contentRoutes');
const cmsRoutes = require('./routes/cmsRoutes');
const coupons = require('./routes/couponRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const sitemapRoutes = require('./routes/sitemapRoutes');
const contactRoutes = require('./routes/contactRoutes');
const { apiLimiter, publicReadLimiter } = require('./middleware/rateLimiter');
const { processSeoRoute } = require('./utils/seoRenderer');
const crypto = require('crypto');

const app = express();

// Disable X-Powered-By
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  next();
});

// Trust LiteSpeed front-end reverse proxy (1 hop)
app.set('trust proxy', 1);

// Debug endpoint for X-Forwarded-For spoofing verification
app.get('/api/test-ip', (req, res) => {
  res.json({
    reqIp: req.ip,
    reqIps: req.ips,
    rawXForwardedFor: req.headers['x-forwarded-for'],
    headers: req.headers
  });
});

// 1. WWW to Non-WWW 301 Normalization
app.use((req, res, next) => {
  const host = req.headers.host || '';
  if (host.startsWith('www.')) {
    return res.redirect(301, `https://beadsandbloom.in${req.originalUrl}`);
  }
  next();
});

// 2. Trailing Slash 301 Normalization (strips trailing slash, ignores API routes)
app.use((req, res, next) => {
  if (req.path.length > 1 && req.path.endsWith('/') && !req.path.startsWith('/api')) {
    const cleanPath = req.path.replace(/\/+$/, '');
    const query = req.url.slice(req.path.length);
    return res.redirect(301, cleanPath + query);
  }
  next();
});

// Middleware
app.use(compression());
enableCors(app);
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Database Connection
connectDB();

// Public GET read endpoints receive generous throughput
app.use('/api/products', publicReadLimiter);
app.use('/api/collections', publicReadLimiter);
app.use('/api/content', publicReadLimiter);
app.use('/api/bestsellers', publicReadLimiter);

// Global API Rate Limiting for other routes
app.use('/api', apiLimiter);

// API Routes
app.use('/', sitemapRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/bestsellers', bestSellerRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/coupons', coupons);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);

const fs = require('fs');

// --- STATIC ASSETS & REACT CLIENT ROUTING ---

const distPath = path.join(__dirname, 'dist');

// Explicit robots.txt handler with short cache header (preventing 1-year immutable caching)
app.get('/robots.txt', (req, res) => {
  const robotsPath = path.join(distPath, 'robots.txt');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  if (fs.existsSync(robotsPath)) {
    return res.sendFile(robotsPath);
  }
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/*\nDisallow: /profile\nDisallow: /myorders\nDisallow: /order/\nDisallow: /cart\nDisallow: /checkout\nDisallow: /wishlist\nDisallow: /login\nDisallow: /signup\nDisallow: /forgot-password\nDisallow: /resetpassword/\nDisallow: /track-order\n\nSitemap: https://beadsandbloom.in/sitemap.xml\n`);
});

// Serve static assets from the 'dist' directory (index: false prevents static middleware from intercepting root '/')
app.use(express.static(distPath, {
  index: false,
  maxAge: '1y',
  immutable: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('.txt') || filePath.endsWith('.xml')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

const getIndexHtml = () => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return fs.readFileSync(indexPath, 'utf8');
  }
  return null;
};

// Fallback for React Router (handles root '/', client subpaths, and prevents overriding /api)
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }

  // Guard against missing assets/scripts returning index.html as text/html
  if (
    req.path.startsWith('/assets/') ||
    /\.(js|mjs|css|png|jpg|jpeg|gif|webp|svg|ico|json|map|woff|woff2|ttf|eot)$/i.test(req.path) ||
    req.path === '/llms.txt' ||
    req.path === '/llms-full.txt'
  ) {
    return res.status(404).type('text/plain').send('Asset not found');
  }

  // Allow client conditional caching (no-cache allows validation via ETag / Last-Modified)
  res.setHeader('Cache-Control', 'no-cache');
  res.removeHeader('Pragma');
  res.removeHeader('Expires');

  const rawHtml = getIndexHtml();
  if (!rawHtml) {
    return res.sendFile(path.join(distPath, 'index.html'));
  }

  try {
    const result = await processSeoRoute(req.path, rawHtml);

    // Handle 301 Redirect (e.g. oldSlugs match)
    if (result.redirectUrl) {
      return res.redirect(result.statusCode || 301, result.redirectUrl);
    }

    // Set custom headers (e.g. X-Robots-Tag: noindex, nofollow)
    if (result.headers) {
      for (const [hName, hVal] of Object.entries(result.headers)) {
        res.setHeader(hName, hVal);
      }
    }

    // Compute deterministic ETag and Last-Modified
    const etag = `W/"${Buffer.byteLength(result.html).toString(16)}-${crypto.createHash('md5').update(result.html).digest('base64').slice(0, 27)}"`;
    res.setHeader('ETag', etag);

    const lastMod = result.lastModified ? new Date(result.lastModified).toUTCString() : 'Mon, 26 Oct 2026 12:00:00 GMT';
    res.setHeader('Last-Modified', lastMod);

    // Conditional 304 Check: If-None-Match
    const clientEtag = req.headers['if-none-match'];
    if (clientEtag && (clientEtag === etag || clientEtag === etag.replace(/^W\//, '') || clientEtag.includes(etag))) {
      return res.status(304).end();
    }

    // Conditional 304 Check: If-Modified-Since
    const ifModifiedSince = req.headers['if-modified-since'];
    if (ifModifiedSince && new Date(ifModifiedSince) >= new Date(lastMod)) {
      return res.status(304).end();
    }

    return res.status(result.statusCode || 200).type('html').send(result.html);
  } catch (err) {
    console.error('SEO Route Processing Error:', err);
    return res.status(500).send('Server Error');
  }
});

// Export app
module.exports = app;

// Listen on Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));