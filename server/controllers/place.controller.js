const Place = require('../models/place')

/**
 * Get brochure
 * @param req
 * @param res
 * @returns brochure
 */
exports.getPlaces = (req, res) => {
  Place.find({}, { _id: 0 }, (err, places) => {
    if (err || !places) {
      return res.status(400).send({
        error: {
          details: err ? err.toString() : 'Failed to fetch places',
        },
      })
    }
    return res.json(places)
  })
}
