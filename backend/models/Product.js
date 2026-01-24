const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  baseMaterial: { type: String, required: true }, // "Pure Silk", "Pure Crepe"
  craftsmanship: { type: String, required: true }, // "Hand-done Dabka..."
  
  price: { type: Number, required: true },
  originalPrice: { type: Number }, // Optional (for sale items)
  
  images: [{ type: String, required: true }], // Array of Cloudinary URLs
  sizes: [{ type: Number, required: true }], // [36, 37, 38...]
  
  category: { type: String, required: true }, // "Bridal", "Everyday"
  countInStock: { type: Number, required: true, default: 10 },
  
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);