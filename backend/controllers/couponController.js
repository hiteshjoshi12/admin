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
  const { 
    code, 
    discountType, 
    discountAmount, 
    description, 
    expirationDate,
    minOrderAmount,
    excludeNewArrivals,
    applicableCategories,
    bannerText,
    terms,
    showOnProductPage
  } = req.body;
  
  try {
    const couponExists = await Coupon.findOne({ code: String(code || '').trim().toUpperCase() });
    if (couponExists) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const categoriesArray = Array.isArray(applicableCategories)
      ? applicableCategories.map(c => String(c).trim()).filter(Boolean)
      : (typeof applicableCategories === 'string' && applicableCategories.trim())
        ? applicableCategories.split(',').map(c => c.trim()).filter(Boolean)
        : [];

    const coupon = await Coupon.create({
      code: String(code || '').trim().toUpperCase(),
      discountType,
      discountAmount: Number(discountAmount),
      description: String(description || '').trim(),
      expirationDate,
      minOrderAmount: Math.max(0, Number(minOrderAmount) || 0),
      excludeNewArrivals: Boolean(excludeNewArrivals),
      applicableCategories: categoriesArray,
      bannerText: String(bannerText || '').trim(),
      terms: String(terms || '').trim(),
      showOnProductPage: showOnProductPage !== undefined ? Boolean(showOnProductPage) : true
    });

    res.status(201).json(coupon);
  } catch (error) {
    const message = error.errors
      ? Object.values(error.errors).map(e => e.message).join(', ')
      : error.message || 'Invalid coupon data';
    res.status(400).json({ message });
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

// @desc    Verify Coupon (Public)
// @route   POST /api/coupons/verify
const verifyCoupon = async (req, res) => {
  const { code, cartTotal, hasNewArrivals } = req.body;
  
  try {
    const coupon = await Coupon.findOne({ code: String(code || '').trim().toUpperCase(), isActive: true });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    if (new Date() > new Date(coupon.expirationDate)) {
      return res.status(400).json({ message: 'This coupon has expired' });
    }

    // Minimum Order Validation
    const total = Number(cartTotal) || 0;
    if (coupon.minOrderAmount && total < coupon.minOrderAmount) {
      return res.status(400).json({ 
        message: `Minimum cart value of ₹${coupon.minOrderAmount.toLocaleString()} required for code ${coupon.code}` 
      });
    }

    // New Arrivals Exclusion Rule
    if (hasNewArrivals && coupon.excludeNewArrivals) {
      return res.status(400).json({
        message: `Coupon ${coupon.code} excludes New Arrival products.`
      });
    }

    // Calculate Discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (total * coupon.discountAmount) / 100;
    } else {
      discountAmount = coupon.discountAmount; // Fixed amount
    }

    // Cap discount at total amount (can't be negative)
    if (discountAmount > total) discountAmount = total;

    res.json({
      code: coupon.code,
      discountAmount: Math.round(discountAmount),
      type: coupon.discountType,
      value: coupon.discountAmount,
      terms: coupon.terms,
      minOrderAmount: coupon.minOrderAmount
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Validation Error' });
  }
};

// @desc    Update an existing coupon
// @route   PUT /api/coupons/:id
const updateCoupon = async (req, res) => {
  const { 
    code, 
    discountType, 
    discountAmount, 
    description, 
    expirationDate,
    minOrderAmount,
    excludeNewArrivals,
    applicableCategories,
    bannerText,
    terms,
    showOnProductPage 
  } = req.body;

  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    if (code) coupon.code = String(code).trim().toUpperCase();
    if (discountType) coupon.discountType = discountType;
    if (discountAmount !== undefined) coupon.discountAmount = Number(discountAmount);
    if (description !== undefined) coupon.description = String(description).trim();
    if (expirationDate) coupon.expirationDate = expirationDate;
    if (minOrderAmount !== undefined) coupon.minOrderAmount = Math.max(0, Number(minOrderAmount) || 0);
    if (excludeNewArrivals !== undefined) coupon.excludeNewArrivals = Boolean(excludeNewArrivals);
    if (bannerText !== undefined) coupon.bannerText = String(bannerText).trim();
    if (terms !== undefined) coupon.terms = String(terms).trim();
    if (showOnProductPage !== undefined) coupon.showOnProductPage = Boolean(showOnProductPage);

    if (applicableCategories !== undefined) {
      coupon.applicableCategories = Array.isArray(applicableCategories)
        ? applicableCategories.map(c => String(c).trim()).filter(Boolean)
        : (typeof applicableCategories === 'string' && applicableCategories.trim())
          ? applicableCategories.split(',').map(c => c.trim()).filter(Boolean)
          : [];
    }

    await coupon.save();
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Update failed' });
  }
};

// @desc    Get active coupons for storefront (with optional product-level filtering)
// @route   GET /api/coupons/active
// @access  Public
const getStorefrontCoupons = async (req, res) => {
  try {
    const query = { 
      isActive: true,
      expirationDate: { $gte: new Date() } // Not expired
    };

    // If product page indicates this product is a New Arrival, exclude coupons that don't apply
    if (req.query.isNewArrival === 'true') {
      query.excludeNewArrivals = { $ne: true };
    }

    let coupons = await Coupon.find(query).sort({ createdAt: -1 });

    // Filter by category if requested
    if (req.query.category) {
      const targetCategory = String(req.query.category).toLowerCase().trim();
      coupons = coupons.filter(c => {
        if (!c.applicableCategories || c.applicableCategories.length === 0) return true;
        return c.applicableCategories.some(cat => cat.toLowerCase().trim() === targetCategory);
      });
    }

    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { 
  getCoupons, createCoupon, toggleCouponStatus, deleteCoupon, verifyCoupon, updateCoupon,
  getStorefrontCoupons
};




