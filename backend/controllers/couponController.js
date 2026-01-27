const Coupon = require('../models/Coupon');

// @desc    Get all coupons
// @route   GET /api/coupons
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a coupon
// @route   POST /api/coupons
const createCoupon = async (req, res) => {
  const { code, discountType, discountAmount, description, expirationDate } = req.body;
  
  try {
    const couponExists = await Coupon.findOne({ code });
    if (couponExists) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code,
      discountType,
      discountAmount,
      description,
      expirationDate
    });

    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ message: 'Invalid coupon data' });
  }
};

// @desc    Toggle coupon status
// @route   PATCH /api/coupons/:id/toggle
const toggleCouponStatus = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      coupon.isActive = !coupon.isActive;
      await coupon.save();
      res.json(coupon);
    } else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      await coupon.deleteOne();
      res.json({ message: 'Coupon removed' });
    } else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ... existing imports

// @desc    Verify Coupon (Public)
// @route   POST /api/coupons/verify
const verifyCoupon = async (req, res) => {
  const { code, cartTotal } = req.body;
  
  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    if (new Date() > new Date(coupon.expirationDate)) {
      return res.status(400).json({ message: 'This coupon has expired' });
    }

    // Calculate Discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountAmount) / 100;
    } else {
      discountAmount = coupon.discountAmount; // Fixed amount
    }

    // Cap discount at total amount (can't be negative)
    if (discountAmount > cartTotal) discountAmount = cartTotal;

    res.json({
      code: coupon.code,
      discountAmount: Math.round(discountAmount),
      type: coupon.discountType,
      value: coupon.discountAmount
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Validation Error' });
  }
};

// Add this new function
const updateCoupon = async (req, res) => {
  const { code, discountType, discountAmount, description, expirationDate } = req.body;
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    coupon.code = code || coupon.code;
    coupon.discountType = discountType || coupon.discountType;
    coupon.discountAmount = discountAmount || coupon.discountAmount;
    coupon.description = description || coupon.description;
    coupon.expirationDate = expirationDate || coupon.expirationDate;

    await coupon.save();
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Update failed' });
  }
};

// @desc    Get active coupons for storefront
// @route   GET /api/coupons/active
// @access  Public
const getStorefrontCoupons = async (req, res) => {
  try {
    // Only fetch valid, active coupons
    const coupons = await Coupon.find({ 
      isActive: true,
      expirationDate: { $gte: new Date() } // Not expired
    }).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Don't forget to export it!
module.exports = { 
  getCoupons, createCoupon, toggleCouponStatus, deleteCoupon, verifyCoupon, updateCoupon,
  getStorefrontCoupons // <--- Export this
};




