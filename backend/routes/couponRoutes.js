const express = require('express');
const router = express.Router();
const { 
  getCoupons, 
  createCoupon, 
  toggleCouponStatus, 
  deleteCoupon, 
  verifyCoupon, 
  updateCoupon,
  getStorefrontCoupons 
} = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

// --- 1. STATIC ROUTES (MUST BE AT TOP) ---
// If these are at the bottom, '/:id' will catch them by mistake
router.post('/verify', verifyCoupon);
router.get('/active', getStorefrontCoupons);

// --- 2. ROOT ROUTE ---
router.route('/')
  .get(protect, admin, getCoupons)
  .post(protect, admin, createCoupon);

// --- 3. DYNAMIC ID ROUTES (MUST BE AT BOTTOM) ---
router.route('/:id/toggle').patch(protect, admin, toggleCouponStatus);

router.route('/:id')
  .delete(protect, admin, deleteCoupon)
  .put(protect, admin, updateCoupon);

module.exports = router;