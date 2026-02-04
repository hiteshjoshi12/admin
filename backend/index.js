require('dotenv').config();
const compression = require('compression');

const express = require('express');
const { connectDB } = require('./config/db.js');
const enableCors = require('./config/cors.js');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const bestSellerRoutes = require('./routes/bestSellerRoutes');
const collectionRoutes = require('./routes/collectionRoutes'); // <--- Import
const reviewRoutes = require('./routes/reviewRoutes');
const contentRoutes = require('./routes/contentRoutes');
const cmsRoutes = require('./routes/cmsRoutes');
const coupons = require('./routes/couponRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes'); // <--- Import
const uploadRoutes = require('./routes/uploadRoutes');
const sitemapRoutes = require('./routes/sitemapRoutes');

const app = express();
app.use(compression());
enableCors(app);
app.use(express.json());

connectDB();

app.use('/', sitemapRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes); // <--- ADD THIS
app.use('/api/bestsellers', bestSellerRoutes); // Add this line
app.use('/api/collections', collectionRoutes); // <--- Add this line
app.use('/api/reviews', reviewRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/coupons', coupons);
app.use('/api/upload', uploadRoutes);

// ✅ EXPORT APP FOR VERCEL
module.exports = app;

if(process.env.NODE_ENV !== 'production') {
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
