const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadFile } = require("../controllers/uploadController");
const { protect, admin } = require("../middleware/authMiddleware");

// Configure Multer to store file in memory (RAM) temporarily
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Limit to 10MB (Video support)
});

// The route expects a field named 'file'
router.post("/", protect, admin, upload.single("file"), uploadFile);

module.exports = router;