const SiteContent = require('../models/SiteContent');

// @desc    Get site content
const getContent = async (req, res) => {
  try {
    const content = await SiteContent.findOne();
    if (content) {
      res.json(content);
    } else {
      // Return empty structure if nothing saved yet
      res.json({
        heroSlides: [], // Empty array triggers frontend fallback
        instagram: {}
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update site content
const updateContent = async (req, res) => {
  try {
    let content = await SiteContent.findOne();

    if (content) {
      // Update existing
      content.heroSlides = req.body.heroSlides || content.heroSlides; // <--- Arrays
      content.instagram = req.body.instagram || content.instagram;
      const updatedContent = await content.save();
      res.json(updatedContent);
    } else {
      // Create new
      const newContent = new SiteContent({
        heroSlides: req.body.heroSlides, // <--- Arrays
        instagram: req.body.instagram
      });
      const savedContent = await newContent.save();
      res.status(201).json(savedContent);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getContent, updateContent };