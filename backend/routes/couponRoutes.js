const express = require('express');
const router = express.Router();
const { getCoupons, createCoupon, toggleCouponStatus, deleteCoupon, verifyCoupon, updateCoupon } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getCoupons)
  .post(protect, admin, createCoupon);

router.route('/:id/toggle').patch(protect, admin, toggleCouponStatus);
router.route('/:id')
  .delete(protect, admin, deleteCoupon)
  .put(protect, admin, updateCoupon); // <--- Add PUT here

router.post('/verify', verifyCoupon);



module.exports = router;