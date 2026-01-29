const express = require('express');
const router = express.Router();
const { 
    getAllReviews,
    getProductReviews, 
    createReview, 
    approveReview,
    deleteReview,
    updateReview // <--- 1. Import the new controller
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

// Admin: Get All Reviews
router.get('/admin/all', protect, admin, getAllReviews);

// Public/User Routes (Product Context)
router.route('/:productId')
  .get(getProductReviews)
  .post(protect, createReview);

// Admin Action Routes (Specific Review Context)
router.route('/:reviewId/approve').put(protect, admin, approveReview);

// Shared Route for Single Review Operations
// DELETE = Admin only (Remove spam)
// PUT    = User only (Edit their own review)
router.route('/:reviewId')
  .delete(protect, admin, deleteReview)
  .put(protect, updateReview); // <--- 2. Add the PUT route here

module.exports = router;