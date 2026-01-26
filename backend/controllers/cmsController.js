const BestSeller = require('../models/BestSeller');
const Collection = require('../models/Collection');
const RunwayVideo = require('../models/RunwayVideo');

// --- BEST SELLERS ---
const getBestSellers = async (req, res) => {
  try {
    // Populate product details so we can show names in the Admin UI
    const items = await BestSeller.find().populate('product', 'name image price').sort('position');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateBestSeller = async (req, res) => {
  try {
    const { productId, tag, position } = req.body;
    
    // Upsert: Find by position and update, or create if doesn't exist
    const item = await BestSeller.findOneAndUpdate(
      { position },
      { product: productId, tag, position },
      { new: true, upsert: true }
    );
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update Best Seller' });
  }
};

const deleteBestSeller = async (req, res) => {
  try {
    await BestSeller.findOneAndDelete({ position: req.params.position });
    res.json({ message: 'Removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- COLLECTIONS ---
const getCollections = async (req, res) => {
  try {
    const items = await Collection.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createCollection = async (req, res) => {
  try {
    const newItem = new Collection(req.body);
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create collection' });
  }
};

const deleteCollection = async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};



// ... existing imports and functions ...

// --- RUNWAY VIDEOS ---
const getRunwayVideos = async (req, res) => {
  try {
    const videos = await RunwayVideo.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const addRunwayVideo = async (req, res) => {
  try {
    const video = new RunwayVideo(req.body);
    const savedVideo = await video.save();
    res.status(201).json(savedVideo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add video' });
  }
};

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