const User = require('../models/user')
const Wishlist = require('../models/wishlist')

/**
 * Get wishlist
 */

exports.getWishlist = (req, res) => {
  const { username } = req.params
  User.findOne({ username }, (err, user) => {
    if (err || !user) {
      return res.status(400).send({ error: { details: err ? err.toString() : 'Invalid user' } })
    }

    const pipeline = [
      {
        $lookup: {
          from: 'brochure',
          localField: 'brochureID',
          foreignField: '_id',
          as: 'brochure',
        },
      },
      {
        $unwind: '$brochure',
      },
      {
        $match: {
          userID: user._id,
        },
      },
      {
        $project: {
          _id: 1,
          brochureID: 1,
          quest: 1,
          brochure: {
            name: 1,
            info: { mainPoster: { url: 1 } },
          },
        },
      },
    ]

    Wishlist.aggregate(pipeline, (err, result) => {
      if (err) {
        return res.status(400).send({ error: { details: err.toString() } })
      }
      const wishlist = result.map(entry => ({
        id: entry._id,
        brochureID: entry.brochureID,
        quest: entry.quest,
        title: entry.brochure.name,
        url: entry.brochure.info.mainPoster.url,
      }))
      return res.json(wishlist)
    })
  })
}

/**
 * Delete wishlist
 */

exports.deleteWishlist = (req, res) => {
  const { wishlistID } = req.params

  Wishlist.remove({ _id: wishlistID }, err => {
    if (err) {
      return res.status(400).send({ error: { details: err.toString() } })
    }
    return res.json(wishlistID)
  })
}
