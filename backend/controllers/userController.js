const User = require('../models/User');


// @desc    Register a new user
// ... (Keep registerUser and authUser same as before) ...
const registerUser = async (req, res) => { /* ... existing code ... */ };
const authUser = async (req, res) => { /* ... existing code ... */ };

// @desc    Save User Address
// @route   POST /api/users/profile/address
// @access  Private
const saveAddress = async (req, res) => {
  const { address, city, postalCode, phoneNumber, country } = req.body;

  const user = await User.findById(req.user._id);

  if (user) {
    // Check if this is the first address being added
    const isFirstAddress = user.addresses.length === 0;

    const newAddress = {
      address,
      city,
      postalCode,
      country,
      phoneNumber,
      isPrimary: isFirstAddress // True if first, else False
    };

    user.addresses.push(newAddress);
    await user.save();

    // Return updated user info so Frontend Redux can update immediately
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      cart: user.cart,
      addresses: user.addresses, // <--- Return the new list
      token: req.headers.authorization.split(' ')[1] // Keep the same token
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

module.exports = { registerUser, authUser, saveAddress };