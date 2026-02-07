const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  // 1. User Info (Hybrid: User OR Guest)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'User',
  },
  guestInfo: {
    name: { type: String },
    email: { type: String }
  },

  // 2. Order Items
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      size: { type: Number, required: true }, 
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
    },
  ],

  // 3. Shipping Details
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    state: { type: String, required: true }, 
    country: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  
  // 4. Payment & Price Breakdown
  paymentMethod: { type: String, required: true },
  
  itemPrice: { type: Number, required: true, default: 0.0 },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  
  // 🚨 NEW FIELDS REQUIRED FOR ACCURATE MATH
  discountAmount: { type: Number, default: 0.0 }, 
  couponCode: { type: String },

  totalPrice: { type: Number, required: true, default: 0.0 },
  
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  
  // Razorpay
  razorpayOrderId: { type: String }, 
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },

  // ... (Your existing Fulfillment & Shiprocket fields) ...
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);