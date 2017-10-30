const mongoose = require('mongoose')
const Suggestion = require('../models/suggestion')
const Schema = mongoose.Schema

/**
 * list suggestion
 * @param req
 * @param res
 * @returns suggestion list
 */

const listSuggestion = (req, res) => {
  Suggestion.find({}, { _id: 0 }, (err, elements) => {
    if (err) {
      return res.status(400).send({
        error: {
          details: err,
        },
      })
    } else {
      return res.json(elements)
    }
  })
}

module.exports.listSuggestion = listSuggestion
