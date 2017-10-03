const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: String,
  created_at: { type: Date, default: Date.now },
  content: String,
  img: String,
  author: Number,
}, { strict: false, versionKey: false });

module.exports = mongoose.model('Post', postSchema, 'post');
