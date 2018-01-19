const Suggestion = require('../models/suggestion')

/**
 * List suggestions
 */

exports.listSuggestions = (req, res) => {
  Suggestion.find({}, { _id: 0 }, (err, elements) => {
    if (err) {
      return res.status(400).send({ error: { details: err.toString() } })
    }
    return res.json(elements)
  })
}
