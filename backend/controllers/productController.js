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
    
    // Create a unique cache key based on ALL query params
    const cacheKey = `products_${JSON.stringify(req.query)}`;

    if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

    // 1. Build Query
    const query = {};

    // A. Keyword Search
    if (req.query.keyword) {
      query.name = { $regex: req.query.keyword, $options: "i" };
    }
    
    // 🚨 B. CATEGORY FILTER (Updated Logic)
    if (req.query.category && req.query.category !== "all") {
      // Check if it's a comma-separated list (e.g. "Bridal,Casual") or single value
      if (req.query.category.includes(',')) {
          const categories = req.query.category.split(","); 
          query.category = { $in: categories }; 
      } else {
          // Single Category: Use Regex for flexible matching (Bridal matches bridal)
          query.category = { $regex: req.query.category, $options: "i" };
      }
    }

    // C. Price Filter
    if (req.query.priceRange) {
      if (req.query.priceRange === "under-2500") query.price = { $lt: 2500 };
      else if (req.query.priceRange === "2500-5000") query.price = { $gte: 2500, $lte: 5000 };
      else if (req.query.priceRange === "above-5000") query.price = { $gt: 5000 };
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .select("-description") // Optimized fetch
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .lean();

    const responseData = { products, page, pages: Math.ceil(count / pageSize), totalProducts: count };
    
    // Save to Cache
    cache.set(cacheKey, responseData);
    
    res.json(responseData);
  } catch (error) {
    console.error("GetProducts Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// --- ADMIN: CREATE ---
const createProduct = async (req, res) => {
  try {
    // Calculate total stock from variants
    const stockItems = req.body.stock || [];
    const totalStock = stockItems.reduce((acc, item) => acc + Number(item.quantity || 0), 0);
    
    // Ensure category is always an array
    let category = req.body.category;
    if (typeof category === 'string') {
        category = category.split(',').map(c => c.trim());
    }

    const product = new Product({
      ...req.body,
      category: category || [],
      user: req.user._id,
      totalStock
    });

    const createdProduct = await product.save();
    cache.flushAll(); // Clear cache on new product
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Create Error:", error);
    res.status(400).json({ message: "Invalid product data" });
  }
};

// --- ADMIN: UPDATE ---
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      // 1. Calculate Stock if provided
      if (req.body.stock) {
        product.stock = req.body.stock;
        product.totalStock = req.body.stock.reduce((acc, item) => acc + Number(item.quantity), 0);
      }

      // 2. Ensure Category is Array
      if (req.body.category) {
         if (typeof req.body.category === 'string') {
             product.category = req.body.category.split(',').map(c => c.trim());
         } else {
             product.category = req.body.category;
         }
      }

      // 3. Update other fields
      product.name = req.body.name || product.name;
      product.price = req.body.price || product.price;
      product.image = req.body.image || product.image;
      product.description = req.body.description || product.description;
      product.slug = req.body.slug || product.slug;

      const updatedProduct = await product.save();
      cache.flushAll(); // Clear cache on update
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Update Error" });
  }
};

// --- ADMIN: DELETE ---
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      cache.flushAll(); // Clear cache on delete
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
      if(!product.slug || product.slug === "") {
          product.slug = product.name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') 
            .replace(/[\s_]+/g, '-')  
            .replace(/^-+|-+$/g, ''); 
          await product.save();
      }
    }
    cache.flushAll();
    res.json({ message: "Migration successful: Slugs updated." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- PUBLIC: INSTANT SEARCH ---
const searchProducts = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json([]);

    // Limit to 6 results for the dropdown
    const products = await Product.find({
      name: { $regex: query, $options: "i" } // Case-insensitive Regex
    })
    .select("name price slug image category") // ⚡ Fetch ONLY what's needed
    .limit(6)
    .lean();

    res.json(products);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Search failed" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getProductBySlug,
  migrateSlugs,
  searchProducts
};