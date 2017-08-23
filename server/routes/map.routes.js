const express = require('express');
const router = new express.Router();

const MapController = require('../controllers/map.controller');

// Get quest information
router.route('/questinfo').get(MapController.getQuestInfo);

// Get recommendations
router.route('/recommendation').post(MapController.getRecommendations);

// Get place
router.route('/place').post(MapController.getPlace);

// export default router;
module.exports = router;
