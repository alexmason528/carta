const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
  title: Schema.Types.Mixed,
  created_at: { type: Date, default: Date.now },
  content: Schema.Types.Mixed,
  img: String,
  author: Schema.Types.ObjectId,
}, { strict: false, versionKey: false })

module.exports = mongoose.model('Post', postSchema, 'post')
