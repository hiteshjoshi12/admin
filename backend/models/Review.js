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
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  isApproved: { type: Boolean, default: false } // Moderation flag
}, {
  timestamps: true,
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;