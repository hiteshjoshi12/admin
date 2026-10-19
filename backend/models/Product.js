const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true }, 
  oldSlugs: [{ type: String, index: true }], // Preserve old slugs for SEO redirects & zero-404 fallback
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
      size: { type: String, required: true, default: 'Standard' }, // FIXED: Changed to String to allow "XL", "8.5", etc. with default fallback
      quantity: { type: Number, required: true, default: 0 }
    }
  ],
  totalStock: { type: Number, required: true, default: 0 } 
}, {
  timestamps: true,
});

// Performance indexes for storefront catalog & homepage queries
productSchema.index({ isBestSeller: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ price: 1 });

productSchema.pre('save', async function () {
  if (this.isModified('name') || !this.slug) {
    const baseSlug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') 
      .replace(/[\s_-]+/g, '-')  
      .replace(/^-+|-+$/g, ''); 

    let slug = baseSlug;
    let count = 1;
    while (await mongoose.models.Product?.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }
    // Retain previous slug in oldSlugs for backwards compatibility
    if (this.slug && this.slug !== slug) {
      if (!this.oldSlugs) this.oldSlugs = [];
      if (!this.oldSlugs.includes(this.slug)) {
        this.oldSlugs.push(this.slug);
      }
    }
    this.slug = slug;
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;