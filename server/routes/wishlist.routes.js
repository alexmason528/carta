const express = require('express')
const router = new express.Router()
const WishlistController = require('../controllers/wishlist.controller')

// Get wishlist
router.get('/:username', WishlistController.getWishlist)

// Create wishlist
router.post('/', WishlistController.createWishlist)

// Delete wishlist
router.delete('/:brochureID/user/:userID', WishlistController.deleteWishlist)

// export default router
module.exports = router
