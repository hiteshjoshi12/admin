const express = require('express');
const router = express.Router();
const { 
  addOrderItems, 
  getOrderById, 
  updateOrderToPaid, 
  updateOrderToDelivered, 
  getMyOrders, 
  getOrders, 
  trackOrderPublic,
  shipOrder,
  updateOrderStatus,
  initiateRazorpayPayment, 
  verifyRazorpayPayment,
  handleRazorpayWebhook,
  handleShiprocketWebhook
} = require('../controllers/orderController');
const { protect, admin, optionalProtect, } = require('../middleware/authMiddleware');

// 1. Create & Get All
router.route('/')
  .post(optionalProtect, addOrderItems) // <--- CHANGED THIS
  .get(protect, admin, getOrders);

// 2. User Specific (Must remain protected)
router.route('/myorders').get(protect, getMyOrders);

// 3. Public Webhooks & Tracking
router.post('/track', trackOrderPublic);
router.post('/webhook', handleRazorpayWebhook);
router.post('/delivery-update', handleShiprocketWebhook);

// 4. Single Order Operations
// 🚨 REMOVED 'protect' from getOrderById so Guests can view their order status/receipt
router.route('/:id').get(getOrderById); 

// Legacy manual payment update (keep protected if used by admin/user dashboard only)
router.route('/:id/pay').put(protect, updateOrderToPaid); 
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

// 5. Admin Shipping Operations
router.put('/:id/ship', protect, admin, shipOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);

// 6. Payment Flow (Razorpay)
// 🚨 REMOVED 'protect' so Guests can pay
router.post('/:id/pay/initiate', initiateRazorpayPayment); 
router.put('/:id/pay/verify', verifyRazorpayPayment); 

module.exports = router;