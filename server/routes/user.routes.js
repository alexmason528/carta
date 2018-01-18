const express = require('express')
const router = new express.Router()
const UserController = require('../controllers/user.controller')

// Get brochure
router.get('/:userID/friends', UserController.getFriends)

// export default router
module.exports = router
