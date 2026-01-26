require('dotenv').config();

const express = require('express');
const { connectDB } = require('./config/db.js');
const enableCors = require('./config/cors.js');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const bestSellerRoutes = require('./routes/bestSellerRoutes');
const collectionRoutes = require('./routes/collectionRoutes'); // <--- Import
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

app.use(express.json());
enableCors(app);

connectDB();

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bestsellers', bestSellerRoutes); // Add this line
app.use('/api/collections', collectionRoutes); // <--- Add this line
app.use('/api/reviews', reviewRoutes);

// ✅ EXPORT APP FOR VERCEL
module.exports = app;

if(process.env.NODE_ENV !== 'production') {
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
