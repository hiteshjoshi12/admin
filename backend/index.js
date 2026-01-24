require('dotenv').config(); // MUST be FIRST

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

// --- IMPORT ROUTES ---
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());
app.use(cors());

// --- CONNECT DB ---
connectDB();

// --- USE ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', userRoutes);


// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
