const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
  c: String,
}, { strict: false, versionKey: false })

module.exports = mongoose.model('Category', categorySchema, 'category')
