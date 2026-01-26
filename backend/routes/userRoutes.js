const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  authUser, 
  saveAddress, 
  updateAddress,
  deleteAddress,
  getUsers,     // <--- New
  deleteUser    // <--- New
} = require('../controllers/userController');
const { protect,admin } = require('../middleware/authMiddleware');


// --- AUTHENTICATION ---
router.post('/', registerUser);         // Matches POST /api/users (Register)
router.post('/login', authUser);        // Matches POST /api/users/login (Login)

// --- ADDRESS MANAGEMENT ---
router.post('/profile/address', protect, saveAddress);       
router.put('/profile/address/:id', protect, updateAddress);  
router.delete('/profile/address/:id', protect, deleteAddress); 

// Admin Routes (The new part)
router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .delete(protect, admin, deleteUser);

module.exports = router;