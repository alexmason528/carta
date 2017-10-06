const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  profile_pic: String,
  cover_img: String,
  verified: Boolean,
}, { strict: false, versionKey: false })

module.exports = mongoose.model('User', userSchema, 'user')
