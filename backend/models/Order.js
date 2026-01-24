const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Link to the user who placed the order
  },
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      size: { type: Number, required: true }, // Important for Juttis
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
    country: { type: String, required: true },
    phoneNumber: { type: String, required: true }, // Shiprocket needs this
  },
  // --- RAZORPAY PAYMENT INFO ---
  paymentResult: {
    id: { type: String },           // Razorpay Payment ID
    status: { type: String },       // 'captured', 'failed'
    update_time: { type: String },
    email_address: { type: String },
  },
  paymentMethod: {
    type: String,
    required: true, // "Razorpay" or "COD"
  },
  // --- MONEY ---
  itemPrice: { type: Number, required: true, default: 0.0 },
  taxPrice: { type: Number, required: true, default: 0.0 },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  
  // --- STATUS TRACKING ---
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
  // --- SHIPROCKET INTEGRATION ---
  shiprocketOrderId: { type: String }, // To track internal Shiprocket ID
  awbCode: { type: String },           // Air Waybill Number (Tracking)
  
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);