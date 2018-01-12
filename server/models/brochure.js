const mongoose = require('mongoose')
const Schema = mongoose.Schema

const brochureSchema = new Schema({}, { strict: false, versionKey: false })

module.exports = mongoose.model('Brochure', brochureSchema, 'brochure')
