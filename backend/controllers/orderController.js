const Order = require('../models/Order');
const Product = require('../models/Product'); // <--- Import Product Model

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  } 

  try {
    // --- STEP 1: STOCK VALIDATION LOOP ---
    // Check if the specific SIZE is available for every item
    for (const item of orderItems) {
      // 1. Find the product
      // We check for 'product' (standard) or 'id' (frontend compatibility)
      const productId = item.product || item.id || item._id;
      const product = await Product.findById(productId);
      
      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item.name}`);
      }

      // 2. Find the specific size in the stock array
      // We assume item.size is passed from frontend (e.g., 38)
      const sizeStock = product.stock.find(s => s.size === Number(item.size));

      if (!sizeStock) {
        res.status(400);
        throw new Error(`Size ${item.size} is not valid for ${item.name}`);
      }

      // 3. Check quantity for that size
      if (sizeStock.quantity < item.quantity) {
        res.status(400);
        throw new Error(`Size ${item.size} is out of stock for ${item.name}`);
      }
    }

    // --- STEP 2: STOCK DEDUCTION LOOP ---
    for (const item of orderItems) {
      const productId = item.product || item.id || item._id;
      const product = await Product.findById(productId);
      
      // Find the specific size object to update
      const sizeStock = product.stock.find(s => s.size === Number(item.size));
      
      if (sizeStock) {
        // Deduct quantity
        sizeStock.quantity -= item.quantity;
        
        // Optional: Update global totalStock helper
        product.totalStock = product.stock.reduce((acc, s) => acc + s.quantity, 0);
        
        await product.save();
      }
    }

    // --- STEP 3: CREATE ORDER ---
    const order = new Order({
      orderItems: orderItems.map(x => ({
        ...x,
        product: x.product || x.id || x._id, // Ensure correct ID mapping
        _id: undefined // Remove potential frontend ID conflicts
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: false, 
      isDelivered: false
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error) {
    const status = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(status).json({ message: error.message });
  }
};



// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    // Populate attaches the Name and Email of the user to the order data
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { addOrderItems, getOrderById, getMyOrders };