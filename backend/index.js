// require('dotenv').config();

// const express = require('express');
// const cors = require('cors');
// const { connectDB } = require('./config/db.js');

// const productRoutes = require('./routes/productRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const userRoutes = require('./routes/userRoutes'); // <--- The only user file we need

// const app = express();

// app.use(express.json());
// app.use(cors());

// connectDB();

// // --- USE ROUTES ---
// app.use('/api/users', userRoutes); // Handles Login, Register, AND Profile
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);

// // (Note: We removed app.use('/api/auth', ...) because it is now redundant)

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db.js');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());

const allowedOrigins = process.env.FRONTEND_URL.split(',');

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.options('*', cors());

connectDB();

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
