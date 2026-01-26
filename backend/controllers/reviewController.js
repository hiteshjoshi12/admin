const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get all approved reviews for a specific product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    // Only fetch reviews that belong to this product AND are approved
    const reviews = await Review.find({ 
      product: req.params.productId,
      isApproved: true 
    }).sort({ createdAt: -1 }); // Newest first

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new review
// @route   POST /api/reviews/:productId
// @access  Private
const createReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    // 1. Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      product: req.params.productId,
      user: req.user._id
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    // 2. Create the review
    const review = await Review.create({
      product: req.params.productId,
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
      isApproved: false // Explicitly false
    });

    res.status(201).json({ message: 'Review submitted for moderation' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Approve a review (Admin)
// @route   PUT /api/reviews/:reviewId/approve
// @access  Private/Admin
const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    // 1. Mark as approved
    review.isApproved = true;
    await review.save();

    // 2. OPTIONAL: Update the Product's average rating 
    // (This updates values, NOT structure, so it is safe)
    const product = await Product.findById(review.product);
    if (product) {
        // Calculate new average from Review collection
        const allApproved = await Review.find({ product: product._id, isApproved: true });
        
        product.numReviews = allApproved.length;
        product.rating = allApproved.reduce((acc, item) => item.rating + acc, 0) / allApproved.length;
        
        await product.save();
    }

    res.json({ message: 'Review Approved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProductReviews, createReview, approveReview };