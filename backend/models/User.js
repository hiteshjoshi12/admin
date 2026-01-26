const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // <--- 1. Import crypto

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
  
  // Existing Field: Array of Addresses
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
  ],

  // --- 2. NEW FIELDS FOR PASSWORD RESET ---
  resetPasswordToken: String,
  resetPasswordExpire: Date

}, {
  timestamps: true,
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- 3. NEW METHOD: Generate Reset Token ---
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Password Hash Middleware
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;