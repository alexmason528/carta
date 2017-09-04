const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const elementSchema = new Schema({
  e: Number,
  name: String,
  label: String,
  type: String,
  x: Number,
  y: Number,
  zmin: Number,
  zmax: Number,
  zoom: Number,
  area: Number,
  code: String,
  link: String,
  source: String,
  display: String,
  admin: Number,
}, { strict: false, versionKey: false });

module.exports = mongoose.model('Element', elementSchema, 'element');
