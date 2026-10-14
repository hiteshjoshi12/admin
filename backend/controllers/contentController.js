const SiteContent = require('../models/SiteContent');

// @desc    Get site content
const getContent = async (req, res) => {
  try {
    let content = await SiteContent.findOne();
    if (content) {
      // Ensure shippingSettings has defaults if missing in existing doc
      if (!content.shippingSettings || typeof content.shippingSettings.standardShipping !== 'number') {
        content.shippingSettings = {
          standardShipping: 150,
          ncrShipping: 100,
          freeShippingThreshold: 5000,
          ncrPincodePrefixes: "11,12,201"
        };
      }
      res.json(content);
    } else {
      // Return empty structure if nothing saved yet
      res.json({
        heroSlides: [], // Empty array triggers frontend fallback
        instagram: {},
        shippingSettings: {
          standardShipping: 150,
          ncrShipping: 100,
          freeShippingThreshold: 5000,
          ncrPincodePrefixes: "11,12,201"
        }
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
      if (req.body.heroSlides !== undefined) content.heroSlides = req.body.heroSlides;
      if (req.body.instagram !== undefined) content.instagram = req.body.instagram;
      if (req.body.shippingSettings !== undefined) {
        content.shippingSettings = {
          standardShipping: Number(req.body.shippingSettings.standardShipping) >= 0 ? Number(req.body.shippingSettings.standardShipping) : 150,
          ncrShipping: Number(req.body.shippingSettings.ncrShipping) >= 0 ? Number(req.body.shippingSettings.ncrShipping) : 100,
          freeShippingThreshold: Number(req.body.shippingSettings.freeShippingThreshold) >= 0 ? Number(req.body.shippingSettings.freeShippingThreshold) : 5000,
          ncrPincodePrefixes: req.body.shippingSettings.ncrPincodePrefixes || "11,12,201"
        };
      }
      const updatedContent = await content.save();
      res.json(updatedContent);
    } else {
      // Create new
      const newContent = new SiteContent({
        heroSlides: req.body.heroSlides || [],
        instagram: req.body.instagram || {},
        shippingSettings: req.body.shippingSettings || {
          standardShipping: 150,
          ncrShipping: 100,
          freeShippingThreshold: 5000,
          ncrPincodePrefixes: "11,12,201"
        }
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