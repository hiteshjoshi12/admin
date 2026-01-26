const BestSeller = require('../models/BestSeller');

// @desc    Fetch all best sellers (populated with product data)
// @route   GET /api/bestsellers
// @access  Public
const getBestSellers = async (req, res) => {
  try {
    // .populate('product') is the magic command. 
    // It replaces the product ID with the actual product object (name, image, price).
    const bestSellers = await BestSeller.find({})
      .populate('product', 'name image price') // Only fetch fields we need
      .sort({ position: 1 }); // Ensure they come in order 1, 2, 3

    res.json(bestSellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add or Update a Best Seller slot
// @route   POST /api/bestsellers
// @access  Private/Admin
const setBestSeller = async (req, res) => {
  const { productId, tag, position } = req.body;

  try {
    // Check if this position is already taken
    const existingSlot = await BestSeller.findOne({ position });

    if (existingSlot) {
      // Update existing slot
      existingSlot.product = productId;
      existingSlot.tag = tag;
      await existingSlot.save();
      res.json(existingSlot);
    } else {
      // Create new slot
      const newSlot = await BestSeller.create({
        product: productId,
        tag,
        position
      });
      res.status(201).json(newSlot);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBestSellers, setBestSeller };