require('dotenv').config();
const compression = require('compression');
const express = require('express');
const path = require('path'); // Added for production pathing
const { connectDB } = require('./config/db.js');
const enableCors = require('./config/cors.js');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const bestSellerRoutes = require('./routes/bestSellerRoutes');
const collectionRoutes = require('./routes/collectionRoutes'); 
const reviewRoutes = require('./routes/reviewRoutes');
const contentRoutes = require('./routes/contentRoutes');
const cmsRoutes = require('./routes/cmsRoutes');
const coupons = require('./routes/couponRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes'); 
const uploadRoutes = require('./routes/uploadRoutes');
const sitemapRoutes = require('./routes/sitemapRoutes');


const app = express();

// Middleware
app.use(compression());
enableCors(app);
app.use(express.json());

// Database Connection
connectDB()

// API Routes
app.use('/', sitemapRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/bestsellers', bestSellerRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/coupons', coupons);
app.use('/api/upload', uploadRoutes);

// --- MILESWEB PRODUCTION CONFIGURATION ---

if (process.env.NODE_ENV === 'production') {
    // 1. Serve static files from 'dist' ONLY in production
    app.use(express.static(path.join(__dirname, 'dist')));

    // 2. Handle React routing
    // NEW WAY (Correct for modern Express)
// ✅ Correct syntax for Express 5.x catch-all
app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});
} else {
    // 3. Optional: Add a simple message for local dev testing
    app.get('/', (req, res) => {
        res.send('API is running in development mode. Start your React dev server separately.');
    });
}

// ✅ EXPORT APP (Required for some environments like Vercel)
module.exports = app;

// ✅ LISTEN ON PORT (Required for MilesWeb/cPanel Passenger)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


