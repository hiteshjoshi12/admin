const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadFile, deleteFile } = require("../controllers/uploadController"); // Import it
const { protect, admin } = require("../middleware/authMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } 
});

router.post("/", protect, admin, upload.single("file"), uploadFile);
// ADD THE DELETE ROUTE:
router.delete("/", protect, admin, deleteFile); 

module.exports = router;