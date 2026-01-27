const BestSeller = require('../models/BestSeller');
const Collection = require('../models/Collection');
const RunwayVideo = require('../models/RunwayVideo');

// ==========================================
// BEST SELLERS MANAGEMENT
// ==========================================

// @desc    Get all Best Seller slots
// @route   GET /api/cms/bestsellers
// @access  Public
const getBestSellers = async (req, res) => {
  try {
    // 1. Fetch items
    // 2. .populate('product') -> Replaces the Product ID with actual product data (name, image, price)
    // 3. .sort('position') -> Ensures Slot 1 comes before Slot 2 in the UI
    const items = await BestSeller.find()
      .populate('product', 'name image price')
      .sort('position');
      
    res.json(items);
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update or Create a Best Seller Slot
// @route   POST /api/cms/bestsellers
// @access  Private/Admin
const updateBestSeller = async (req, res) => {
  try {
    const { productId, tag, position } = req.body;
    
    // LOGIC: "Upsert" (Update if exists, Insert if new)
    // We search by 'position'. If Slot 1 exists, we overwrite it.
    // If Slot 1 doesn't exist, we create it.
    const item = await BestSeller.findOneAndUpdate(
      { position }, 
      { product: productId, tag, position },
      { new: true, upsert: true } // options: return new doc, create if missing
    );

    res.json(item);
  } catch (error) {
    console.error("Error updating best seller:", error);
    res.status(500).json({ message: 'Failed to update Best Seller' });
  }
};

// @desc    Clear a Best Seller Slot
// @route   DELETE /api/cms/bestsellers/:position
// @access  Private/Admin
const deleteBestSeller = async (req, res) => {
  try {
    // We delete by 'position' (e.g., Clear Slot 2) rather than ID
    await BestSeller.findOneAndDelete({ position: req.params.position });
    res.json({ message: 'Removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ==========================================
// COLLECTIONS MANAGEMENT
// ==========================================

// @desc    Get all Collections
// @route   GET /api/cms/collections
// @access  Public
const getCollections = async (req, res) => {
  try {
    const items = await Collection.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new Collection
// @route   POST /api/cms/collections
// @access  Private/Admin
const createCollection = async (req, res) => {
  try {
    const newItem = new Collection(req.body);
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create collection' });
  }
};

// @desc    Delete a Collection
// @route   DELETE /api/cms/collections/:id
// @access  Private/Admin
const deleteCollection = async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ==========================================
// RUNWAY VIDEOS MANAGEMENT
// ==========================================

// @desc    Get all Runway Videos
// @route   GET /api/cms/runway-videos
// @access  Public
const getRunwayVideos = async (req, res) => {
  try {
    // Sort by createdAt: -1 to show the newest videos first
    const videos = await RunwayVideo.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a new Runway Video
// @route   POST /api/cms/runway-videos
// @access  Private/Admin
const addRunwayVideo = async (req, res) => {
  try {
    const video = new RunwayVideo(req.body);
    const savedVideo = await video.save();
    res.status(201).json(savedVideo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add video' });
  }
};

// @desc    Delete a Runway Video
// @route   DELETE /api/cms/runway-videos/:id
// @access  Private/Admin
const deleteRunwayVideo = async (req, res) => {
  try {
    await RunwayVideo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getBestSellers,
  updateBestSeller,
  deleteBestSeller,
  getCollections,
  createCollection,
  deleteCollection,
  getRunwayVideos,
  addRunwayVideo,
  deleteRunwayVideo
};