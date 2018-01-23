const uniq = require('lodash/uniq')
const User = require('../models/user')
const Follow = require('../models/follow')
const Wishlist = require('../models/wishlist')

/**
 * Get friends
 */
exports.getFriends = (req, res) => {
  const { username } = req.params

  User.findOne({ username }, (err, user) => {
    if (err || !user) {
      return res.status(400).send({
        error: { details: err ? err.toString() : 'Invalid user' },
      })
    }

    Follow.find({ follower: user._id }, (ferr, follow) => {
      if (ferr) {
        return res.status(400).send({
          error: { details: ferr.toString() },
        })
      }

      let followedList = []

      for (let entry of follow) {
        followedList.push(entry.followed)
      }

      followedList = uniq(followedList)

      User.find({ _id: { $in: followedList } }, (uerr, results) => {
        if (uerr) {
          return res.status(400).send({ error: { details: uerr.toString() } })
        }
        return res.json({ fullname: user.fullname, holidayPic: user.holidayPic, friends: results })
      })
    })
  })
}

/**
 * Get wishlist
 */

exports.getWishlist = (req, res) => {
  const { userID } = req.params
  Wishlist.find({ userID }, (err, wishlist) => {
    if (err) {
      return res.status(400).send({ error: { details: err.toString() } })
    }
    return res.json(wishlist)
  })
}

/**
 * Create wishlist
 */
exports.createWishlist = (req, res) => {
  const { userID } = req.params
  const { brochureID, quest } = req.body

  Wishlist.findOne({ userID, brochureID }, (err, wishlist) => {
    if (err || wishlist) {
      return res.status(400).send({
        error: { details: err ? err.toString() : 'Already exist' },
      })
    }
    Wishlist.create({ userID, brochureID, quest }, err => {
      if (err) {
        return res.status(400).send({ error: { details: err.toString() } })
      }
      return res.json({ userID, brochureID, quest })
    })
  })
}

/**
 * Delete wishlist
 */
exports.deleteWishlist = (req, res) => {
  const { userID, brochureID } = req.params

  Wishlist.remove({ userID, brochureID }, err => {
    if (err) {
      return res.status(400).send({ error: { details: err.toString() } })
    }
    return res.json({ userID, brochureID })
  })
}
