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
    // ⚡ Performance: Added .lean() for faster read
    const items = await BestSeller.find()
      .populate('product', 'name image price') // Only fetch needed fields
      .sort('position')
      .lean(); 
      
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
    
    const item = await BestSeller.findOneAndUpdate(
      { position }, 
      { product: productId, tag, position },
      { new: true, upsert: true } 
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
    // ⚡ Performance: .lean()
    const items = await Collection.find().lean();
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
    // ⚡ Performance: .lean()
    // Optional: Add .limit(5) if you only want the latest few
    const videos = await RunwayVideo.find()
        .sort({ createdAt: -1 })
        .lean();
        
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