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
