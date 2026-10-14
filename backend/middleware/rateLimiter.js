const rateLimit = require('express-rate-limit');

// 1. General API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// 2. Sensitive Order Placement Limiter (Prevent Inventory Drain / Fake Bots)
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 order creation attempts per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many orders attempted from this IP, please try again after 15 minutes' }
});

// 3. Auth Limiter (Prevent Brute Force on Login / Register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 auth attempts per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts from this IP, please try again after 15 minutes' }
});

// 4. Contact Form Limiter (Prevent Email Flooding / Gmail Quota Exhaustion)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 contact messages per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many contact submissions from this IP, please try again after 15 minutes' }
});

module.exports = { apiLimiter, orderLimiter, authLimiter, contactLimiter };
