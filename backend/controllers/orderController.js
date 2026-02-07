const Order = require("../models/Order");
const Product = require("../models/Product");
const { createShiprocketOrder } = require("../utils/shiprocket");
const crypto = require("crypto");
const razorpay = require("../utils/razorpay");
const {
  sendOrderConfirmation,
  sendOrderStatusEmail,
} = require("../utils/sendEmail");
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');

// --- HELPER: Reduce Stock (Used in Verify & Webhook) ---
const reduceOrderStock = async (order) => {
  try {
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        const sizeVariant = product.stock.find((s) => s.size === Number(item.size));
        if (sizeVariant) {
          // Decrement stock
          sizeVariant.quantity = Math.max(0, sizeVariant.quantity - item.quantity);
          
          // Recalculate total stock
          product.totalStock = product.stock.reduce((acc, s) => acc + s.quantity, 0);
          
          await product.save();
        }
      }
    }
    console.log(`📉 Stock reduced for Order ${order._id}`);
  } catch (error) {
    console.error("Stock Reduction Failed:", error);
    // Continue execution (don't block payment success for this)
  }
};

// @desc    Create new order (Supports Guest & Logged In)
// @route   POST /api/orders
// @access  Public
// controllers/orderController.js

const addOrderItems = async (req, res) => {
  // 1. Destructure discountAmount and couponCode from the request body
  const { 
    orderItems, 
    shippingAddress, 
    paymentMethod, 
    guestEmail, 
    discountAmount, // <--- Getting this from Frontend
    couponCode      // <--- Getting this from Frontend
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  try {
    // 2. Fetch Products from DB (Security Check)
    const productIds = orderItems.map((item) => item.product || item.id || item._id);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    // 3. Recalculate Item Prices
    let calculatedItemsPrice = 0;
    const productsToUpdate = [];

    for (const item of orderItems) {
      const productId = (item.product || item.id || item._id).toString();
      const dbProduct = dbProducts.find((p) => p._id.toString() === productId);

      if (!dbProduct) throw new Error(`Product not found: ${item.name}`);

      // Check Stock
      const sizeVariant = dbProduct.stock.find((s) => s.size === Number(item.size));
      if (!sizeVariant || sizeVariant.quantity < item.quantity) {
        throw new Error(`Out of stock: ${item.name}`);
      }
      
      // Stock Reduction for COD happens here (optional, keeping your logic)
      if (paymentMethod === 'cod') {
          sizeVariant.quantity -= item.quantity;
          dbProduct.totalStock = dbProduct.stock.reduce((acc, s) => acc + s.quantity, 0);
          if (!productsToUpdate.includes(dbProduct)) productsToUpdate.push(dbProduct);
      }

      calculatedItemsPrice += dbProduct.price * item.quantity;
    }

    // 4. Calculate Shipping (Standard Logic)
    let shippingPrice = 150;
    if (calculatedItemsPrice > 5000) {
      shippingPrice = 0;
    } else if (shippingAddress && shippingAddress.postalCode) {
      const isNCR = /^(11|12|201)/.test(String(shippingAddress.postalCode));
      if (isNCR) shippingPrice = 100;
    }

    // 🚨 5. APPLY THE DISCOUNT HERE 🚨
    const finalDiscount = Number(discountAmount) || 0;
    
    // Total = Items + Shipping - Discount
    // We use Math.max(0, ...) to ensure total never goes negative
    const totalPrice = Math.max(0, calculatedItemsPrice + shippingPrice - finalDiscount);

    // Save stock updates (if COD)
    if (productsToUpdate.length > 0) {
      await Promise.all(productsToUpdate.map((product) => product.save()));
    }

    // 6. Create Order Object
    const orderData = {
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x.product || x.id || x._id,
        price: dbProducts.find((p) => p._id.toString() === (x.product || x.id).toString()).price,
        _id: undefined,
      })),
      shippingAddress,
      paymentMethod,
      itemPrice: calculatedItemsPrice,
      shippingPrice,
      
      // 🚨 SAVE THESE TO DATABASE 🚨
      discountAmount: finalDiscount,
      couponCode: couponCode || null,
      totalPrice: totalPrice, 
      
      isPaid: false,
      isDelivered: false,
      orderStatus: "Processing",
    };

    // Attach User ID if logged in
    if (req.user && req.user._id) {
      orderData.user = req.user._id;
    } else {
      orderData.guestInfo = {
        name: req.body.name || shippingAddress.name || "Guest",
        email: req.body.email || guestEmail || "guest@example.com",
      };
    }

    const order = new Order(orderData);
    const createdOrder = await order.save();

    // Send Email for COD
    if (paymentMethod === "cod") {
      const fullOrder = await Order.findById(createdOrder._id).populate("user", "name email");
      await sendOrderConfirmation(fullOrder);
    }

    res.status(201).json(createdOrder);

  } catch (error) {
    console.error("Order Error:", error.message);
    res.status(500).json({ message: error.message || "Order creation failed" });
  }
};



// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );
    if (order) res.json(order);
    else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(404).json({ message: "Order not found" });
  }
};

// @desc    Update order to paid (Manual / Legacy)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      if (req.body.razorpayOrderId)
        order.razorpayOrderId = req.body.razorpayOrderId;
      if (req.body.razorpayPaymentId)
        order.razorpayPaymentId = req.body.razorpayPaymentId;
      if (req.body.razorpaySignature)
        order.razorpaySignature = req.body.razorpaySignature;

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment update failed" });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.orderStatus = "Delivered";
      const updatedOrder = await order.save();

      await sendOrderStatusEmail(order, "Delivered");

      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

// @desc    Generate Shiprocket Label & Update Order
// @route   PUT /api/orders/:id/ship
// @access  Private/Admin
const shipOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    const shippingData = await createShiprocketOrder(order);

    if (shippingData) {
      order.shiprocketOrderId = shippingData.shiprocketOrderId;
      order.shiprocketShipmentId = shippingData.shiprocketShipmentId;
      order.courierCompanyName =
        shippingData.courierCompanyName || "Shiprocket";

      if (shippingData.awbCode) {
        order.awbCode = shippingData.awbCode;
        order.orderStatus = "Ready to Ship";
        await sendOrderStatusEmail(order, "Ready to Ship");
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(400);
      throw new Error("Shiprocket generation failed.");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Manually update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.orderStatus = status;
      // Auto-sync Delivered flag
      if (status === "Delivered") {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      } else if (status !== "Delivered" && order.isDelivered) {
        order.isDelivered = false;
        order.deliveredAt = null;
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ message: "Status update failed" });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    // Only return orders for this user
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "id name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Track Order Publicly (No Login Required)
// @route   POST /api/orders/track
// @access  Public
const trackOrderPublic = async (req, res) => {
  const { orderId, email } = req.body;
  try {
    const order = await Order.findById(orderId).populate("user", "name email");

    const userEmail = order.user?.email || order.guestInfo?.email;

    if (
      order &&
      userEmail &&
      userEmail.toLowerCase() === email.toLowerCase().trim()
    ) {
      res.json({
        _id: order._id,
        createdAt: order.createdAt,
        orderStatus: order.orderStatus,
        isPaid: order.isPaid,
        isDelivered: order.isDelivered,
        deliveredAt: order.deliveredAt,
        awbCode: order.awbCode,
        courierName: order.courierCompanyName || "Shiprocket",
        orderItems: order.orderItems,
        totalPrice: order.totalPrice,
      });
    } else {
      res.status(404).json({ message: "Order details not found." });
    }
  } catch (error) {
    res.status(404).json({ message: "Order details not found." });
  }
};

// --- RAZORPAY SECTION ---

// @desc    Create Razorpay Order ID
// @route   POST /api/orders/:id/pay/initiate
// @access  Public
// @desc    Create Razorpay Order ID
const initiateRazorpayPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // --- 🚨 LIVE TESTING LOGIC START 🚨 ---
    // Uncomment the line below to force a ₹2.00 payment for testing.
    // const amountToPay = 200; // 200 paise = ₹2
    
    // Standard Logic (Comment this out when using the test line above)
    const amountToPay = Math.round(order.totalPrice * 100); 
    // --- 🚨 LIVE TESTING LOGIC END 🚨 ---

    const options = {
      amount: amountToPay, 
      currency: "INR",
      receipt: order._id.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(options);
    
    // Update DB with Razorpay Order ID
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
    });
  } catch (error) {
    console.error("Razorpay Init Error:", error);
    res.status(500).json({ message: "Failed to initiate payment" });
  }
};

// @desc    Verify Signature & Update Order to Paid
// @route   PUT /api/orders/:id/pay/verify
// @access  Public
const verifyRazorpayPayment = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpaySignature) {
      
      // 🚨 STOCK REDUCTION: Only if verify passes & not already paid
      if (!order.isPaid) {
         await reduceOrderStock(order);
      }

      order.isPaid = true;
      order.paidAt = Date.now();

      const email =
        order.user?.email || order.guestInfo?.email || "guest@example.com";

      order.paymentResult = {
        id: razorpayPaymentId,
        status: "completed",
        update_time: Date.now(),
        email_address: email,
      };
      order.razorpayOrderId = razorpayOrderId;
      order.razorpayPaymentId = razorpayPaymentId;
      order.razorpaySignature = razorpaySignature;
      order.orderStatus = "Processing";

      const updatedOrder = await order.save();

      const fullOrder = await Order.findById(updatedOrder._id).populate(
        "user",
        "name email",
      );
      await sendOrderConfirmation(fullOrder);

      res.json(updatedOrder);
    } else {
      res.status(400).json({ message: "Invalid Payment Signature" });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

// @desc    Handle Razorpay Webhooks
// @route   POST /api/orders/webhook
const handleRazorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  try {
    const isValid = validateWebhookSignature(JSON.stringify(req.body), signature, secret);

    if (isValid) {
      console.log("✅ Webhook Signature Verified");

      if (req.body.event === "payment.captured") {
        const payment = req.body.payload.payment.entity;
        const razorpayOrderId = payment.order_id;
        
        const order = await Order.findOne({ razorpayOrderId: razorpayOrderId });

        if (order && !order.isPaid) {
          
          // 🚨 STOCK REDUCTION: Webhook Fallback
          await reduceOrderStock(order);

          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentResult = {
            id: payment.id,
            status: payment.status,
            update_time: Date.now(),
            email_address: payment.email,
          };
          order.razorpayPaymentId = payment.id;
          order.orderStatus = "Processing"; 
          
          await order.save();

          const fullOrder = await Order.findById(order._id).populate(
            "user",
            "name email",
          );
          await sendOrderConfirmation(fullOrder);
          console.log(`Order ${order._id} marked Paid & Stock Reduced via Webhook`);
        } else {
          console.log(`Order ${razorpayOrderId} already processed or not found`);
        }
      }
      res.json({ status: "ok" });
    } else {
      console.error("❌ Invalid Webhook Signature");
      res.status(400).json({ message: "Invalid Signature" });
    }
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(200).json({ status: "error_handled" }); 
  }
};

// @desc    Handle Shiprocket Shipment Updates
// @route   POST /api/orders/delivery-update
const handleShiprocketWebhook = async (req, res) => {
  try {
    const { order_id, channel_order_id, current_status, awb, courier_name } = req.body;

    console.log(`🚚 Shiprocket Event: ${current_status} for SR-ID: ${order_id}`);

    let order = null;

    // 1. Try Mongo ID
    if (channel_order_id) {
        order = await Order.findById(channel_order_id).populate("user", "name email");
    }

    // 2. Try Shiprocket ID
    if (!order && order_id) {
        order = await Order.findOne({ shiprocketOrderId: order_id }).populate("user", "name email");
    }

    if (!order) {
      console.error(`⚠️ Webhook received but Order not found. Returning 200.`);
      return res.json({ status: "success", message: "Webhook received, but order not found" });
    }

    // 🚨 FIX: Update AWB and Courier immediately if provided in webhook
    let dataChanged = false;
    if (awb && order.awbCode !== awb) {
        order.awbCode = awb;
        dataChanged = true;
    }
    if (courier_name && order.courierCompanyName !== courier_name) {
        order.courierCompanyName = courier_name;
        dataChanged = true;
    }

    // 3. STATUS UPDATE LOGIC
    let statusChanged = false;
    const trackingUrl = awb ? `https://shiprocket.co/tracking/${awb}` : null;
    const status = current_status ? current_status.toUpperCase() : "";

    // A. Shipped / In Transit
    if (["PICKED UP", "IN TRANSIT", "SHIPPED", "OUT FOR DELIVERY"].includes(status)) {
      if (order.orderStatus !== "Shipped" && order.orderStatus !== "Delivered") {
        order.orderStatus = "Shipped"; 
        statusChanged = true;
        // Now 'order' has the AWB code inside it, so the email will show it!
        await sendOrderStatusEmail(order, "Shipped", trackingUrl);
      }
    } 
    // B. Delivered
    else if (status === "DELIVERED") {
      if (order.orderStatus !== "Delivered") {
        order.orderStatus = "Delivered";
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        
        if(order.paymentMethod === 'cod' && !order.isPaid) {
            order.isPaid = true;
            order.paidAt = Date.now();
        }

        statusChanged = true;
        await sendOrderStatusEmail(order, "Delivered", trackingUrl);
      }
    } 
    // C. Cancelled
    else if (status === "CANCELED" || status === "CANCELLED") {
       if(order.orderStatus !== "Cancelled") {
          order.orderStatus = "Cancelled";
          statusChanged = true;
       }
    }
    // D. RTO / Returned
    else if (status === "RTO INITIATED" || status === "RETURNED") {
       if(order.orderStatus !== "Returned") {
          order.orderStatus = "Returned"; 
          statusChanged = true;
       }
    }

    if (statusChanged || dataChanged) {
      await order.save();
      console.log(`✅ Order ${order._id} updated to ${order.orderStatus}`);
    } else {
      console.log(`ℹ️ No status change needed for Order ${order._id}`);
    }

    res.json({ status: "success" });
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(200).json({ status: "error_handled" });
  }
};

// --- EXPORT ALL ---
module.exports = {
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
  handleShiprocketWebhook,
};