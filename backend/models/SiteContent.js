const mongoose = require('mongoose');

const siteContentSchema = mongoose.Schema({
  // Changed from single 'hero' object to 'heroSlides' array
  heroSlides: [
    {
      image: { type: String, required: true },
      title: { type: String, default: "Handcrafted Luxury" },
      subtitle: { type: String, default: "New Collection" },
      cta: { type: String, default: "Shop Now" },
      link: { type: String, default: "/shop" }
    }
  ],
  instagram: {
    photo1: { type: String },
    photo2: { type: String },
    reel: { type: String },
    handle: { type: String, default: "@beadsnbloom.india" }
  }
}, {
  timestamps: true,
});

const SiteContent = mongoose.model('SiteContent', siteContentSchema);
module.exports = SiteContent;