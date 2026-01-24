const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have the same email
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false, // Default is a normal customer
  },
  // We can store their cart in the database too so it persists across devices
 cart: [
  {
    productId: { type: String, required: true }, // Keeping as String for flexibility with Redux IDs
    name: { type: String },
    image: { type: String },
    price: { type: Number },
    size: { type: Number },
    quantity: { type: Number, default: 1 }
  }
]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);