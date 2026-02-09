const nodemailer = require('nodemailer');

// @desc    Send contact email
// @route   POST /api/contact
// @access  Public
const sendContactEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    // 1. Configure the transporter (Use your business email credentials here)
    // For Gmail, you might need an "App Password" if 2FA is on.
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your SMTP host
      auth: {
        user: process.env.EMAIL_USERNAME, // Your email (e.g., beadsandbloom@gmail.com)
        pass: process.env.EMAIL_PASSWORD, // Your email password or App Password
      },
    });

    // 2. Define email options
    const mailOptions = {
      from: `"${name}" <${email}>`, // Sender address
      to: 'connect@beadsandbloom.in', // 🚨 TARGET EMAIL
      replyTo: email,
      subject: `New Inquiry: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1C1917;">New Message from Website</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <h3>Message:</h3>
          <p style="font-size: 16px; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
            ${message}
          </p>
        </div>
      `,
    };

    // 3. Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email Error:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
};

module.exports = { sendContactEmail };