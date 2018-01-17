const express = require('express')
const router = new express.Router()

const ImportController = require('../controllers/import.controller')

// Import elements
router.get('/elements', ImportController.importElements)

// Import typeCategories
router.get('/typeCategories', ImportController.importTypeCategories)

// Import descriptiveCategories
router.get(
  '/descriptiveCategories',
  ImportController.importDescriptiveCategories
)

// Import typeDescriptiveRelations
router.get(
  '/typeDescriptiveRelations',
  ImportController.importTypeDescriptiveRelations
)

// Import elementTypeRelations
router.get('/elementTypeRelations', ImportController.importElementTypeRelations)

// Import elementDescriptiveRelations
router.get(
  '/elementDescriptiveRelations',
  ImportController.importElementDescriptiveRelations
)

// export default router
module.exports = router
