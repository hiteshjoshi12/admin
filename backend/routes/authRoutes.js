const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Auth user & get token & MERGE CART
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password, localCart } = req.body; // Expect localCart from frontend

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      
      // --- CART MERGE LOGIC ---
      if (localCart && localCart.length > 0) {
        // 1. Get current DB cart
        let dbCart = user.cart || [];

        // 2. Iterate through local cart items
        localCart.forEach(localItem => {
          const existingItemIndex = dbCart.findIndex(
            dbItem => dbItem.productId.toString() === localItem.id && dbItem.size === localItem.size
          );

          if (existingItemIndex > -1) {
            // Item exists? Sum quantity
            dbCart[existingItemIndex].quantity += localItem.quantity;
          } else {
            // New item? Push it (Ensure field names match Schema)
            dbCart.push({
              productId: localItem.id,
              name: localItem.name, // Storing name/image in DB for easier access (optional but helpful)
              image: localItem.image,
              price: localItem.price,
              size: localItem.size,
              quantity: localItem.quantity
            });
          }
        });

        // 3. Save merged cart
        user.cart = dbCart;
        await user.save();
      }
      
      // Return User + Final Merged Cart
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        cart: user.cart, // Send the merged cart back to frontend
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Register user & MERGE CART
// @route   POST /api/auth/signup
router.post('/signup', async (req, res) => {
  // 1. Accept localCart from the request body
  const { name, email, password, localCart } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Create the User (initially empty cart)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 3. If there was a Local Cart, format it and save to the new User
    if (user && localCart && localCart.length > 0) {
      // Map frontend items to match Mongoose schema structure
      const dbCart = localCart.map(item => ({
        productId: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        size: item.size,
        quantity: item.quantity
      }));
      
      user.cart = dbCart;
      await user.save(); // Save the update
    }

    // 4. Send response (include the cart so Redux can update)
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        cart: user.cart, // <--- IMPORTANT: Send back the merged cart
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;