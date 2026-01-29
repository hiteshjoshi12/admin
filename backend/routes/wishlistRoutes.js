const express = require('express');
const router = express.Router();
const { getMyWishlist, toggleWishlistItem } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMyWishlist);
router.post('/:id', protect, toggleWishlistItem);

module.exports = router;