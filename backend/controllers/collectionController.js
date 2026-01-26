const Collection = require('../models/Collection');

// @desc    Fetch all collections
// @route   GET /api/collections
// @access  Public
const getCollections = async (req, res) => {
  try {
    // OLD CODE (CAUSING ERROR 500):
    // const collections = await Collection.find({ isActive: true }).populate('products');

    // NEW CODE (SIMPLE):
    const collections = await Collection.find({ isActive: true }); 

    res.json(collections);
  } catch (error) {
    console.error("Error in getCollections:", error); // Log the actual error to terminal
    res.status(500).json({ message: 'Server Error' });
  }
};

const createCollection = async (req, res) => {
  const { name, image, isActive } = req.body;

  try {
    const collection = await Collection.create({
      name,
      image,
      isActive
    });
    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCollections, createCollection };