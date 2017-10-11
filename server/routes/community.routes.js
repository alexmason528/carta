const express = require('express')
const router = new express.Router()

const CommunityController = require('../controllers/community.controller')

// Fetch community information
router.get('/info', CommunityController.getCommunityInfo)

// export default router
module.exports = router
