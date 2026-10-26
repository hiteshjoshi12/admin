const Product = require("../models/Product");
const NodeCache = require("node-cache");
const { flushSeoCache } = require("../utils/seoRenderer");
const { pingIndexNow } = require("../utils/indexNow");

const mongoose = require("mongoose");

const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

const getProductBySlug = async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const slugOrId = req.params.slug;
    const isObjectId = mongoose.Types.ObjectId.isValid(slugOrId);

    const query = {
      $or: [
        { slug: slugOrId },
        { oldSlugs: slugOrId },
        ...(isObjectId ? [{ _id: slugOrId }] : [])
      ]
    };

    const product = await Product.findOne(query).lean();
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
    const pageSize = Number(req.query.pageSize) || 50;
    const page = Number(req.query.pageNumber) || 1;
    const cacheKey = `products_${JSON.stringify(req.query)}`;

    if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

    const query = {};

    if (req.query.keyword) {
      const sanitizedKeyword = String(req.query.keyword).trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      query.name = { $regex: sanitizedKeyword, $options: "i" };
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
    // 1. Sanitize Category (accept category or categories, string or array)
    let category = req.body.category || req.body.categories;
    if (typeof category === 'string') {
      category = category.split(',').map(c => c.trim()).filter(Boolean);
    } else if (Array.isArray(category)) {
      category = category.map(c => String(c).trim()).filter(Boolean);
    } else {
      category = [];
    }

    if (!category || category.length === 0) {
      return res.status(400).json({ message: "At least one category is required" });
    }

    // 2. Sanitize Main Image
    const image = req.body.image ? String(req.body.image).trim() : '';
    if (!image) {
      return res.status(400).json({ message: "Main product display image is required" });
    }

    // 3. Sanitize Stock
    let stock = req.body.stock;
    if (Array.isArray(stock)) {
      stock = stock
        .map(item => ({
          size: String(item?.size || '').trim(),
          quantity: Number(item?.quantity) >= 0 ? Number(item.quantity) : 0
        }))
        .filter(item => item.size.length > 0);
    }

    if (!stock || stock.length === 0) {
      stock = [{ size: 'Standard', quantity: Math.max(0, Number(req.body.countInStock || req.body.totalStock || 0)) }];
    }

    const totalStock = stock.reduce((acc, item) => acc + Number(item.quantity || 0), 0);

    // 4. Sanitize Gallery Images (exclude empty strings)
    const images = Array.isArray(req.body.images)
      ? req.body.images.map(img => String(img || '').trim()).filter(Boolean)
      : [];

    // 5. Sanitize Numeric Fields
    const price = Number(req.body.price);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: "A valid positive product price is required" });
    }

    const originalPrice = !isNaN(Number(req.body.originalPrice)) && Number(req.body.originalPrice) > 0
      ? Number(req.body.originalPrice)
      : 0;

    // 6. Sanitize Care Instructions & Occasions
    const careInstructions = Array.isArray(req.body.careInstructions)
      ? req.body.careInstructions.map(c => String(c).trim()).filter(Boolean)
      : (typeof req.body.careInstructions === 'string' && req.body.careInstructions.trim())
        ? req.body.careInstructions.split('\n').map(c => c.trim()).filter(Boolean)
        : [];

    const occasions = Array.isArray(req.body.occasions)
      ? req.body.occasions.map(o => String(o).trim()).filter(Boolean)
      : (typeof req.body.occasions === 'string' && req.body.occasions.trim())
        ? req.body.occasions.split(',').map(o => o.trim()).filter(Boolean)
        : [];

    const imageDetails = Array.isArray(req.body.imageDetails)
      ? req.body.imageDetails.filter(img => img && img.url)
      : [];

    const product = new Product({
      name: String(req.body.name || '').trim(),
      slug: req.body.slug ? String(req.body.slug).trim() : undefined,
      description: String(req.body.description || '').trim(),
      price,
      originalPrice,
      image,
      images,
      category,
      stock,
      totalStock,
      isNewArrival: Boolean(req.body.isNewArrival),
      isBestSeller: Boolean(req.body.isBestSeller),
      rating: req.body.rating !== undefined && !isNaN(Number(req.body.rating)) ? Number(req.body.rating) : 0,
      numReviews: req.body.numReviews !== undefined && !isNaN(Number(req.body.numReviews)) ? Number(req.body.numReviews) : 0,
      
      // Artisanal Specifications
      sku: String(req.body.sku || '').trim(),
      material: String(req.body.material || '').trim(),
      color: String(req.body.color || '').trim(),
      embellishment: String(req.body.embellishment || '').trim(),
      lining: String(req.body.lining || '').trim(),
      sole: String(req.body.sole || '').trim(),
      comfortNotes: String(req.body.comfortNotes || '').trim(),
      careInstructions,
      occasions,
      fitTip: String(req.body.fitTip || '').trim(),
      imageDetails
    });

    const createdProduct = await product.save();
    cache.flushAll(); 
    flushSeoCache();
    pingIndexNow([
      `https://beadsandbloom.in/product/${createdProduct.slug}`,
      'https://beadsandbloom.in/shop',
      'https://beadsandbloom.in/sitemap.xml'
    ]).catch(() => {});
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Create Product Error:", error);
    const message = error.errors
      ? Object.values(error.errors).map(e => e.message).join(", ")
      : error.message || "Invalid product data";
    res.status(400).json({ message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.body.stock) {
      let stock = req.body.stock;
      if (Array.isArray(stock)) {
        stock = stock
          .map(item => ({
            size: String(item?.size || '').trim(),
            quantity: Number(item?.quantity) >= 0 ? Number(item.quantity) : 0
          }))
          .filter(item => item.size.length > 0);
      }
      if (stock.length > 0) {
        product.stock = stock;
        product.totalStock = stock.reduce((acc, item) => acc + Number(item.quantity || 0), 0);
      }
    }

    if (req.body.category || req.body.categories) {
      let category = req.body.category || req.body.categories;
      if (typeof category === 'string') {
        product.category = category.split(',').map(c => c.trim()).filter(Boolean);
      } else if (Array.isArray(category)) {
        product.category = category.map(c => String(c).trim()).filter(Boolean);
      }
    }

    if (req.body.name) product.name = String(req.body.name).trim();
    if (req.body.price !== undefined && !isNaN(Number(req.body.price))) product.price = Number(req.body.price);
    if (req.body.originalPrice !== undefined) {
      product.originalPrice = !isNaN(Number(req.body.originalPrice)) ? Number(req.body.originalPrice) : 0;
    }
    if (req.body.image) product.image = String(req.body.image).trim();
    if (req.body.images) {
      product.images = Array.isArray(req.body.images)
        ? req.body.images.map(img => String(img || '').trim()).filter(Boolean)
        : [];
    }
    if (req.body.description) product.description = String(req.body.description).trim();
    
    if (req.body.isNewArrival !== undefined) product.isNewArrival = Boolean(req.body.isNewArrival);
    if (req.body.isBestSeller !== undefined) product.isBestSeller = Boolean(req.body.isBestSeller);
    if (req.body.slug) product.slug = String(req.body.slug).trim();
    if (req.body.rating !== undefined && !isNaN(Number(req.body.rating))) product.rating = Number(req.body.rating);
    if (req.body.numReviews !== undefined && !isNaN(Number(req.body.numReviews))) product.numReviews = Number(req.body.numReviews);
    if (req.body.oldSlugs && Array.isArray(req.body.oldSlugs)) {
      product.oldSlugs = req.body.oldSlugs.map(s => String(s).trim()).filter(Boolean);
    }

    // Artisanal Specifications
    if (req.body.sku !== undefined) product.sku = String(req.body.sku).trim();
    if (req.body.material !== undefined) product.material = String(req.body.material).trim();
    if (req.body.color !== undefined) product.color = String(req.body.color).trim();
    if (req.body.embellishment !== undefined) product.embellishment = String(req.body.embellishment).trim();
    if (req.body.lining !== undefined) product.lining = String(req.body.lining).trim();
    if (req.body.sole !== undefined) product.sole = String(req.body.sole).trim();
    if (req.body.comfortNotes !== undefined) product.comfortNotes = String(req.body.comfortNotes).trim();
    if (req.body.fitTip !== undefined) product.fitTip = String(req.body.fitTip).trim();

    if (req.body.careInstructions !== undefined) {
      product.careInstructions = Array.isArray(req.body.careInstructions)
        ? req.body.careInstructions.map(c => String(c).trim()).filter(Boolean)
        : (typeof req.body.careInstructions === 'string' && req.body.careInstructions.trim())
          ? req.body.careInstructions.split('\n').map(c => c.trim()).filter(Boolean)
          : [];
    }

    if (req.body.occasions !== undefined) {
      product.occasions = Array.isArray(req.body.occasions)
        ? req.body.occasions.map(o => String(o).trim()).filter(Boolean)
        : (typeof req.body.occasions === 'string' && req.body.occasions.trim())
          ? req.body.occasions.split(',').map(o => o.trim()).filter(Boolean)
          : [];
    }

    if (req.body.imageDetails !== undefined) {
      product.imageDetails = Array.isArray(req.body.imageDetails)
        ? req.body.imageDetails.filter(img => img && img.url)
        : [];
    }

    const updatedProduct = await product.save();
    cache.flushAll(); 
    flushSeoCache();
    pingIndexNow([
      `https://beadsandbloom.in/product/${updatedProduct.slug}`,
      'https://beadsandbloom.in/shop',
      'https://beadsandbloom.in/sitemap.xml'
    ]).catch(() => {});
    res.json(updatedProduct);
  } catch (error) {
    console.error("Update Product Error:", error);
    const message = error.errors
      ? Object.values(error.errors).map(e => e.message).join(", ")
      : error.message || "Update Error";
    res.status(500).json({ message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      cache.flushAll(); 
      flushSeoCache();
      pingIndexNow([
        'https://beadsandbloom.in/shop',
        'https://beadsandbloom.in/sitemap.xml'
      ]).catch(() => {});
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
    flushSeoCache();
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