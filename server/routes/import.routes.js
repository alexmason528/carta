const express = require('express')
const router = new express.Router()

const ImportController = require('../controllers/import.controller')

// Import elements
router.get('/element', ImportController.importElements)

// Import descriptives
router.get('/descriptive', ImportController.importDescriptives)

// Import types
router.get('/type', ImportController.importTypes)

// Import categories
router.get('/category', ImportController.importCategories)

// export default router
module.exports = router
