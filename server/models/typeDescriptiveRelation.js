const mongoose = require('mongoose')
const Schema = mongoose.Schema

const typeDescriptiveRelationSchema = new Schema(
  {
    d: Number,
    name: String,
    sum: Number,
  },
  { strict: false, versionKey: false }
)

module.exports = mongoose.model(
  'TypeDescriptiveRelation',
  typeDescriptiveRelationSchema,
  'typeDescriptiveRelation'
)
