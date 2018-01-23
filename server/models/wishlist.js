const mongoose = require('mongoose')
const Schema = mongoose.Schema

const wishlistSchema = new Schema(
  {
    userID: { type: Schema.Types.ObjectId, required: true },
    brochureID: { type: Schema.Types.ObjectId, required: true },
    quest: { type: String, required: true },
  },
  { strict: false, versionKey: false }
)

module.exports = mongoose.model('Wishlist', wishlistSchema, 'wishlist')
