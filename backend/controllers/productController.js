const Product = require('../models/Product');

// @desc    Fetch products (Reusable for Shop & Admin)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    // UPDATED: Allow dynamic page size (defaults to 12 if not specified)
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;

    // --- BUILD DYNAMIC QUERY ---
    const query = {};

    // 1. Search Keyword
    if (req.query.keyword) {
      query.name = { $regex: req.query.keyword, $options: 'i' };
    }

    // 2. Category Filter
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

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { 
      name, price, originalPrice, description, image, images, 
      category, stock, isNewArrival, isBestSeller 
    } = req.body;

    // Recalculate total stock on server side for safety
    const calculatedTotalStock = stock ? stock.reduce((acc, item) => acc + Number(item.quantity), 0) : 0;

    const product = new Product({
      name,
      price,
      originalPrice,
      user: req.user._id, // Assuming authMiddleware adds user to req
      image,
      images,
      category,
      stock,
      totalStock: calculatedTotalStock,
      isNewArrival,
      isBestSeller,
      numReviews: 0,
      description,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid product data' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { 
      name, price, originalPrice, description, image, images, 
      category, stock, isNewArrival, isBestSeller 
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.originalPrice = originalPrice || product.originalPrice;
      product.description = description || product.description;
      product.image = image || product.image;
      product.images = images || product.images;
      product.category = category || product.category;
      product.stock = stock || product.stock;
      product.isNewArrival = isNewArrival !== undefined ? isNewArrival : product.isNewArrival;
      product.isBestSeller = isBestSeller !== undefined ? isBestSeller : product.isBestSeller;

      // Recalculate total stock if stock array is updated
      if (stock) {
        product.totalStock = stock.reduce((acc, item) => acc + Number(item.quantity), 0);
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};