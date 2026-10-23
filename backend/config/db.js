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
      // Allow up to 15s for Atlas SSL handshake and replica set election
      serverSelectionTimeoutMS: 15000,

      // 3. Socket Timeout:
      // Close idle connections after 45s to free up memory.
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Retry connection after 5 seconds instead of hard exit
    setTimeout(connectDB, 5000);
  }
};

module.exports = { connectDB };