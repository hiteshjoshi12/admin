const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getBestSellers,
  updateBestSeller,
  deleteBestSeller,
  getCollections,
  createCollection,
  deleteCollection,
  getRunwayVideos,
  addRunwayVideo,
  deleteRunwayVideo,
} = require("../controllers/cmsController");

// Best Sellers
router.get("/bestsellers", getBestSellers);
router.post("/bestsellers", protect, admin, updateBestSeller); // POST serves as Upsert
router.delete("/bestsellers/:position", protect, admin, deleteBestSeller);

// Collections
router.get("/collections", getCollections);
router.post("/collections", protect, admin, createCollection);
router.delete("/collections/:id", protect, admin, deleteCollection);

// Runway Videos
router.get("/runway", getRunwayVideos);
router.post("/runway", protect, admin, addRunwayVideo);
router.delete("/runway/:id", protect, admin, deleteRunwayVideo);

module.exports = router;
