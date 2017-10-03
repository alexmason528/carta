const express = require('express');
const router = new express.Router();

const CommunityController = require('../controllers/community.controller');

// Fetch community information
router.route('/info').get(CommunityController.getCommunityInfo);

// export default router;
module.exports = router;
