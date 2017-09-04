const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const typeSchema = new Schema({
  e: Number,
}, { strict: false, versionKey: false });

module.exports = mongoose.model('Type', typeSchema, 'type');
