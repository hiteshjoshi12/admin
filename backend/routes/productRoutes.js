const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductBySlug, 
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
  migrateSlugs
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// 1. PUBLIC LIST
router.route('/').get(getProducts).post(protect, admin, createProduct);

// 2. MAINTENANCE (Run this once in your browser at /api/products/migrate)
router.get('/migrate', protect, admin, migrateSlugs);

// 3. PUBLIC DETAIL (Uses Slug)
router.get('/:slug', getProductBySlug);

// 4. ADMIN DETAIL (Uses ID)
router.route('/admin/:id')
  .get(protect, admin, getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;