const express = require('express');
const MapController = require('../controllers/map.controller');
const router = new express.Router();

// Get all categories
router.route('/category').get(MapController.getCategories);

// Get recommendations
router.route('/recommendation').post(MapController.getRecommendations);

// Get place
router.route('/place').post(MapController.getPlace);

// export default router;
module.exports = router;
