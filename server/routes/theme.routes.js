const express = require('express')
const router = new express.Router()
const ThemeController = require('../controllers/theme.controller')

// Get brochure
router.get('/', ThemeController.getThemes)

// export default router
module.exports = router
