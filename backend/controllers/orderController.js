const Order = require('../models/Order');
const Product = require('../models/Product');
const { createShiprocketOrder } = require('../utils/shiprocket'); // <--- Import Shiprocket Util

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemPrice, // Matched with Schema (singular)
    itemsPrice, // Handling frontend variation (plural)
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  }

  // Use itemsPrice from frontend if itemPrice is missing
  const finalItemPrice = itemPrice || itemsPrice;

  try {
    // --- STEP 1: PARALLEL STOCK VALIDATION ---
    // We use Promise.all to check all items simultaneously (Faster)
    await Promise.all(orderItems.map(async (item) => {
      const productId = item.product || item.id || item._id;
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error(`Product not found: ${item.name}`);
      }

      const sizeStock = product.stock.find(s => s.size === Number(item.size));

      if (!sizeStock) {
        throw new Error(`Size ${item.size} is not valid for ${item.name}`);
      }

      if (sizeStock.quantity < item.quantity) {
        throw new Error(`Size ${item.size} is out of stock for ${item.name}`);
      }
    }));

    // --- STEP 2: STOCK DEDUCTION ---
    // If validation passes, we deduct stock
    for (const item of orderItems) {
      const productId = item.product || item.id || item._id;
      const product = await Product.findById(productId);
      
      const sizeStock = product.stock.find(s => s.size === Number(item.size));
      
      if (sizeStock) {
        sizeStock.quantity -= item.quantity;
        // Recalculate total stock for quick filtering
        product.totalStock = product.stock.reduce((acc, s) => acc + s.quantity, 0);
        await product.save();
      }
    }

    // --- STEP 3: CREATE ORDER ---
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x.product || x.id || x._id,
        _id: undefined, // Prevent ID collision
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemPrice: finalItemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: false, // Default
      isDelivered: false, // Default
      orderStatus: 'Processing' // Default status
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

// @desc    Update order to paid (THE DAISY CHAIN)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      
      // Capture Razorpay Details
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      
      // Save Razorpay fields if sent explicitly
      if (req.body.razorpayOrderId) order.razorpayOrderId = req.body.razorpayOrderId;
      if (req.body.razorpayPaymentId) order.razorpayPaymentId = req.body.razorpayPaymentId;
      if (req.body.razorpaySignature) order.razorpaySignature = req.body.razorpaySignature;

      // --- TRIGGER SHIPROCKET (Only for Paid Orders) ---
      try {
        console.log("Attempting to create Shiprocket Order...");
        const shippingData = await createShiprocketOrder(order);
        
        if (shippingData) {
          order.shiprocketOrderId = shippingData.shiprocketOrderId;
          order.shiprocketShipmentId = shippingData.shiprocketShipmentId;
          order.awbCode = shippingData.awbCode;
          order.orderStatus = "Ready to Ship";
          console.log("Shiprocket Sync Success");
        }
      } catch (shipError) {
        console.error("Shiprocket Sync Failed (Order still marked Paid):", shipError.message);
        // We do NOT throw error here, because the user has already paid.
        // We just log it so Admin can fix shipping manually.
      }

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

// @desc    Update order to delivered (Admin)
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
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
};

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid, // <--- New
  updateOrderToDelivered, // <--- New
  getMyOrders,
  getOrders, // <--- New
};