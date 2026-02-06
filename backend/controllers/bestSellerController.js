const BestSeller = require('../models/BestSeller');

// @desc    Fetch all best sellers (populated with product data)
// @route   GET /api/bestsellers
// @access  Public
const getBestSellers = async (req, res) => {
  try {
    // ✅ FIX: Added 'slug' to the fields to be populated
    const bestSellers = await BestSeller.find({})
      .populate('product', 'name image price slug') 
      .sort({ position: 1 });

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
    const existingSlot = await BestSeller.findOne({ position });

    if (existingSlot) {
      existingSlot.product = productId;
      existingSlot.tag = tag;
      await existingSlot.save();
      
      // ✅ Best Practice: Re-populate after saving so the admin 
      // response also contains the slug for immediate UI feedback.
      const updatedSlot = await BestSeller.findById(existingSlot._id)
        .populate('product', 'name image price slug');
        
      res.json(updatedSlot);
    } else {
      const newSlot = await BestSeller.create({
        product: productId,
        tag,
        position
      });
      
      const populatedNewSlot = await BestSeller.findById(newSlot._id)
        .populate('product', 'name image price slug');

      res.status(201).json(populatedNewSlot);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBestSellers, setBestSeller };