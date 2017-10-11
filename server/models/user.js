const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, require: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile_pic: String,
  cover_img: String,
  verified: Boolean,
}, { strict: false, versionKey: false })

module.exports = mongoose.model('User', userSchema, 'user')
