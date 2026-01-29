const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // ⚡ PERFORMANCE OPTIMIZATIONS ⚡
      
      // 1. Connection Pooling:
      // Allows up to 10 simultaneous connections. 
      // Default is 5. Increasing this helps under high traffic.
      maxPoolSize: 10, 

      // 2. Server Selection Timeout:
      // If the DB is down, fail fast (5s) instead of hanging the request for 30s.
      serverSelectionTimeoutMS: 5000,

      // 3. Socket Timeout:
      // Close idle connections after 45s to free up memory.
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB };