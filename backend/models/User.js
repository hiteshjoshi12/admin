const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define Address Schema
const addressSchema = mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: 'India' },
  phoneNumber: { type: String, required: true },
  isPrimary: { type: Boolean, default: false }
});

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
  
  // New Field: Array of Addresses
  addresses: [addressSchema], 

  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      image: String,
      price: Number,
      size: Number,
      quantity: Number
    }
  ]
}, {
  timestamps: true,
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- FIX IS HERE ---
// 1. Removed 'next' from arguments (async functions don't need it in new Mongoose)
// 2. Added 'return' inside the if-statement to stop execution
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return; // Just return, don't call next()
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;