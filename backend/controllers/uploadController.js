const ImageKit = require("imagekit");
const asyncHandler = require("express-async-handler");

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// @desc    Upload file to ImageKit
// @route   POST /api/upload
// @access  Private/Admin
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  try {
    // Upload to ImageKit
    const result = await imagekit.upload({
      file: req.file.buffer, // Multer stores file in memory buffer
      fileName: req.file.originalname,
      folder: "/ecommerce_uploads", // Optional: Organize your uploads
    });

    // Return the URL
    res.json({
      url: result.url,
      fileId: result.fileId,
      thumbnail: result.thumbnailUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error("ImageKit Upload Failed");
  }
});

module.exports = { uploadFile };