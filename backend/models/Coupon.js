const mongoose = require('mongoose');

const couponSchema = mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true,
    trim: true
  },
  discountType: { 
    type: String, 
    enum: ['percentage', 'fixed'], 
    required: true 
  },
  discountAmount: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String,
    required: true // e.g. "Festival", "New User"
  },
  expirationDate: { 
    type: Date,
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  // Minimum Order Amount required to redeem
  minOrderAmount: {
    type: Number,
    default: 0
  },
  // If true, this coupon will NOT apply to products marked as isNewArrival
  excludeNewArrivals: {
    type: Boolean,
    default: false
  },
  // Specific categories eligible (empty = all categories)
  applicableCategories: [{
    type: String
  }],
  // Short promo copy shown in product page offer card (e.g. "Flat ₹500 off on bridal orders")
  bannerText: {
    type: String,
    default: ''
  },
  // Detailed terms & exclusions (e.g. "Min cart value ₹2,999. Excludes New Arrivals.")
  terms: {
    type: String,
    default: ''
  },
  showOnProductPage: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Coupon', couponSchema);