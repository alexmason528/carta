const express = require('express')
const router = new express.Router()
const UserController = require('../controllers/user.controller')

// Get friends
router.get('/:username/friends', UserController.getFriends)

// export default router
module.exports = router
