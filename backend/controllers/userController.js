const User = require("../models/User");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("../utils/sendEmail");

// --- HELPER: GENERATE TOKEN ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// --- HELPER: ENRICH CART (PERFORMANCE OPTIMIZED) ---
// 🚀 FIX: Uses 1 DB Call instead of N calls (avoids N+1 problem)
const enrichCartItems = async (cartItems) => {
  if (!cartItems || cartItems.length === 0) return [];

  // 1. Extract all IDs first
  const productIds = cartItems
    .map((item) => item.productId || item.id || item._id)
    .filter((id) => id); // Remove null/undefined

  // 2. Fetch all products in ONE query
  const products = await Product.find({ _id: { $in: productIds } });
  
  // 3. Create a Map for instant lookup (O(1) complexity)
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  const enrichedItems = [];

  for (const item of cartItems) {
    const productId = item.productId || item.id || item._id;
    if (!productId) continue;

    // Get product from Map (No await needed here)
    const product = productMap.get(productId.toString());
    if (!product) continue; // Skip if product was deleted

    // Find Max Stock
    let currentMaxStock = 0;
    const sizeVariant = product.stock.find(
      (s) => s.size.toString() === item.size.toString()
    );

    if (sizeVariant) {
      currentMaxStock = sizeVariant.quantity;
    }

    enrichedItems.push({
      id: productId.toString(), // Map to 'id' for frontend
      name: product.name,
      image: product.images[0], // Fresh image
      price: product.price,     // Fresh price
      size: item.size,
      quantity: item.quantity,
      maxStock: currentMaxStock,
    });
  }

  return enrichedItems;
};

// --------------------------------------------------------------------------
// AUTH CONTROLLERS
// --------------------------------------------------------------------------

// @desc    Register & Merge Cart
// @route   POST /api/users/register
const registerUser = async (req, res) => {
  const { name, email, password, localCart } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 1. Prepare Cart Data if Local Cart exists
    let initialCart = [];
    if (localCart && localCart.length > 0) {
      initialCart = localCart.map((item) => ({
        productId: item.id || item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        size: item.size,
        quantity: item.quantity,
      }));
    }

    const user = await User.create({
      name,
      email,
      password,
      cart: initialCart, // Save cart immediately on creation
    });

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

// @desc    Login & Merge Cart
// @route   POST /api/users/login
const authUser = async (req, res) => {
  const { email, password, localCart } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      
      // --- SMART CART MERGE LOGIC ---
      if (localCart && localCart.length > 0) {
        // Create a Map of existing DB items for easy lookup
        // Key format: "ProductId-Size" (e.g., "12345-8")
        const dbCartMap = new Map(
            user.cart.map(item => [`${item.productId}-${item.size}`, item])
        );

        localCart.forEach(localItem => {
            const pid = localItem.id || localItem.productId;
            if(!pid) return;
            
            const key = `${pid}-${localItem.size}`;
            
            if (dbCartMap.has(key)) {
                // If item exists, sum quantities
                const existingItem = dbCartMap.get(key);
                existingItem.quantity += localItem.quantity;
            } else {
                // If new, add to user cart array
                user.cart.push({
                    productId: pid,
                    name: localItem.name,
                    image: localItem.image,
                    price: localItem.price,
                    size: localItem.size,
                    quantity: localItem.quantity
                });
            }
        });

        await user.save();
      }
      // -----------------------------

      // 1. Get Enriched Cart (Removes deleted products automatically)
      const enrichedCart = await enrichCartItems(user.cart);

      // 2. OPTIONAL: Heal the Database
      // If the enriched cart length is different from DB cart length, 
      // it means some items were deleted from the DB. Save the clean version.
      if (enrichedCart.length !== user.cart.length) {
         user.cart = enrichedCart.map(item => ({
             productId: item.id,
             name: item.name,
             image: item.image,
             price: item.price,
             size: item.size,
             quantity: item.quantity
         }));
         await user.save();
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        cart: enrichedCart,
        addresses: user.addresses,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sync Cart (Full Overwrite)
// @route   PUT /api/users/cart
const syncCart = async (req, res) => {
  const { cart } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Map frontend 'id' back to backend 'productId' schema
      const dbCart = cart.map((item) => ({
        productId: item.id || item.productId || item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        size: item.size,
        quantity: item.quantity,
      }));

      user.cart = dbCart;
      await user.save();

      // Return enriched so frontend has maxStock limits
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

// ... [Keep your Address, Delete, and Password Reset controllers as they were] ...
// They were correctly implemented.

const saveAddress = async (req, res) => {
  const { address, city, state, postalCode, phoneNumber, country } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    const isFirstAddress = user.addresses.length === 0;
    const newAddress = { address, city, state, postalCode, country, phoneNumber, isPrimary: isFirstAddress };
    
    user.addresses.push(newAddress);
    await user.save();

    // We must return the full profile structure for Redux
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
  const { address, city, state, postalCode, phoneNumber, country, isPrimary } = req.body;
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
      
      if (typeof isPrimary !== "undefined") addressToUpdate.isPrimary = isPrimary;

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
    user.addresses = user.addresses.filter((addr) => addr._id.toString() !== req.params.id);
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
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
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

    const frontendUrl = process.env.FRONTEND_URL_PROD || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/resetpassword/${resetToken}`;
    
    // HTML Message for better email look
    const message = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Please click the link below:</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        message, // Send as HTML if your sendEmail supports it, otherwise text
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

    res.status(201).json({ success: true, message: "Password Updated Success" });
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