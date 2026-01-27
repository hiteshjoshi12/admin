const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  authUser, 
  saveAddress, 
  updateAddress,
  deleteAddress,
  getUsers,
  deleteUser,
  forgotPassword,
  resetPassword,
  syncCart
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// 1. ROOT ROUTE ('/api/users')
// - POST: Register a new user (Public)
// - GET:  Get all users (Admin Only)
router.route('/')
  .post(registerUser)
  .get(protect, admin, getUsers);

// 2. AUTHENTICATION ROUTES
router.post('/login', authUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

// 3. CART ROUTE
router.put('/cart', protect, syncCart);

// 4. ADDRESS ROUTES
router.post('/profile/address', protect, saveAddress);
router.put('/profile/address/:id', protect, updateAddress);
router.delete('/profile/address/:id', protect, deleteAddress); 

// 5. ID ROUTE ('/api/users/:id')
// Always keep parameterized routes (/:id) at the BOTTOM to avoid conflicts
router.route('/:id')
  .delete(protect, admin, deleteUser);

module.exports = router;