const Theme = require('../models/theme')

/**
 * Get brochure
 * @param req
 * @param res
 * @returns brochure
 */
exports.getThemes = (req, res) => {
  Theme.find({}, { _id: 0 }, (err, themes) => {
    if (err || !themes) {
      return res.status(400).send({
        error: {
          details: err ? err.toString() : 'Failed to fetch themes',
        },
      })
    }
    return res.json(themes)
  })
}
