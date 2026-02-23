const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true }, 
  image: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  originalPrice: { type: Number, default: 0 },
  category: { 
    type: [String], 
    required: true,
    index: true 
  },
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  stock: [
    {
      size: { type: String, required: true }, // FIXED: Changed to String to allow "XL", "8.5", etc.
      quantity: { type: Number, required: true, default: 0 }
    }
  ],
  totalStock: { type: Number, required: true, default: 0 } 
}, {
  timestamps: true,
});

productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') 
      .replace(/[\s_]+/g, '-')  
      .replace(/^-+|-+$/g, ''); 
  }
  
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;