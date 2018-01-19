const uniq = require('lodash/uniq')
const User = require('../models/user')
const Follow = require('../models/follow')

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

    Follow.find({ followed: user._id }, (ferr, follow) => {
      if (ferr) {
        return res.status(400).send({
          error: { details: ferr.toString() },
        })
      }

      let followerList = []

      for (let entry of follow) {
        followerList.push(entry.follower)
      }

      followerList = uniq(followerList)

      User.find({ _id: { $in: followerList } }, (uerr, results) => {
        if (uerr) {
          return res.status(400).send({
            error: { details: uerr.toString() },
          })
        }
        return res.json({ fullname: user.fullname, holidayPic: user.holidayPic, friends: results })
      })
    })
  })
}
