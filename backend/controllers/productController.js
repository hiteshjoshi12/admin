const Product = require("../models/Product");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

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
    
    if (req.query.category && req.query.category !== "all") {
      if (req.query.category.includes(',')) {
          const categories = req.query.category.split(","); 
          query.category = { $in: categories }; 
      } else {
          query.category = { $regex: req.query.category, $options: "i" };
      }
    }

    if (req.query.priceRange) {
      if (req.query.priceRange === "under-2500") query.price = { $lt: 2500 };
      else if (req.query.priceRange === "2500-5000") query.price = { $gte: 2500, $lte: 5000 };
      else if (req.query.priceRange === "above-5000") query.price = { $gt: 5000 };
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .select("-description") 
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .lean();

    const responseData = { products, page, pages: Math.ceil(count / pageSize), totalProducts: count };
    cache.set(cacheKey, responseData);
    res.json(responseData);
  } catch (error) {
    console.error("GetProducts Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const createProduct = async (req, res) => {
  try {
    const stockItems = req.body.stock || [];
    const totalStock = stockItems.reduce((acc, item) => acc + Number(item.quantity || 0), 0);
    
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
    cache.flushAll(); 
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Create Error:", error);
    res.status(400).json({ message: "Invalid product data" });
  }
};

// FIXED: Added missing fields to update payload
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      if (req.body.stock) {
        product.stock = req.body.stock;
        product.totalStock = req.body.stock.reduce((acc, item) => acc + Number(item.quantity), 0);
      }

      if (req.body.category) {
         if (typeof req.body.category === 'string') {
             product.category = req.body.category.split(',').map(c => c.trim());
         } else {
             product.category = req.body.category;
         }
      }

      // Map ALL fields properly
      product.name = req.body.name || product.name;
      product.price = req.body.price || product.price;
      product.originalPrice = req.body.originalPrice !== undefined ? req.body.originalPrice : product.originalPrice;
      product.image = req.body.image || product.image;
      product.images = req.body.images || product.images; 
      product.description = req.body.description || product.description;
      
      if (req.body.isNewArrival !== undefined) product.isNewArrival = req.body.isNewArrival;
      if (req.body.isBestSeller !== undefined) product.isBestSeller = req.body.isBestSeller;
      if (req.body.slug) product.slug = req.body.slug;

      const updatedProduct = await product.save();
      cache.flushAll(); 
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Update Error" });
  }
};

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

const searchProducts = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json([]);

    const products = await Product.find({
      name: { $regex: query, $options: "i" } 
    })
    .select("name price slug image category") 
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