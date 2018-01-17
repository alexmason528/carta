const express = require('express')
const router = new express.Router()

const SuggestionController = require('../controllers/suggestion.controller')

router.get('/', SuggestionController.listSuggestions)

// export default router
module.exports = router
