const axios = require('axios');

// 1. Authenticate with Shiprocket (Get Token)
const getShiprocketToken = async () => {
  try {
    const res = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    });
    return res.data.token;
  } catch (error) {
    console.error("Shiprocket Auth Failed:", error.message);
    throw new Error('Shiprocket Authentication Failed');
  }
};

// 2. Create Order in Shiprocket
const createShiprocketOrder = async (mongoOrder) => {
  try {
    const token = await getShiprocketToken();
    
    // Map your Mongo Order to Shiprocket's expected JSON format
    const orderData = {
      order_id: mongoOrder._id.toString(),
      order_date: new Date().toISOString().split('T')[0] + " " + new Date().toTimeString().split(' ')[0],
      pickup_location: "Primary", // Must match the name of your pickup location in Shiprocket Dashboard
      billing_customer_name: "Customer", // Ideally fetch User's name
      billing_last_name: "",
      billing_address: mongoOrder.shippingAddress.address,
      billing_city: mongoOrder.shippingAddress.city,
      billing_pincode: mongoOrder.shippingAddress.postalCode,
      billing_state: mongoOrder.shippingAddress.state,
      billing_country: "India",
      billing_email: "customer@example.com", // Fetch from User model
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
      payment_method: mongoOrder.paymentMethod === "COD" ? "COD" : "Prepaid",
      sub_total: mongoOrder.itemPrice,
      length: 30, // Default dimensions (cm) - Add to Product model later for accuracy
      breadth: 15,
      height: 10,
      weight: 0.5 // Default weight (kg)
    };

    const res = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/ad-hoc', orderData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log("Shiprocket Order Created:", res.data.order_id);
    return {
      shiprocketOrderId: res.data.order_id,
      shiprocketShipmentId: res.data.shipment_id,
      awbCode: res.data.awb_code
    };

  } catch (error) {
    // We log the error but we DO NOT crash the app. 
    // The user has paid; we can fix shipping manually if this API fails.
    console.error("Shiprocket Create Order Error:", error.response ? error.response.data : error.message);
    return null; 
  }
};

module.exports = { createShiprocketOrder };