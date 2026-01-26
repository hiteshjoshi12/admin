const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get all reviews (Admin Dashboard)
// @route   GET /api/reviews/admin/all
// @access  Private/Admin
const getAllReviews = async (req, res) => {
  try {
    // Populate product name so Admin knows what item is being reviewed
    const reviews = await Review.find({})
      .populate('product', 'name image')
      .populate('user', 'name')
      .sort({ isApproved: 1, createdAt: -1 }); // Pending first, then newest

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all approved reviews for a specific product (Public)
// @route   GET /api/reviews/:productId
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ 
      product: req.params.productId,
      isApproved: true 
    }).sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new review
// @route   POST /api/reviews/:productId
const createReview = async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const alreadyReviewed = await Review.findOne({
      product: req.params.productId,
      user: req.user._id
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    await Review.create({
      product: req.params.productId,
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
      isApproved: false 
    });

    res.status(201).json({ message: 'Review submitted for moderation' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Approve a review
// @route   PUT /api/reviews/:reviewId/approve
const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) throw new Error('Review not found');

    review.isApproved = true;
    await review.save();

    // Recalculate Product Rating
    const product = await Product.findById(review.product);
    if (product) {
        const allApproved = await Review.find({ product: product._id, isApproved: true });
        product.numReviews = allApproved.length;
        product.rating = allApproved.length > 0 
            ? allApproved.reduce((acc, item) => item.rating + acc, 0) / allApproved.length 
            : 0;
        await product.save();
    }

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
    
    // Grab product ID before deleting review to update stats later
    const productId = review.product;

    await review.deleteOne();

    // Recalculate stats (in case we deleted an approved review)
    const product = await Product.findById(productId);
    if (product) {
        const allApproved = await Review.find({ product: productId, isApproved: true });
        product.numReviews = allApproved.length;
        product.rating = allApproved.length > 0 
            ? allApproved.reduce((acc, item) => item.rating + acc, 0) / allApproved.length 
            : 0;
        await product.save();
    }

    res.json({ message: 'Review Removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
    getAllReviews, 
    getProductReviews, 
    createReview, 
    approveReview, 
    deleteReview 
};