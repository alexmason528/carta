const User = require('../models/user')

/**
 * Get friends
 */
exports.getFriends = (req, res) => {
  const { userID } = req.params

  User.find({ _id: userID }, { _id: 0, friends: 1 }, (err, friends) => {
    if (err) {
      return res.status(400).send({
        error: { details: err.toString() },
      })
    }

    return res.json(friends)
  })
}
