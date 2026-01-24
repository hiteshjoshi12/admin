const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  originalPrice: { type: Number, default: 0 },
  category: { type: String, required: true },
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  
  // --- NEW STRUCTURE ---
  // Instead of just 'sizes: []' and 'countInStock: 0'
  stock: [
    {
      size: { type: Number, required: true },
      quantity: { type: Number, required: true, default: 0 }
    }
  ],
  // We keep this purely for easier filtering/sorting, 
  // but it will be the SUM of all quantities in the stock array
  totalStock: { type: Number, required: true, default: 0 } 
  // ---------------------

}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;