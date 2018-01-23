const express = require('express')
const router = new express.Router()
const WishlistController = require('../controllers/wishlist.controller')

// Get wishlist
router.get('/:username', WishlistController.getWishlist)

// Delete wishlist
router.delete('/:wishlistID', WishlistController.deleteWishlist)

// export default router
module.exports = router
