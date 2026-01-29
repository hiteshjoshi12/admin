const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get User Wishlist
// @route   GET /api/wishlist
// @access  Private
const getMyWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items.product');
    
    if (!wishlist) {
      // If no wishlist exists yet, return empty array
      return res.json([]);
    }

    // Return just the list of products to keep frontend easy
    // Filter out null products (in case a product was deleted from DB)
    const products = wishlist.items
      .filter(item => item.product !== null)
      .map(item => item.product);
      
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle Wishlist Item (Add/Remove)
// @route   POST /api/wishlist/:id
// @access  Private
const toggleWishlistItem = async (req, res) => {
  const { id: productId } = req.params;
  const userId = req.user._id;

  try {
    // 1. Find or Create Wishlist for User
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, items: [] });
    }

    // 2. Check if product exists in list
    const itemIndex = wishlist.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // REMOVE
      wishlist.items.splice(itemIndex, 1);
    } else {
      // ADD
      wishlist.items.push({ product: productId });
    }

    await wishlist.save();

    // 3. Return updated list (Populated)
    const updatedWishlist = await Wishlist.findOne({ user: userId }).populate('items.product');
    
    const products = updatedWishlist.items
      .filter(item => item.product !== null)
      .map(item => item.product);

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyWishlist, toggleWishlistItem };