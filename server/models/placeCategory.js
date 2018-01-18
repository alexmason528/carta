const mongoose = require('mongoose')
const Schema = mongoose.Schema

const placeCategorySchema = new Schema(
  {
    name: String,
    center: Schema.Types.Mixed,
    zoom: Number,
  },
  { strict: false, versionKey: false }
)

module.exports = mongoose.model(
  'PlaceCategory',
  placeCategorySchema,
  'placeCategory'
)
