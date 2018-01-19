const mongoose = require('mongoose')
const Schema = mongoose.Schema

const themeSchema = new Schema({ url: String, link: String }, { strict: false, versionKey: false })

module.exports = mongoose.model('Theme', themeSchema, 'theme')
