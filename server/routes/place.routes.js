const express = require('express')
const router = new express.Router()
const PlaceController = require('../controllers/place.controller')

// Get brochure
router.get('/', PlaceController.getPlaces)

// export default router
module.exports = router
