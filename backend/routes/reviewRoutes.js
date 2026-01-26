const express = require('express');
const router = express.Router();
const { 
    getAllReviews,
    getProductReviews, 
    createReview, 
    approveReview,
    deleteReview
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

// Admin: Get All Reviews (Place this BEFORE /:productId to avoid route conflicts)
router.get('/admin/all', protect, admin, getAllReviews);

// Public/User Routes
router.route('/:productId')
  .get(getProductReviews)
  .post(protect, createReview);

// Admin Action Routes
router.route('/:reviewId/approve').put(protect, admin, approveReview);
router.route('/:reviewId').delete(protect, admin, deleteReview);

module.exports = router;