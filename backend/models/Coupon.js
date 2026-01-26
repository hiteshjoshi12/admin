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
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Coupon', couponSchema);