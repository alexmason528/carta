const express = require('express')
const router = new express.Router()
const BrochureController = require('../controllers/brochure.controller')

// Get brochure
router.get('/:link', BrochureController.getBrochure)

// export default router
module.exports = router
