const mongoose = require('mongoose')
const Schema = mongoose.Schema

const elementDescriptiveRelationSchema = new Schema(
  {
    e: Number,
    name: String,
    rep: Number,
    sum: Number,
  },
  { strict: false, versionKey: false }
)

module.exports = mongoose.model('ElementDescriptiveRelation', elementDescriptiveRelationSchema, 'elementDescriptiveRelation')
