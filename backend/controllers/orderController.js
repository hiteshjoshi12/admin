const Order = require("../models/Order");
const Product = require("../models/Product");
const { createShiprocketOrder } = require("../utils/shiprocket");
const crypto = require("crypto");
const razorpay = require("../utils/razorpay");
const {
  sendOrderConfirmation,
  sendOrderStatusEmail,
} = require("../utils/sendEmail");

// @desc    Create new order (Supports Guest & Logged In)
// @route   POST /api/orders
// @access  Public (Was Private)
// @desc    Create new order (Supports Guest & Logged In)
// @desc    Create new order (Supports Guest & Logged In)
const addOrderItems = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, guestEmail } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  try {
    // 1. FETCH REAL PRODUCTS (Security)
    const productIds = orderItems.map(
      (item) => item.product || item.id || item._id,
    );
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    // 2. RECALCULATE PRICES
    let calculatedItemsPrice = 0;
    const productsToUpdate = [];

    for (const item of orderItems) {
      const productId = (item.product || item.id || item._id).toString();
      const dbProduct = dbProducts.find((p) => p._id.toString() === productId);

      if (!dbProduct) throw new Error(`Product not found: ${item.name}`);

      const sizeVariant = dbProduct.stock.find(
        (s) => s.size === Number(item.size),
      );
      if (!sizeVariant)
        throw new Error(`Size ${item.size} invalid for ${item.name}`);
      if (sizeVariant.quantity < item.quantity)
        throw new Error(`Out of stock: ${item.name}`);

      sizeVariant.quantity -= item.quantity;
      dbProduct.totalStock = dbProduct.stock.reduce(
        (acc, s) => acc + s.quantity,
        0,
      );
      if (!productsToUpdate.includes(dbProduct))
        productsToUpdate.push(dbProduct);

      calculatedItemsPrice += dbProduct.price * item.quantity;
    }

    // --- UPDATED SHIPPING LOGIC ---
    let shippingPrice = 150; // Default Pan India

    if (calculatedItemsPrice > 5000) {
      shippingPrice = 0; // Free Shipping priority
    } else if (shippingAddress && shippingAddress.postalCode) {
      // Logic: Delhi (11), Gurgaon/Faridabad (12), Noida/Ghaziabad (201)
      const pincode = String(shippingAddress.postalCode).trim();
      const isNCR = /^(11|12|201)/.test(pincode);
      
      if (isNCR) {
        shippingPrice = 100;
      }
    }
    // -----------------------------

    const totalPrice = calculatedItemsPrice + shippingPrice;

    await Promise.all(productsToUpdate.map((product) => product.save()));

    // 3. PREPARE ORDER DATA
    const orderData = {
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x.product || x.id || x._id,
        price: dbProducts.find(
          (p) => p._id.toString() === (x.product || x.id).toString(),
        ).price,
        _id: undefined,
      })),
      shippingAddress,
      paymentMethod,
      itemPrice: calculatedItemsPrice,
      shippingPrice,
      totalPrice,
      isPaid: false,
      isDelivered: false,
      orderStatus: "Processing",
    };

    // 4. ATTACH USER OR GUEST INFO
    if (req.user && req.user._id) {
      orderData.user = req.user._id;
    } else {
      // Ensure Guest Info is populated
      orderData.guestInfo = {
        name: req.body.name || shippingAddress.name || "Guest",
        email: req.body.email || guestEmail || "guest@example.com",
      };
    }

    const order = new Order(orderData);
    const createdOrder = await order.save();

    // 5. SEND EMAIL IF COD
    if (paymentMethod === "cod") {
      // We fetch the order again to populate 'user' IF it exists
      // If guest, 'user' is null, but 'guestInfo' is inside createdOrder
      const fullOrder = await Order.findById(createdOrder._id).populate(
        "user",
        "name email",
      );
      await sendOrderConfirmation(fullOrder); // Now works for guests too!
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Order Creation Error:", error.message);
    const status =
      error.message.includes("found") || error.message.includes("stock")
        ? 400
        : 500;
    res
      .status(status)
      .json({ message: error.message || "Order creation failed" });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public (Modified to allow Guest Access via ID)
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

      // WORKS FOR GUESTS NOW
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
        // WORKS FOR GUESTS NOW
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

    // Check if email matches User Email OR Guest Email
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
// @access  Public (Modified for Guest)
const initiateRazorpayPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    if (order.isPaid) {
      return res.status(400).json({ message: "Order is already paid." });
    }

    const options = {
      amount: Math.round(order.totalPrice * 100),
      currency: "INR",
      receipt: order._id.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(options);
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
// @access  Public (Modified for Guest)
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
      order.isPaid = true;
      order.paidAt = Date.now();

      // Fallback logic not strictly needed for email function anymore, but good for payment result
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

      // SEND EMAIL (WORKS FOR GUESTS)
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
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("Webhook Signature Verified");
    if (req.body.event === "payment.captured") {
      const payment = req.body.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      const order = await Order.findOne({ razorpayOrderId: razorpayOrderId });

      if (order && !order.isPaid) {
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
      }
    }
    res.json({ status: "ok" });
  } else {
    res.status(400).json({ message: "Invalid Signature" });
  }
};

// @desc    Handle Shiprocket Shipment Updates
// @route   POST /api/orders/shiprocket-webhook
const handleShiprocketWebhook = async (req, res) => {
  try {
    const { order_id, current_status, awb } = req.body;
    console.log(
      `🚚 Shiprocket Update for Order ${order_id}: ${current_status}`,
    );

    const order = await Order.findById(order_id).populate("user", "name email");

    if (order) {
      let statusChanged = false;
      const trackingUrl = awb ? `https://shiprocket.co/tracking/${awb}` : null;

      if (["PICKED UP", "IN TRANSIT", "SHIPPED"].includes(current_status)) {
        if (
          order.orderStatus !== "Shipped" &&
          order.orderStatus !== "Delivered"
        ) {
          order.orderStatus = "Shipped";
          statusChanged = true;
          await sendOrderStatusEmail(order, "Shipped", trackingUrl);
        }
      } else if (current_status === "DELIVERED") {
        if (order.orderStatus !== "Delivered") {
          order.orderStatus = "Delivered";
          order.isDelivered = true;
          order.deliveredAt = Date.now();
          statusChanged = true;
          await sendOrderStatusEmail(order, "Delivered", trackingUrl);
        }
      } else if (
        current_status === "CANCELED" ||
        current_status === "RTO INITIATED"
      ) {
        order.orderStatus = "Cancelled";
        statusChanged = true;
      }

      if (statusChanged) await order.save();
    }
    res.json({ status: "success" });
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).json({ error: "Server Error" });
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
