const express = require('express')
const router = new express.Router()

const MapController = require('../controllers/map.controller')

// Get quest information
router.get('/questinfo', MapController.getQuestInfo)

// Get recommendations
router.post('/recommendations', MapController.getRecommendations)

// Get descriptive categories
router.post('/descriptives', MapController.getDescriptiveCategories)

// export default router
module.exports = router
