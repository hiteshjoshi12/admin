const Order = require('../models/Order');
const Product = require('../models/Product');
const { createShiprocketOrder } = require('../utils/shiprocket');

// @desc    Create new order (With Atomic Stock Validation)
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemPrice,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  // Fallback for price naming variations
  const finalItemPrice = itemPrice !== undefined ? itemPrice : itemsPrice;

  try {
    // 1. EXTRACT PRODUCT IDs & FETCH ALL PRODUCTS IN ONE GO
    const productIds = orderItems.map((item) => item.product || item.id || item._id);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    // Create a map for quick lookup: { "productId": productDoc }
    const productMap = {};
    dbProducts.forEach((p) => {
      productMap[p._id.toString()] = p;
    });

    // 2. VALIDATE STOCK & PREPARE DEDUCTION (In Memory)
    const productsToUpdate = [];

    for (const item of orderItems) {
      const productId = (item.product || item.id || item._id).toString();
      const product = productMap[productId];

      if (!product) {
        throw new Error(`Product not found: ${item.name}`);
      }

      // Find the specific size variant
      const sizeVariant = product.stock.find((s) => s.size === Number(item.size));

      if (!sizeVariant) {
        throw new Error(`Size ${item.size} is invalid for ${item.name}`);
      }

      if (sizeVariant.quantity < item.quantity) {
        throw new Error(`Oops! ${item.name} (Size ${item.size}) is out of stock.`);
      }

      // DEDUCT STOCK (In Memory Only for now)
      sizeVariant.quantity -= item.quantity;
      
      // Update Total Stock Counter
      product.totalStock = product.stock.reduce((acc, s) => acc + s.quantity, 0);
      
      // Mark this product document as ready to save
      if (!productsToUpdate.includes(product)) {
        productsToUpdate.push(product);
      }
    }

    // 3. PERSIST CHANGES TO DATABASE
    await Promise.all(productsToUpdate.map((product) => product.save()));

    // 4. CREATE THE ORDER
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x.product || x.id || x._id,
        _id: undefined, // Ensure no conflicting _ids in subdocuments
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemPrice: finalItemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: false,
      isDelivered: false,
      orderStatus: 'Processing',
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error) {
    const status = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(status).json({ message: error.message || 'Order creation failed' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      
      // Save Payment Gateway Details
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      // Save specific Razorpay fields if provided
      if (req.body.razorpayOrderId) order.razorpayOrderId = req.body.razorpayOrderId;
      if (req.body.razorpayPaymentId) order.razorpayPaymentId = req.body.razorpayPaymentId;
      if (req.body.razorpaySignature) order.razorpaySignature = req.body.razorpaySignature;

      // NOTE: We do NOT auto-ship here anymore. 
      // Admin must click "Ship via Shiprocket" in the dashboard.
      // This is safer to prevent accidental labels.

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Payment update failed' });
  }
};

// --- NEW FUNCTION: SHIP ORDER (The "Ship via Shiprocket" Button) ---
// @desc    Generate Shiprocket Label & Update Order
// @route   PUT /api/orders/:id/ship
// @access  Private/Admin
const shipOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Call your util function (We will build this util next)
    console.log(`Generating Shiprocket Label for ${order._id}...`);
    const shippingData = await createShiprocketOrder(order);
    
    if (shippingData) {
      order.shiprocketOrderId = shippingData.shiprocketOrderId;
      order.shiprocketShipmentId = shippingData.shiprocketShipmentId;
      order.awbCode = shippingData.awbCode;
      
      // Save the courier name (e.g., "BlueDart") so frontend can show it
      order.courierCompanyName = shippingData.courierCompanyName || "Shiprocket";
      
      // Update Status
      order.orderStatus = "Ready to Ship"; 
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
        res.status(400);
        throw new Error('Shiprocket generation failed or returned no data');
    }

  } catch (error) {
    console.error("Shipping Error:", error);
    res.status(500).json({ message: error.message || 'Shipping failed' });
  }
};

// --- NEW FUNCTION: MANUAL STATUS UPDATE (The Dropdown) ---
// @desc    Manually update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    const { status } = req.body; // e.g., "Shipped", "Cancelled"
  
    try {
      const order = await Order.findById(req.params.id);
  
      if (order) {
        order.orderStatus = status;
        
        // Auto-sync isDelivered flag
        if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        } else if (status !== 'Delivered' && order.isDelivered) {
            // Optional: If Admin mistakenly marked delivered, unmark it
            order.isDelivered = false;
            order.deliveredAt = null;
        }
  
        const updatedOrder = await order.save();
        res.json(updatedOrder);
      } else {
        res.status(404);
        throw new Error('Order not found');
      }
    } catch (error) {
      res.status(500).json({ message: 'Status update failed' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update order to delivered (Legacy/Manual Button)
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.orderStatus = "Delivered";

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    res.status(500).json({ message: 'Update failed' });
  }
};

// @desc    Track Order Publicly (No Login Required)
// @route   POST /api/orders/track
// @access  Public
const trackOrderPublic = async (req, res) => {
  const { orderId, email } = req.body;

  try {
    const order = await Order.findById(orderId).populate('user', 'name email');

    // SAFETY CHECK: Use optional chaining (?.) in case the User account was deleted
    // We check if order exists AND user exists AND email matches
    if (order && order.user && order.user.email.toLowerCase() === email.toLowerCase().trim()) {
      res.json({
        _id: order._id,
        createdAt: order.createdAt,
        orderStatus: order.orderStatus,
        isPaid: order.isPaid,
        isDelivered: order.isDelivered,
        deliveredAt: order.deliveredAt,
        awbCode: order.awbCode, 
        
        // UPDATED: Use the stored courier name or fallback
        courierName: order.courierCompanyName || "Shiprocket",
        
        orderItems: order.orderItems, 
        totalPrice: order.totalPrice
      });
    } else {
      res.status(404).json({ message: 'Order details not found. Please check your Order ID and Email.' });
    }
  } catch (error) {
    console.error(error); 
    res.status(404).json({ message: 'Order details not found.' });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  trackOrderPublic,
  shipOrder,         // <--- New
  updateOrderStatus  // <--- New
};