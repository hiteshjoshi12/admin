const axios = require('axios');

// Cache token to avoid frequent logins
let shiprocketToken = null;

const getShiprocketToken = async () => {
  try {
    const res = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    });
    shiprocketToken = res.data.token;
    return shiprocketToken;
  } catch (error) {
    console.error("Shiprocket Auth Failed:", error.message);
    throw new Error('Shiprocket Authentication Failed');
  }
};

const createShiprocketOrder = async (mongoOrder) => {
  try {
    if (!shiprocketToken) await getShiprocketToken();
    
    // 1. Format Date correctly (YYYY-MM-DD HH:MM:SS)
    const orderDate = new Date(mongoOrder.createdAt).toISOString().slice(0, 19).replace('T', ' ');

    // 2. SAFE PAYMENT CHECK (Handles 'cod', 'COD', 'Cod')
    const isCod = mongoOrder.paymentMethod && mongoOrder.paymentMethod.toLowerCase() === "cod";

    const orderData = {
      order_id: mongoOrder._id.toString(),
      order_date: orderDate,
      
      // --- FIX #1: MATCHES YOUR SCREENSHOT NICKNAME ---
      pickup_location: "Home", 
      
      billing_customer_name: mongoOrder.user?.name || "Customer",
      billing_last_name: "",
      billing_address: mongoOrder.shippingAddress.address,
      billing_city: mongoOrder.shippingAddress.city,
      billing_pincode: mongoOrder.shippingAddress.postalCode,
      billing_state: mongoOrder.shippingAddress.state,
      billing_country: "India",
      billing_email: mongoOrder.user?.email || "customer@example.com",
      billing_phone: mongoOrder.shippingAddress.phoneNumber,
      shipping_is_billing: true,
      
      order_items: mongoOrder.orderItems.map(item => ({
        name: item.name,
        sku: item.product.toString(),
        units: item.quantity,
        selling_price: item.price,
        discount: "",
        tax: "",
        hsn: "" 
      })),
      
      // --- FIX #2: SAFE CHECK ---
      payment_method: isCod ? "COD" : "Prepaid",
      sub_total: mongoOrder.totalPrice, // Use totalPrice instead of itemPrice to capture tax/shipping
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5 
    };

    // --- FIX #3: CORRECT URL SPELLING (adhoc, not ad-hoc) ---
    const res = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', orderData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${shiprocketToken}`
      }
    });

    console.log("✅ Shiprocket Order Created:", res.data.order_id);
    
    return {
      shiprocketOrderId: res.data.order_id,
      shiprocketShipmentId: res.data.shipment_id,
      awbCode: res.data.awb_code,
      courierCompanyName: res.data.courier_name // Capturing courier name for your frontend
    };

  } catch (error) {
    if (error.response?.status === 401) {
        console.log("🔄 Token expired, retrying...");
        await getShiprocketToken();
        return createShiprocketOrder(mongoOrder);
    }
    console.error("Shiprocket Create Order Error:", error.response?.data || error.message);
    return null; 
  }
};

module.exports = { createShiprocketOrder };