const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const elementSchema = new Schema({}, { strict: false, versionKey: false });

module.exports = mongoose.model('Element', elementSchema, 'element');
