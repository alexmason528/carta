const mongoose = require('mongoose')
const Schema = mongoose.Schema

const descriptiveSchema = new Schema({
  e: Number,
}, { strict: false, versionKey: false })

module.exports = mongoose.model('Descriptive', descriptiveSchema, 'descriptive')
