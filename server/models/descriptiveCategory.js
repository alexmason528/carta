const mongoose = require('mongoose')
const Schema = mongoose.Schema

const descriptiveCategorySchema = new Schema(
  {
    d: String,
    en: String,
    nl: String,
  },
  { strict: false, versionKey: false }
)

module.exports = mongoose.model('DescriptiveCategory', descriptiveCategorySchema, 'descriptiveCategory')
