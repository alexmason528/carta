const mongoose = require('mongoose')
const Schema = mongoose.Schema

const elementSchema = new Schema(
  {
    e: Number,
    name: String,
    label: String,
    type: String,
    x: Number,
    y: Number,
    zmin: Number,
    zmax: Number,
    zoom: Number,
    code: String,
    link: String,
    source: String,
    display: String,
    admin: Number,
    country: String,
    muni: String,
    street: String,
    nr: String,
    area: Number,
    pop: String,
  },
  { strict: false, versionKey: false }
)

module.exports = mongoose.model('Element', elementSchema, 'element')
