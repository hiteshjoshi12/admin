const express = require('express');
const router = express.Router();
const { getProductReviews, createReview, approveReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Public: Get reviews | Private: Add review
router.route('/:productId')
  .get(getProductReviews)
  .post(protect, createReview);

// Admin: Approve review
router.route('/:reviewId/approve').put(protect,  approveReview);

module.exports = router;