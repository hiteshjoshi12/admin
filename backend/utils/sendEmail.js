const nodemailer = require('nodemailer');

// --- 1. COMMON TRANSPORTER SETUP ---
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Required for some hosting environments to prevent self-signed cert errors
    tls: {
      rejectUnauthorized: false
    },
  });
};

// --- HELPER: GET RECIPIENT DETAILS ---
const getRecipientDetails = (order) => {
    // 1. Try Logged In User
    if (order.user && order.user.email) {
        return { email: order.user.email, name: order.user.name.split(' ')[0] };
    }
    // 2. Try Guest Info (Hybrid System Support)
    if (order.guestInfo && order.guestInfo.email) {
        return { email: order.guestInfo.email, name: order.guestInfo.name || "Customer" };
    }
    // 3. Fallback to Payment Result
    if (order.paymentResult && order.paymentResult.email_address) {
        return { email: order.paymentResult.email_address, name: "Customer" };
    }
    return { email: null, name: "Customer" };
};

// --- 2. GENERIC EMAIL (Password Reset, Welcome, etc.) ---
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    // Optional: Add a button if URL is provided
    const buttonHtml = options.url ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${options.url}" style="background-color: #1C1917; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px; display: inline-block;">
          ${options.buttonText || 'Click Here'}
        </a>
      </div>
    ` : '';

    const mailOptions = {
      from: `"BeadsNBloom Security" <${process.env.EMAIL_USERNAME}>`,
      to: options.email,
      subject: options.subject,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333; line-height: 1.6; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1C1917; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-family: serif; letter-spacing: 1px;">BeadsNBloom</h2>
          </div>
          <div style="padding: 30px 20px;">
            <h3 style="color: #1C1917; margin-top: 0; text-align: center;">${options.title || 'Notification'}</h3>
            
            <div style="font-size: 15px; color: #555; text-align: center;">
                ${options.message} 
            </div>
            
            ${buttonHtml}
            
            <div style="margin-top: 30px; font-size: 12px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 10px;">
               <p>If you did not request this email, please ignore it.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("❌ Generic Email Failed:", error.message);
  }
};

// --- 3. ORDER CONFIRMATION ---
const sendOrderConfirmation = async (order) => {
  try {
    const transporter = createTransporter();
    const { email, name } = getRecipientDetails(order);
    
    if (!email) {
        console.log("❌ No email found for order confirmation.");
        return;
    }

    const itemsHtml = order.orderItems.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #ddd;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${item.image}" alt="${item.name}" width="50" height="50" style="border-radius: 4px; object-fit: cover;" />
            <span style="font-size: 14px;">${item.name}</span>
          </div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center;">${item.size || 'N/A'}</td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center;">x${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price.toLocaleString()}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: `"BeadsNBloom Orders" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: `Order Confirmed! #${order._id.toString().slice(-6).toUpperCase()}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #eee;">
            <h2 style="color: #1C1917; margin-bottom: 5px;">Thank You for Your Order!</h2>
            <p style="color: #666; margin: 0;">Hi ${name}, we're getting your package ready.</p>
          </div>
          
          <div style="background-color: #f8f8f8; padding: 15px; border-radius: 8px; margin: 25px 0; text-align: center;">
            <p style="margin: 0; font-size: 12px; text-transform: uppercase; color: #888; letter-spacing: 1px;">Order Reference</p>
            <p style="margin: 5px 0 0 0; font-weight: bold; font-size: 20px; color: #1C1917;">${order._id}</p>
          </div>

          <h3 style="color: #1C1917; margin-top: 30px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="background-color: #f4f4f4;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: center;">Size</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee;">
            <table style="width: 100%; font-size: 14px;">
              <tr><td style="text-align: right; padding: 5px;">Subtotal:</td><td style="text-align: right; width: 100px; padding: 5px;">₹${(order.itemsPrice || order.itemPrice).toLocaleString()}</td></tr>
              <tr><td style="text-align: right; padding: 5px;">Shipping:</td><td style="text-align: right; padding: 5px;">${order.shippingPrice === 0 ? 'Free' : '₹' + order.shippingPrice}</td></tr>
              <tr><td style="text-align: right; padding: 10px 5px; font-weight: bold; font-size: 16px; color: #1C1917;">Total Paid:</td><td style="text-align: right; padding: 10px 5px; font-weight: bold; font-size: 16px; color: #FF2865;">₹${order.totalPrice.toLocaleString()}</td></tr>
            </table>
          </div>

          <div style="margin-top: 30px; background-color: #fcfcfc; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #1C1917;">Shipping To:</h3>
            <p style="margin: 0; font-size: 14px; color: #555;">
              ${order.shippingAddress.address}<br/>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}<br/>
              <strong>Phone:</strong> ${order.shippingAddress.phoneNumber}
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Order Confirmation sent to: ${email}`);
  } catch (error) {
    console.error("❌ Email Sending Failed:", error.message);
  }
};

// --- 4. ORDER STATUS EMAIL ---
const sendOrderStatusEmail = async (order, status, trackingUrl = null) => {
  try {
    const transporter = createTransporter();
    const { email } = getRecipientDetails(order);
    if (!email) return;

    let subject = `Update on Order #${order._id.toString().slice(-6).toUpperCase()}`;
    let heading = "Order Update";
    let message = `There is an update on your order.`;

    if (status === 'Shipped') {
        subject = `Your Order has been Shipped! 🚚`;
        heading = "On Its Way!";
        message = `Good news! Your order has been packed and handed over to our courier partner. It is now on its way to you.`;
    } else if (status === 'Delivered') {
        subject = `Order Delivered! 🎉`;
        heading = "Delivered!";
        message = `Your order has been successfully delivered. We hope you love your purchase!`;
    } else if (status === 'Ready to Ship') {
        subject = `We are packing your order! 📦`;
        heading = "Getting Ready";
        message = `We have received your order and are currently packing it. You will receive a tracking link soon.`;
    }

    const trackingHtml = trackingUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${trackingUrl}" style="background-color: #1C1917; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px; display: inline-block;">
          Track Your Package
        </a>
        <p style="margin-top: 10px; font-size: 12px; color: #888;">
           Tracking Number (AWB): <strong>${order.awbCode || 'N/A'}</strong>
        </p>
      </div>
    ` : '';

    const mailOptions = {
      from: `"BeadsNBloom Updates" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333; line-height: 1.6; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1C1917; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-family: serif; letter-spacing: 1px;">BeadsNBloom</h2>
          </div>
          <div style="padding: 30px 20px; text-align: center;">
            <h2 style="color: #1C1917; margin-top: 0;">${heading}</h2>
            <p style="font-size: 15px; color: #555;">${message}</p>
            ${trackingHtml}
            <div style="margin-top: 30px; background-color: #f8f8f8; padding: 15px; border-radius: 8px; text-align: left;">
                <p style="margin: 0; font-size: 12px; text-transform: uppercase; color: #888;">Order ID</p>
                <p style="margin: 5px 0 0 0; font-weight: bold; font-size: 16px; color: #1C1917;">${order._id}</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Status Email (${status}) sent to: ${email}`);
  } catch (error) {
    console.error("❌ Email Sending Failed:", error.message);
  }
};

module.exports = { sendEmail, sendOrderConfirmation, sendOrderStatusEmail };