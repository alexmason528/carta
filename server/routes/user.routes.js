const express = require('express')
const router = new express.Router()
const UserController = require('../controllers/user.controller')

// Get brochure
router.get('/:username/friends', UserController.getFriends)

// Get wishlist
router.get('/:userID/wishlist', UserController.getWishlist)

// Create wishlist
router.post('/:userID/wishlist', UserController.createWishlist)

// Delete wishlist
router.delete('/:userID/wishlist/:brochureID', UserController.deleteWishlist)

// export default router
module.exports = router
