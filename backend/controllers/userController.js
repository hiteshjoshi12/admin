const User = require("../models/User");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendEmail } = require("../utils/sendEmail");

// --- HELPER: GENERATE TOKEN ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "2d" });
};

// --- HELPER: ENRICH CART & AUTO-CLEANUP ---
// This function fixes the "0 quantity" and "missing ID" bugs
const enrichCartItems = async (cartItems) => {
  if (!cartItems || cartItems.length === 0) return [];

  const enrichedItems = [];

  for (const item of cartItems) {
    // 1. Resolve ID (Handle _id vs productId mismatch)
    const productId = item.productId || item.id || item._id;
    if (!productId) continue; // Skip corrupted items

    // 2. Fetch Product
    const product = await Product.findById(productId);
    if (!product) continue; // Skip items if product was deleted

    // 3. Find Max Stock
    let currentMaxStock = 0;
    // Convert both to String for safe comparison
    const sizeVariant = product.stock.find(
      (s) => s.size.toString() === item.size.toString(),
    );

    if (sizeVariant) {
      currentMaxStock = sizeVariant.quantity;
    }

    // 4. Push Enriched Item (Mapping 'productId' -> 'id' for Frontend)
    enrichedItems.push({
      id: productId.toString(),
      name: product.name, // Always use fresh name from Product DB
      image: product.images[0], // Always use fresh image
      price: product.price, // Always use fresh price
      size: item.size,
      quantity: item.quantity,
      maxStock: currentMaxStock,
    });
  }

  return enrichedItems;
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
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user && localCart && localCart.length > 0) {
      const dbCart = localCart.map((item) => ({
        productId: item.id || item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        size: item.size,
        quantity: item.quantity,
      }));
      user.cart = dbCart;
      await user.save();
    }

    if (user) {
      const enrichedCart = await enrichCartItems(user.cart);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        cart: enrichedCart,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
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
      // Merge Local Cart Logic
      if (localCart && localCart.length > 0) {
        let dbCart = user.cart || [];

        localCart.forEach((localItem) => {
          const validId = localItem.id || localItem.productId; // Robust ID check
          if (!validId) return;

          const existingItemIndex = dbCart.findIndex(
            (dbItem) =>
              dbItem.productId.toString() === validId &&
              dbItem.size.toString() === localItem.size.toString(),
          );

          if (existingItemIndex > -1) {
            dbCart[existingItemIndex].quantity += localItem.quantity;
          } else {
            dbCart.push({
              productId: validId,
              name: localItem.name,
              image: localItem.image,
              price: localItem.price,
              size: localItem.size,
              quantity: localItem.quantity,
            });
          }
        });

        user.cart = dbCart;
        await user.save();
      }

      // 🚨 CRITICAL FIX: Enrich Cart & Auto-Clean DB
      // This removes "ghost" items from the response
      const enrichedCart = await enrichCartItems(user.cart);

      // Optional: Save the clean cart back to DB to permanently fix corruption
      // user.cart = enrichedCart.map(item => ({
      //   productId: item.id,
      //   name: item.name,
      //   image: item.image,
      //   price: item.price,
      //   size: item.size,
      //   quantity: item.quantity
      // }));
      // await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        cart: enrichedCart, // Send clean, enriched cart
        token: generateToken(user._id),
        addresses: user.addresses,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ... [Keep Address Controllers, Forgot Password, etc. exactly as they were] ...

// @desc    Save User Address
// @route   POST /api/users/profile/address
const saveAddress = async (req, res) => {
  const { address, city, state, postalCode, phoneNumber, country } = req.body;

  const user = await User.findById(req.user._id);

  if (user) {
    const isFirstAddress = user.addresses.length === 0;
    const newAddress = {
      address,
      city,
      state,
      postalCode,
      country,
      phoneNumber,
      isPrimary: isFirstAddress,
    };
    user.addresses.push(newAddress);
    await user.save();

    const enrichedCart = await enrichCartItems(user.cart);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      cart: enrichedCart,
      addresses: user.addresses,
      token: req.headers.authorization.split(" ")[1],
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

const updateAddress = async (req, res) => {
  const { address, city, state, postalCode, phoneNumber, country, isPrimary } =
    req.body;
  const addressId = req.params.id;
  const user = await User.findById(req.user._id);

  if (user) {
    const addressToUpdate = user.addresses.id(addressId);
    if (addressToUpdate) {
      if (isPrimary) user.addresses.forEach((addr) => (addr.isPrimary = false));

      addressToUpdate.address = address || addressToUpdate.address;
      addressToUpdate.city = city || addressToUpdate.city;
      addressToUpdate.state = state || addressToUpdate.state;
      addressToUpdate.postalCode = postalCode || addressToUpdate.postalCode;
      addressToUpdate.phoneNumber = phoneNumber || addressToUpdate.phoneNumber;
      addressToUpdate.country = country || addressToUpdate.country;
      if (typeof isPrimary !== "undefined")
        addressToUpdate.isPrimary = isPrimary;

      await user.save();
      const enrichedCart = await enrichCartItems(user.cart);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        cart: enrichedCart,
        addresses: user.addresses,
        token: req.headers.authorization.split(" ")[1],
      });
    } else {
      res.status(404);
      throw new Error("Address not found");
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

const deleteAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== req.params.id,
    );
    await user.save();
    const enrichedCart = await enrichCartItems(user.cart);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      cart: enrichedCart,
      addresses: user.addresses,
      token: req.headers.authorization.split(" ")[1],
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.isAdmin) {
        res.status(400);
        throw new Error("Cannot delete admin user");
      }
      await user.deleteOne();
      res.json({ message: "User removed" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const frontendUrl =
      process.env.FRONTEND_URL_PROD || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/resetpassword/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click the button below to set a new password.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        title: "Reset Your Password",
        message,
        url: resetUrl,
        buttonText: "Reset Password",
      });
      res.status(200).json({ success: true, data: "Email sent" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      res.status(500);
      throw new Error("Email could not be sent");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      res.status(400);
      throw new Error("Invalid or Expired Token");
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res
      .status(201)
      .json({ success: true, message: "Password Updated Success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sync User Cart
// @desc    Sync User Cart
// @route   PUT /api/users/cart
// @access  Private
const syncCart = async (req, res) => {
  const { cart } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // 🚨 CRITICAL FIX: Map frontend 'id' to backend 'productId'
      // Mongoose strict mode drops 'id' if we don't map it to the schema field.
      const dbCart = cart.map((item) => ({
        productId: item.id || item.productId || item._id, // Ensure we catch the ID
        name: item.name,
        image: item.image,
        price: item.price,
        size: item.size,
        quantity: item.quantity,
      }));

      user.cart = dbCart; // Save the correctly mapped array
      await user.save();

      // Return enriched cart so frontend stays perfectly synced
      const enrichedCart = await enrichCartItems(user.cart);
      res.json(enrichedCart);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
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
  resetPassword,
  syncCart,
};
