const express = require('express');
const router = express.Router();
const { getBestSellers, setBestSeller } = require('../controllers/bestSellerController');
const { protect } = require('../middleware/authMiddleware'); // Assuming you want protection for adding

router.route('/')
  .get(getBestSellers)
  .post(protect, setBestSeller); // Only logged-in admins should set this

module.exports = router;