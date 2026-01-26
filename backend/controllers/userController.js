const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// --- HELPER: GENERATE TOKEN ---
// (Normally in utils, but fine to keep here if you don't have a separate file)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// --------------------------------------------------------------------------
// AUTHENTICATION CONTROLLERS
// --------------------------------------------------------------------------

// @desc    Register a new user & Merge Local Cart
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, localCart } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    // Merge Local Cart if exists
    if (user && localCart && localCart.length > 0) {
      const dbCart = localCart.map(item => ({
        productId: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        size: item.size,
        quantity: item.quantity
      }));
      
      user.cart = dbCart;
      await user.save();
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        cart: user.cart,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token & Merge Local Cart
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password, localCart } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Merge Local Cart if exists
      if (localCart && localCart.length > 0) {
        let dbCart = user.cart || [];
        
        localCart.forEach(localItem => {
          const existingItemIndex = dbCart.findIndex(
            dbItem => dbItem.productId.toString() === localItem.id && dbItem.size === localItem.size
          );

          if (existingItemIndex > -1) {
            dbCart[existingItemIndex].quantity += localItem.quantity;
          } else {
            dbCart.push({
              productId: localItem.id,
              name: localItem.name,
              image: localItem.image,
              price: localItem.price,
              size: localItem.size,
              quantity: localItem.quantity
            });
          }
        });

        user.cart = dbCart;
        await user.save();
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        cart: user.cart,
        token: generateToken(user._id),
        addresses: user.addresses, // Send addresses on login
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --------------------------------------------------------------------------
// ADDRESS MANAGEMENT CONTROLLERS
// --------------------------------------------------------------------------

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

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      cart: user.cart,
      addresses: user.addresses,
      token: req.headers.authorization.split(' ')[1] 
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Update an existing address
// @route   PUT /api/users/profile/address/:id
// @access  Private
const updateAddress = async (req, res) => {
  const { address, city, postalCode, phoneNumber, country, isPrimary } = req.body;
  const addressId = req.params.id;

  const user = await User.findById(req.user._id);

  if (user) {
    const addressToUpdate = user.addresses.id(addressId);

    if (addressToUpdate) {
      // If setting as primary, unset previous primary
      if (isPrimary) {
        user.addresses.forEach(addr => addr.isPrimary = false);
      }

      addressToUpdate.address = address || addressToUpdate.address;
      addressToUpdate.city = city || addressToUpdate.city;
      addressToUpdate.postalCode = postalCode || addressToUpdate.postalCode;
      addressToUpdate.phoneNumber = phoneNumber || addressToUpdate.phoneNumber;
      addressToUpdate.country = country || addressToUpdate.country;
      
      // Only update isPrimary if it's passed in body
      if (typeof isPrimary !== 'undefined') {
         addressToUpdate.isPrimary = isPrimary;
      }

      await user.save();
      
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        cart: user.cart,
        addresses: user.addresses,
        token: req.headers.authorization.split(' ')[1]
      });
    } else {
      res.status(404);
      throw new Error('Address not found');
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Delete an address
// @route   DELETE /api/users/profile/address/:id
// @access  Private
const deleteAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== req.params.id
    );

    await user.save();

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        cart: user.cart,
        addresses: user.addresses,
        token: req.headers.authorization.split(' ')[1]
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// ... existing imports ...

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    // Fetch all users but DO NOT return the password field
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.isAdmin) {
        res.status(400);
        throw new Error('Cannot delete admin user');
      }
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ... existing authUser, registerUser ...

// @desc    Forgot Password
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  console.log("Attempting to send email...");
console.log("User:", process.env.EMAIL_USERNAME);
console.log("Pass exists?", !!process.env.EMAIL_PASSWORD);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Get Reset Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create Reset URL (Point to Frontend Route)
    // NOTE: Make sure your frontend runs on localhost:5173 or your domain
    const resetUrl = `${req.protocol}://localhost:5173/resetpassword/${resetToken}`;

    const message = `You have requested a password reset. Please go to this link to create a new password: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message,
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      
      res.status(500);
      throw new Error('Email could not be sent');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password
// @route   PUT /api/users/resetpassword/:resetToken
// @access  Public
const resetPassword = async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // Check if not expired
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid Token');
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save(); // This triggers the pre-save hook to hash password

    res.status(201).json({ success: true, message: 'Password Updated Success' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  registerUser,
  authUser,
  saveAddress,
  updateAddress,
  deleteAddress,
  getUsers,
  deleteUser,
  forgotPassword,
  resetPassword
};