const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const suggestionSchema = new Schema({
  title: String,
  img: String,
}, { strict: false, versionKey: false });

module.exports = mongoose.model('Suggestion', suggestionSchema, 'suggestion');
