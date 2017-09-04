const express = require('express');
const router = new express.Router();

const ImportController = require('../controllers/import.controller');

// Import elements
router.route('/element').get(ImportController.importElements);

// Import descriptives
router.route('/descriptive').get(ImportController.importDescriptives);

// Import types
router.route('/type').get(ImportController.importTypes);

// export default router;
module.exports = router;