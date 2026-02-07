const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true }, 
  image: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  originalPrice: { type: Number, default: 0 },
  
  // 🚨 CHANGE 1: Array of Strings for Multi-Category Support
  category: { 
    type: [String], 
    required: true,
    index: true // Adds an index for faster filtering by category
  },
  
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  stock: [
    {
      size: { type: Number, required: true },
      quantity: { type: Number, required: true, default: 0 }
    }
  ],
  totalStock: { type: Number, required: true, default: 0 } 
}, {
  timestamps: true,
});

// ✅ Corrected Slug Generator
productSchema.pre('save', function (next) {
  // Only generate slug if name is provided and modified
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_]+/g, '-')  // Replace spaces with hyphens
      .replace(/^-+|-+$/g, ''); // Trim extra hyphens
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;