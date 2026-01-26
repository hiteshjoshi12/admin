const mongoose = require('mongoose');

const bestSellerSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Links to your main Product model
    required: true
  },
  tag: {
    type: String, 
    required: true, // e.g., "The Icon", "Trending Now"
  },
  position: {
    type: Number,
    required: true,
    unique: true, // Ensures you only have one product per slot (1, 2, or 3)
    enum: [1, 2, 3] // Strictly enforces our 3-grid layout
  }
}, {
  timestamps: true,
});

const BestSeller = mongoose.model('BestSeller', bestSellerSchema);
module.exports = BestSeller;