const mongoose = require('mongoose')
const Schema = mongoose.Schema

const followSchema = new Schema(
  {
    follower: { type: Schema.Types.ObjectId, required: true },
    followed: { type: Schema.Types.ObjectId, required: true },
  },
  { strict: false, versionKey: false }
)

module.exports = mongoose.model('Follow', followSchema, 'follow')
