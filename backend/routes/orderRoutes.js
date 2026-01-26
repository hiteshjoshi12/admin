const express = require('express');
const router = express.Router();
const { 
  addOrderItems, 
  getOrderById, 
  updateOrderToPaid, 
  updateOrderToDelivered, 
  getMyOrders, 
  getOrders 
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route: /api/orders
// POST: Create Order (User)
// GET: Get All Orders (Admin)
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

// Route: /api/orders/myorders
// GET: Get Logged In User's Orders
router.route('/myorders').get(protect, getMyOrders);

// Route: /api/orders/:id
// GET: Get Single Order Details
router.route('/:id').get(protect, getOrderById);

// Route: /api/orders/:id/pay
// PUT: Mark Order as Paid (After Razorpay success)
router.route('/:id/pay').put(protect, updateOrderToPaid);

// Route: /api/orders/:id/deliver
// PUT: Mark Order as Delivered (Admin Only)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;