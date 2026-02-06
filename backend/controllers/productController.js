const Product = require("../models/Product");
const NodeCache = require("node-cache");

// Initialize Cache (5 minute TTL)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

// --- PUBLIC: FETCH BY SLUG (SEO Friendly) ---
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).lean();
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// --- ADMIN: FETCH BY ID (For ProductForm.jsx) ---
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// --- COMMON: FETCH ALL (Shop & Inventory) ---
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;
    const cacheKey = `products_${JSON.stringify(req.query)}`;

    if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

    const query = {};
    if (req.query.keyword) {
      query.name = { $regex: req.query.keyword, $options: "i" };
    }
    
    // Add Category Filter
    if (req.query.category && req.query.category !== "all") {
      query.category = { $in: req.query.category.split(",") };
    }

    // Add Price Filter
    if (req.query.priceRange) {
      if (req.query.priceRange === "under-2500") query.price = { $lt: 2500 };
      else if (req.query.priceRange === "2500-5000") query.price = { $gte: 2500, $lte: 5000 };
      else if (req.query.priceRange === "above-5000") query.price = { $gt: 5000 };
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .select("-description -images") // Optimize list view
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .lean();

    const responseData = { products, page, pages: Math.ceil(count / pageSize), totalProducts: count };
    cache.set(cacheKey, responseData);
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// --- ADMIN: CREATE ---
const createProduct = async (req, res) => {
  try {
    const totalStock = req.body.stock?.reduce((acc, item) => acc + Number(item.quantity), 0) || 0;
    const product = new Product({
      ...req.body,
      user: req.user._id,
      totalStock
    });
    const createdProduct = await product.save();
    cache.flushAll();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: "Invalid product data" });
  }
};

// --- ADMIN: UPDATE ---
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      Object.assign(product, req.body);
      if (req.body.stock) {
        product.totalStock = req.body.stock.reduce((acc, item) => acc + Number(item.quantity), 0);
      }
      const updatedProduct = await product.save();
      cache.flushAll();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Update Error" });
  }
};

// --- ADMIN: DELETE ---
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      cache.flushAll();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Delete Error" });
  }
};

// --- MAINTENANCE: REGENERATE SLUGS ---
const migrateSlugs = async (req, res) => {
  try {
    const products = await Product.find({});
    for (let product of products) {
      product.slug = product.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') 
        .replace(/[\s_]+/g, '-')  
        .replace(/^-+|-+$/g, ''); 
      await product.save();
    }
    cache.flushAll();
    res.json({ message: "Migration successful: All products updated with SEO slugs." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getProductBySlug,
  migrateSlugs
};