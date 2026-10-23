const SiteContent = require('../models/SiteContent');
const defaultFestiveContent = require('../data/defaultFestiveContent');
const defaultAboutContent = require('../data/defaultAboutContent');

// @desc    Get site content
const getContent = async (req, res) => {
  try {
    let content = await SiteContent.findOne();
    if (content) {
      // Ensure shippingSettings has defaults if missing in existing doc
      if (!content.shippingSettings) {
        content.shippingSettings = {
          standardShipping: 150,
          ncrShipping: 100,
          freeShippingThreshold: 5000,
          ncrPincodePrefixes: "11,12,201"
        };
      } else {
        if (typeof content.shippingSettings.standardShipping !== 'number') {
          content.shippingSettings.standardShipping = 150;
        }
        if (typeof content.shippingSettings.ncrShipping !== 'number') {
          content.shippingSettings.ncrShipping = 100;
        }
        if (typeof content.shippingSettings.freeShippingThreshold !== 'number') {
          content.shippingSettings.freeShippingThreshold = 5000;
        }
        if (!content.shippingSettings.ncrPincodePrefixes) {
          content.shippingSettings.ncrPincodePrefixes = "11,12,201";
        }
      }

      // Ensure festiveContent has defaults if missing
      if (!content.festiveContent || !content.festiveContent.occasions || content.festiveContent.occasions.length === 0) {
        content.festiveContent = defaultFestiveContent;
      }

      // Ensure aboutContent has defaults if missing
      if (!content.aboutContent || !content.aboutContent.pillars || content.aboutContent.pillars.length === 0) {
        content.aboutContent = defaultAboutContent;
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
        },
        festiveContent: defaultFestiveContent,
        aboutContent: defaultAboutContent
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
        content.markModified('shippingSettings');
      }
      if (req.body.festiveContent !== undefined) {
        content.festiveContent = req.body.festiveContent;
        content.markModified('festiveContent');
      }
      if (req.body.aboutContent !== undefined) {
        content.aboutContent = req.body.aboutContent;
        content.markModified('aboutContent');
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
        },
        festiveContent: req.body.festiveContent || defaultFestiveContent,
        aboutContent: req.body.aboutContent || defaultAboutContent
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