const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placeSchema = new Schema({}, { strict: false, versionKey: false });

module.exports = mongoose.model('Place', placeSchema, 'place');
