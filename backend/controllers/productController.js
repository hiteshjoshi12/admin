const Product = require('../models/Product');

// @desc    Fetch products with Pagination & Search
// @route   GET /api/products?pageNumber=1&keyword=silk
// @access  Public
const getProducts = async (req, res) => {
  try {
    // 1. Define Pagination Variables
    const pageSize = 12; // How many products per page
    const page = Number(req.query.pageNumber) || 1; // Default to Page 1

    // 2. Define Search/Filter Logic
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i', // Case insensitive
          },
        }
      : {};

    // 3. Count Total Products
    const count = await Product.countDocuments({ ...keyword });

    // 4. Fetch the specific "Slice" of products
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    // 5. Send data + pagination info
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getProducts,
  getProductById
};