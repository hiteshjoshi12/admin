require('dotenv').config();
const mongoose = require('mongoose');
// Make sure this path is correct based on your folder structure
const { connectDB } = require('./config/db');
const Product = require('./models/Product');
const BestSeller = require('./models/BestSeller');

// The data you provided
const bestSellerData = [
  { 
    name: "Neel Pari", 
    tag: "The Icon",
    position: 1
  },
  { 
    name: "Rose Aurum", 
    tag: "Trending Now",
    position: 2
  },
  { 
    name: "Neel Noor", 
    tag: "Everyday Luxury",
    position: 3
  },
];

const importData = async () => {
  try {
    // 1. Connect to Database (Must be awaited!)
    await connectDB();

    console.log("Adding Best Sellers...");

    // 2. Clear existing best sellers to avoid duplicates
    await BestSeller.deleteMany();

    // 3. Loop through the data and link it to real products
    for (const item of bestSellerData) {
      // Find the product in your DB by its name (Case Insensitive Search helps here)
      const product = await Product.findOne({ 
        name: { $regex: new RegExp(`^${item.name}$`, 'i') } 
      });

      if (product) {
        // Create the Best Seller Entry
        await BestSeller.create({
          product: product._id, // Link the ID
          tag: item.tag,
          position: item.position
        });
        console.log(`✅ Added: ${item.tag} -> ${product.name}`);
      } else {
        console.log(`❌ Product not found: "${item.name}"`);
      }
    }

    console.log("Success! Script finished.");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();