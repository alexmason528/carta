const mongoose = require('mongoose')
const Schema = mongoose.Schema

const friendSchema = new Schema(
  {
    firstUser: { type: Schema.Types.ObjectId, required: true },
    secondUser: { type: Schema.Types.ObjectId, required: true },
  },
  { strict: false, versionKey: false }
)

module.exports = mongoose.model('Friend', friendSchema, 'friend')
