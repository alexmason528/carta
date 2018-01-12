const mongoose = require('mongoose')
const Schema = mongoose.Schema

const placeSchema = new Schema(
  { title: String, url: String, link: String },
  { strict: false, versionKey: false }
)

module.exports = mongoose.model('Place', placeSchema, 'place')
