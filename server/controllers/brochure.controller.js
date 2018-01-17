const Brochure = require('../models/brochure')

/**
 * Get brochure
 */
exports.getBrochure = (req, res) => {
  const { link } = req.params

  Brochure.findOne({ link }, { _id: 0, e: 0, name: 0 }, (err, brochure) => {
    if (err) {
      return res.status(400).send({
        error: {
          details: err.toString(),
        },
      })
    } else if (!brochure) {
      return res.status(400).send({
        error: { details: 'Wrong place' },
      })
    }
    return res.json(brochure)
  })
}
