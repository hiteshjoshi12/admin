const express = require('express');
const router = express.Router();
const { saveAddress } = require('../controllers/userController'); // Import the controller we made
const { protect } = require('../middleware/authMiddleware'); // Import auth middleware

// Define the route
router.post('/profile/address', protect, saveAddress);

module.exports = router;