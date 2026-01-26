const Product = require('../models/Product');


// @desc    Fetch products with Filters & Pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    // --- BUILD DYNAMIC QUERY ---
    const query = {};

    // 1. Search Keyword
    if (req.query.keyword) {
      query.name = { $regex: req.query.keyword, $options: 'i' };
    }

    // 2. Category Filter (Supports multiple: ?category=Bridal,Party)
    if (req.query.category) {
      const categories = req.query.category.split(',');
      if (categories.length > 0) {
        query.category = { $in: categories };
      }
    }

    // 3. Price Filter
    if (req.query.priceRange) {
      if (req.query.priceRange === 'under-2500') query.price = { $lt: 2500 };
      else if (req.query.priceRange === '2500-5000') query.price = { $gte: 2500, $lte: 5000 };
      else if (req.query.priceRange === 'above-5000') query.price = { $gt: 5000 };
    }

    // 4. Size Filter
    // We check if the 'stock' array contains an object with the matching size AND quantity > 0
    if (req.query.size) {
      const sizes = req.query.size.split(',').map(Number);
      if (sizes.length > 0) {
        query.stock = { 
          $elemMatch: { 
            size: { $in: sizes }, 
            quantity: { $gt: 0 } 
          } 
        };
      }
    }

    // --- SORTING ---
    let sort = { createdAt: -1 }; // Default: Newest
    if (req.query.sort === 'price-low') sort = { price: 1 };
    if (req.query.sort === 'price-high') sort = { price: -1 };

    // --- EXECUTE DB QUERY ---
    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ 
      products, 
      page, 
      pages: Math.ceil(count / pageSize), 
      totalProducts: count 
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ... keep getProductById ...

module.exports = {
  getProducts,
  // getProductById
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