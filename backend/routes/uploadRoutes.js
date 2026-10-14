const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadFile, deleteFile } = require("../controllers/uploadController"); // Import it
const { protect, admin } = require("../middleware/authMiddleware");

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/quicktime',
  'video/webm'
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Only images (JPG, PNG, WEBP) and videos (MP4) are allowed.`), false);
  }
};

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // Max 25MB
  fileFilter
});

router.post("/", protect, admin, upload.single("file"), uploadFile);
// ADD THE DELETE ROUTE:
router.delete("/", protect, admin, deleteFile); 

module.exports = router;