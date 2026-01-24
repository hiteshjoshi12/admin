require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes'); // <--- The only user file we need

const app = express();

const allowedOrigins = [
  'http://localhost:5173', // Vite Localhost
  process.env.CLIENT_URL   // Vercel Production Link (You will add this to Render settings)
];

app.use(express.json());
// CORS CONFIGURATION
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // Important for cookies/tokens if you use them
}));

connectDB();

// --- USE ROUTES ---
app.use('/api/users', userRoutes); // Handles Login, Register, AND Profile
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// (Note: We removed app.use('/api/auth', ...) because it is now redundant)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));