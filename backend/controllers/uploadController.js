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

// @desc    Delete file from ImageKit
// @route   DELETE /api/upload
// @access  Private/Admin
const deleteFile = asyncHandler(async (req, res) => {
  const { fileUrl } = req.body;

  if (!fileUrl) {
    return res.status(400).json({ message: "File URL is required" });
  }

  try {
    // 1. Extract the raw filename from the URL 
    // e.g., https://ik.imagekit.io/id/folder/image_abc.jpg -> image_abc.jpg
    const urlObj = new URL(fileUrl);
    const fileName = urlObj.pathname.split('/').pop();

    // 2. Search ImageKit for this filename to get its fileId
    const files = await imagekit.listFiles({
      searchQuery: `name="${fileName}"`
    });

    if (files && files.length > 0) {
      const fileId = files[0].fileId;
      // 3. Delete it using the ID
      await imagekit.deleteFile(fileId);
      res.json({ message: "File deleted successfully from ImageKit" });
    } else {
      res.status(404).json({ message: "File not found in ImageKit" });
    }
  } catch (error) {
    console.error("ImageKit Delete Error:", error);
    res.status(500);
    throw new Error("Failed to delete image from ImageKit");
  }
});

module.exports = { uploadFile, deleteFile };