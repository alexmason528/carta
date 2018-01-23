const Brochure = require('../models/brochure')

/**
 * Get brochure
 */
exports.getBrochure = (req, res) => {
  const { link } = req.params

  Brochure.findOne({ link }, { e: 0, name: 0 }, (err, brochure) => {
    if (err || !brochure) {
      return res.status(400).send({ error: { details: err ? err.toString() : 'Wrong place' } })
    }
    return res.json(brochure)
  })
}
