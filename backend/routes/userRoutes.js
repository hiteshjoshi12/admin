const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  authUser, 
  saveAddress, 
  updateAddress,
  deleteAddress 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// --- AUTHENTICATION ---
router.post('/', registerUser);         // Matches POST /api/users (Register)
router.post('/login', authUser);        // Matches POST /api/users/login (Login)

// --- ADDRESS MANAGEMENT ---
router.post('/profile/address', protect, saveAddress);       
router.put('/profile/address/:id', protect, updateAddress);  
router.delete('/profile/address/:id', protect, deleteAddress); 

module.exports = router;