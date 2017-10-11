const express = require('express')
const router = new express.Router()

const MapController = require('../controllers/map.controller')

// Get quest information
router.get('/questinfo', MapController.getQuestInfo)

// Get recommendations
router.post('/recommendation', MapController.getRecommendations)

// Get place
router.post('/place', MapController.getPlace)

// export default router
module.exports = router
