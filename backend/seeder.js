const mongoose = require('mongoose');
const dotenv = require('dotenv');
const products = require('./data/products');
const Product = require('./models/Product');
const User = require('./models/User');
const connectDB = require('./config/db'); // If you moved connection logic to a separate file, otherwise copy connection logic here

dotenv.config();

// Connect to DB directly for this script
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const importData = async () => {
  try {
    // 1. Clear existing data to avoid duplicates
    await Product.deleteMany();
    // await User.deleteMany(); // Optional: Clear users too if you want

    // 2. Insert new products
    await Product.insertMany(products);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    // await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Check command line arguments to decide action
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}