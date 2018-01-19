const uniq = require('lodash/uniq')
const User = require('../models/user')
const Friend = require('../models/friend')

/**
 * Get friends
 */
exports.getFriends = (req, res) => {
  const { username } = req.params

  User.findOne({ username }, (err, user) => {
    if (err) {
      return res.status(400).send({
        error: { details: err.toString() },
      })
    }

    Friend.find(
      {
        $or: [{ firstUser: user._id }, { secondUser: user._id }],
      },
      (ferr, friends) => {
        if (ferr) {
          return res.status(400).send({
            error: { details: ferr.toString() },
          })
        }

        let friendList = []

        for (let friend of friends) {
          friendList.push(
            friend.firstUser.toString() === user._id.toString()
              ? friend.secondUser
              : friend.firstUser
          )
        }

        friendList = uniq(friendList)

        User.find({ _id: { $in: friendList } }, (uerr, results) => {
          if (uerr) {
            return res.status(400).send({
              error: { details: uerr.toString() },
            })
          }
          return res.json(results)
        })
      }
    )
  })
}
