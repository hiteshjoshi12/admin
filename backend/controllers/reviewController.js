const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// --- HELPER: RECALCULATE RATINGS ---
// We keep this internal function to avoid code duplication
const updateProductRating = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) return;

  const allApproved = await Review.find({ product: productId, isApproved: true });
  
  product.numReviews = allApproved.length;
  product.rating = allApproved.length > 0 
    ? allApproved.reduce((acc, item) => item.rating + acc, 0) / allApproved.length 
    : 0;

  await product.save();
};

// @desc    Get all reviews (Admin Dashboard)
// @route   GET /api/reviews/admin/all
// @access  Private/Admin
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate('product', 'name image slug') // Useful for admin to see context
      .populate('user', 'name email')
      .sort({ isApproved: 1, createdAt: -1 }); // Pending at top

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all approved reviews for a specific product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ 
      product: req.params.productId,
      isApproved: true // SECURITY: Only show approved
    }).sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new review
// @route   POST /api/reviews/:productId
// @access  Private
const createReview = async (req, res) => {
  const { rating, comment, title, images, purchasedSize } = req.body;
  const { productId } = req.params;

  try {
    // 1. Check if product exists first
    const product = await Product.findById(productId);
    if (!product) {
       res.status(404);
       throw new Error('Product not found');
    }

    // 2. Check for duplicates
    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('You have already reviewed this product');
    }

    // 3. Check for Verified Purchase against user's past orders
    const pastOrder = await Order.findOne({
      user: req.user._id,
      'orderItems.product': productId
    });

    const isVerifiedPurchase = Boolean(pastOrder);
    const matchedOrderItem = pastOrder?.orderItems?.find(item => String(item.product) === String(productId));
    const finalSize = purchasedSize || matchedOrderItem?.size || '';

    const sanitizedImages = Array.isArray(images)
      ? images.map(img => String(img).trim()).filter(Boolean)
      : [];

    // 4. Create Review (Pending Approval)
    await Review.create({
      product: productId,
      user: req.user._id,
      name: req.user.name,
      title: String(title || '').trim(),
      rating: Number(rating),
      comment: String(comment || '').trim(),
      images: sanitizedImages,
      isVerifiedPurchase,
      purchasedSize: finalSize,
      isApproved: false // Default to false for moderation
    });

    res.status(201).json({ 
      message: 'Review submitted for moderation. Thank you for your authentic feedback!',
      isVerifiedPurchase
    });
  } catch (error) {
    // Handle 400 vs 500 errors gracefully
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

// @desc    Approve a review
// @route   PUT /api/reviews/:reviewId/approve
// @access  Private/Admin
const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    review.isApproved = true;
    await review.save();

    // Use Helper
    await updateProductRating(review.product);

    res.json({ message: 'Review Approved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
// @access  Private/Admin
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }
    
    const productId = review.product; // Capture ID before delete

    await review.deleteOne();

    // Use Helper (Recalculate just in case an approved review was deleted)
    await updateProductRating(productId);

    res.json({ message: 'Review Removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Update an existing review
// @route   PUT /api/reviews/:reviewId
// @access  Private
const updateReview = async (req, res) => {
  const { rating, comment, title, images, purchasedSize } = req.body;

  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    // 1. CHECK OWNERSHIP
    if (review.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to edit this review');
    }

    // 2. UPDATE FIELDS
    review.rating = Number(rating) || review.rating;
    review.comment = comment !== undefined ? String(comment).trim() : review.comment;
    if (title !== undefined) review.title = String(title).trim();
    if (purchasedSize !== undefined) review.purchasedSize = String(purchasedSize).trim();
    if (Array.isArray(images)) {
      review.images = images.map(img => String(img).trim()).filter(Boolean);
    }

    // 3. SECURITY: RESET APPROVAL
    review.isApproved = false;

    await review.save();

    // 4. RECALCULATE RATING
    await updateProductRating(review.product);

    res.json({ message: 'Review updated and sent for approval' });
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

// @desc    Vote a review as helpful
// @route   POST /api/reviews/:reviewId/helpful
// @access  Public
const voteHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }
    review.helpfulVotes = (review.helpfulVotes || 0) + 1;
    await review.save();
    res.json({ helpfulVotes: review.helpfulVotes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
    getAllReviews, 
    getProductReviews, 
    createReview, 
    approveReview, 
    deleteReview,
    updateReview,
    voteHelpful
};