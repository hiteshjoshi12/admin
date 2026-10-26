// Zero-dependency fallback rate limiter to prevent MODULE_NOT_FOUND crashes on shared hosting / cPanel
function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || 15 * 60 * 1000;
  const max = options.max || 100;
  const message = options.message || { message: 'Too many requests, please try again later.' };
  const store = new Map();

  // Periodic cleanup every 5 minutes to prevent memory leak
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of store.entries()) {
      if (now > record.resetTime) {
        store.delete(ip);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req, res, next) => {
    try {
      const forwarded = req.headers['x-forwarded-for'];
      const clientIp = forwarded 
        ? String(forwarded).split(',')[0].trim() 
        : (req.socket?.remoteAddress || req.ip || 'anonymous');

      const now = Date.now();
      let record = store.get(clientIp);

      if (!record || now > record.resetTime) {
        record = { count: 1, resetTime: now + windowMs };
        store.set(clientIp, record);
        return next();
      }

      record.count += 1;
      if (record.count > max) {
        return res.status(429).json(message);
      }

      next();
    } catch (err) {
      next();
    }
  };
}

let rateLimit;
try {
  rateLimit = require('express-rate-limit');
} catch (e) {
  // Gracefully use built-in limiter if express-rate-limit is not installed in host node_modules
  rateLimit = createRateLimiter;
}

// 1. General API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Let public catalog GET requests be governed by publicReadLimiter
    if (req.method === 'GET') {
      const p = req.originalUrl || (req.baseUrl + req.path) || '';
      return p.includes('/products') || p.includes('/collections') || p.includes('/content') || p.includes('/bestsellers');
    }
    return false;
  },
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// 2. Sensitive Order Placement Limiter (Prevent Inventory Drain / Fake Bots)
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many orders attempted from this IP, please try again after 15 minutes' }
});

// 3. Auth Limiter (Prevent Brute Force on Login / Register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts from this IP, please try again after 15 minutes' }
});

// 4. Contact Form Limiter (Prevent Email Flooding / Gmail Quota Exhaustion)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many contact submissions from this IP, please try again after 15 minutes' }
});

// 5. Public Read Endpoint Limiter (Permits healthy crawler throughput and catalog browsing)
const publicReadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method !== 'GET',
  message: { message: 'Too many catalog requests from this IP, please try again shortly.' }
});

module.exports = { apiLimiter, orderLimiter, authLimiter, contactLimiter, publicReadLimiter };
