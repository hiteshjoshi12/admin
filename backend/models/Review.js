const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product', // Links to your existing Product model
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: { type: String, required: true },
  title: { type: String, default: '' },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  images: [{ type: String }], // Optional customer-uploaded product photos
  isVerifiedPurchase: { type: Boolean, default: false }, // Verified buyer indicator
  purchasedSize: { type: String, default: '' },
  helpfulVotes: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false } // Moderation flag
}, {
  timestamps: true,
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;