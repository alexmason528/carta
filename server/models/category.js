const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  c: String,
  name: String,
}, { strict: false, versionKey: false });

module.exports = mongoose.model('Category', categorySchema, 'descriptive');
