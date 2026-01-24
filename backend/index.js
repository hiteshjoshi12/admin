require('dotenv').config();

const express = require('express');
const { connectDB } = require('./config/db.js');
const enableCors = require('./config/cors.js');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());
enableCors(app);

connectDB();

app.get('/api/debug/env', (req, res) => {
  res.json({
    FRONTEND_URL: process.env.FRONTEND_URL || null,
    NODE_ENV: process.env.NODE_ENV,
  });
});


app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// ✅ EXPORT APP FOR VERCEL
module.exports = app;

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));