const TypeCategory = require('../models/typeCategory')
const DescriptiveCategory = require('../models/descriptiveCategory')
const Element = require('../models/element')

/**
 * Get quest info
 */
exports.getQuestInfo = (req, res) => {
  let questInfo = {
    types: [],
    descriptives: [],
  }

  let getQuest = {
    types: false,
    descriptives: false,
  }

  TypeCategory.find({}, { _id: 0, name: 0, e: 0, sum: 0 }, (err, types) => {
    if (err) {
      return res.status(400).send({
        error: { details: err.toString() },
      })
    }
    questInfo.types = types
    getQuest.types = true
  })

  DescriptiveCategory.find(
    {},
    { _id: 0, name: 0, e: 0, sum: 0 },
    (err, descriptives) => {
      if (err) {
        return res.status(400).send({
          error: { details: err.toString() },
        })
      }
      questInfo.descriptives = descriptives
      getQuest.descriptives = true

      if (getQuest.descriptives && getQuest.types) {
        return res.json(questInfo)
      }
    }
  )
}

/**
 * Get recommendations
 */
exports.getRecommendations = (req, res) => {
  const { viewport, types, descriptives } = req.body
  let typeMatch = []

  types.includes.map(type => {
    let typeSearch = {}
    typeSearch[`type.${type}`] = '1'
    typeMatch.push(typeSearch)
  })

  let typeProject = { sum: 1 }

  types.includes.map(type => {
    typeProject[type] = 1
  })

  types.excludes.map(type => {
    typeProject[type] = 1
  })

  let descriptiveProject = { sum: 1, rep: 1 }

  descriptives.stars.map(star => {
    descriptiveProject[star] = 1
  })

  if (descriptives.all) {
    descriptives.excludes.map(desc => {
      descriptiveProject[desc] = 1
    })
  } else {
    descriptives.includes.map(desc => {
      descriptiveProject[desc] = 1
    })
  }

  const pipeline = [
    {
      $match: {
        zmin: { $lte: viewport.zoom },
        zmax: { $gte: viewport.zoom },
        x: { $gte: viewport.bounds._sw.lng, $lte: viewport.bounds._ne.lng },
        y: { $gte: viewport.bounds._sw.lat, $lte: viewport.bounds._ne.lat },
      },
    },
    {
      $lookup: {
        from: 'elementTypeRelation',
        localField: 'e',
        foreignField: 'e',
        as: 'type',
      },
    },
    {
      $lookup: {
        from: 'elementDescriptiveRelation',
        localField: 'e',
        foreignField: 'e',
        as: 'descriptive',
      },
    },
    {
      $unwind: '$type',
    },
    {
      $unwind: '$descriptive',
    },
    {
      $match: {
        $or: typeMatch,
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        e: 1,
        display: 1,
        x: 1,
        y: 1,
        type: typeProject,
        descriptive: descriptiveProject,
      },
    },
  ]

  Element.aggregate(pipeline, (err, elements) => {
    if (err) {
      return res.status(400).send({
        error: { details: err.toString() },
      })
    }

    let scoreElements = elements.map(element => {
      let tScore = 0
      let dScore = 0

      if (!types.all) {
        types.includes.map(type => {
          if (element.type[type] !== '') {
            tScore += parseFloat(element.type[type])
          }
        })
      } else {
        if (element.type.sum !== '') {
          tScore += parseFloat(element.type.sum)
        }

        types.excludes.map(type => {
          if (element.type[type] !== '') {
            tScore -= parseFloat(element.type[type])
          }
        })
      }

      if (!descriptives.all) {
        descriptives.stars.map(star => {
          if (element.descriptive[star] !== '') {
            dScore += parseFloat(element.descriptive[star]) * 1
          }
        })

        descriptives.includes.map(desc => {
          if (element.descriptive[desc] !== '') {
            dScore += parseFloat(element.descriptive[desc]) * 0.3
          }
        })
      } else {
        if (element.descriptive.sum !== '') {
          dScore += parseFloat(element.descriptive.sum) * 0.3
        }

        descriptives.stars.map(star => {
          if (element.descriptive[star] !== '') {
            dScore += parseFloat(element.descriptive[star]) * 0.7
          }
        })

        descriptives.excludes.map(desc => {
          if (element.descriptive[desc] !== '') {
            dScore += parseFloat(element.descriptive[desc]) * -0.3
          }
        })
      }

      element.score =
        tScore * parseFloat(element.descriptive.rep) * (1 + dScore)

      return element
    })

    let sortedElements = scoreElements.sort((first, second) => {
      return parseFloat(second.score - first.score)
    })

    let recommendations = []

    for (element of sortedElements) {
      if (element.score > 0) {
        let recommendation = {
          e: element.e,
          display: element.display,
          score: element.score,
          name: element.name,
        }

        recommendations.push(recommendation)
        if (recommendations.length >= 5) {
          break
        }
      }
    }

    return res.json(recommendations)
  })
}

/**
 * Get descriptive categories based on type category selection
 */

exports.getDescriptiveCategories = (req, res) => {
  return res.json([])
}
