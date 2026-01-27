const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
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
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    state: { type: String, required: true }, // Required for Shiprocket
    country: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    required: true, 
  },
  
  // --- MONEY ---
  itemPrice: { type: Number, required: true, default: 0.0 },
  taxPrice: { type: Number, required: true, default: 0.0 },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  
  // --- PAYMENT STATUS (Razorpay) ---
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  
  // Security Fields for Razorpay Verification
  razorpayOrderId: { type: String }, 
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },

  // --- FULFILLMENT STATUS ---
  orderStatus: { 
    type: String, 
    required: true, 
    // ENUM: Prevents typos like "shipped" vs "Shipped"
    enum: ['Processing', 'Ready to Ship', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'],
    default: 'Processing', 
  },
  
  isDelivered: { type: Boolean, required: true, default: false },
  deliveredAt: { type: Date },

  // --- SHIPROCKET DATA ---
  shiprocketOrderId: { type: String },      // Shiprocket's internal ID
  shiprocketShipmentId: { type: String },   // Needed to cancel/track shipments
  awbCode: { type: String },                // The Tracking Number (e.g. 789456123)
  courierCompanyName: { type: String },     // <--- NEW: e.g. "Delhivery Surface", "BlueDart"
  
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);