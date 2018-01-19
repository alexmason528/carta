const mongoose = require('mongoose')
const Schema = mongoose.Schema

const elementTypeRelationSchema = new Schema(
  {
    e: Number,
    name: String,
    sum: Number,
  },
  { strict: false, versionKey: false }
)

module.exports = mongoose.model('ElementTypeRelation', elementTypeRelationSchema, 'elementTypeRelation')
