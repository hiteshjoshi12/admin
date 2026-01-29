const Product = require("../models/Product");
const NodeCache = require("node-cache");

// Initialize Cache
// stdTTL: 300 seconds (5 minutes). This means data stays in RAM for 5 mins.
// checkperiod: 320 seconds. How often the cache checks for expired keys.
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

// @desc    Fetch products (Reusable for Shop & Admin)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;

    // --- 1. CACHE CHECK ---
    // Create a unique key based on ALL query params (page, search, category, etc.)
    // If user searches "red shoes page 2", we cache that specific result.
    const cacheKey = `products_${JSON.stringify(req.query)}`;

    if (cache.has(cacheKey)) {
      // ⚡ HIT: Return cached data instantly (0ms latency)
      return res.json(cache.get(cacheKey));
    }

    // --- 2. BUILD DYNAMIC QUERY (If not in cache) ---
    const query = {};

    // Search Keyword (Optimized)
    if (req.query.keyword) {
      query.name = { $regex: req.query.keyword, $options: "i" };
      // query.$text = { $search: req.query.keyword }; // Optional Text Index
    }

    // Category Filter
    if (req.query.category && req.query.category !== "all") {
      const categories = req.query.category
        .split(",")
        .filter((c) => c.trim() !== "");
      if (categories.length > 0) {
        query.category = { $in: categories };
      }
    }

    // Price Filter
    if (req.query.priceRange) {
      const range = req.query.priceRange;
      if (range === "under-2500") {
        query.price = { $lt: 2500 };
      } else if (range === "2500-5000") {
        query.price = { $gte: 2500, $lte: 5000 };
      } else if (range === "above-5000") {
        query.price = { $gt: 5000 };
      }
    }

    // Size Filter (Stock Check)
    if (req.query.size) {
      const sizes = req.query.size
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => !isNaN(n));
      if (sizes.length > 0) {
        query.stock = {
          $elemMatch: {
            size: { $in: sizes },
            quantity: { $gt: 0 },
          },
        };
      }
    }

    // --- SORTING ---
    let sort = { createdAt: -1 };
    if (req.query.sort === "price-low") sort = { price: 1 };
    if (req.query.sort === "price-high") sort = { price: -1 };
    if (req.query.sort === "best-selling")
      sort = { isBestSeller: -1, totalStock: -1 };

    // --- EXECUTE DB QUERY (OPTIMIZED) ---
    const count = await Product.countDocuments(query);

    const products = await Product.find(query)
      .select("-description -reviews -images") // ⚡ Exclude heavy fields
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .lean(); // ⚡ Return plain JS objects

    const responseData = {
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count,
    };

    // --- 3. SAVE TO CACHE ---
    cache.set(cacheKey, responseData);

    res.json(responseData);
  } catch (error) {
    console.error("Fetch Products Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    // ⚡ Use lean() for faster read
    const product = await Product.findById(req.params.id).lean();

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).json({ message: "Server Error" });
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

      // 🧹 CLEAR CACHE: Ensure users see updated list immediately
      cache.flushAll();

      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      description,
      image,
      images,
      category,
      stock,
      isNewArrival,
      isBestSeller,
    } = req.body;

    const calculatedTotalStock = stock
      ? stock.reduce((acc, item) => acc + Number(item.quantity), 0)
      : 0;

    const product = new Product({
      name,
      price,
      originalPrice,
      user: req.user._id,
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

    // 🧹 CLEAR CACHE: New product available
    cache.flushAll();

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid product data" });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      description,
      image,
      images,
      category,
      stock,
      isNewArrival,
      isBestSeller,
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

      if (typeof isNewArrival !== "undefined")
        product.isNewArrival = isNewArrival;
      if (typeof isBestSeller !== "undefined")
        product.isBestSeller = isBestSeller;

      if (stock) {
        product.totalStock = stock.reduce(
          (acc, item) => acc + Number(item.quantity),
          0,
        );
      }

      const updatedProduct = await product.save();

      // 🧹 CLEAR CACHE: Price/Stock/Details updated
      cache.flushAll();

      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};
