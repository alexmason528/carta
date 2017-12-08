const Element = require('../models/element')
const Descriptive = require('../models/descriptive')
const Type = require('../models/type')
const Place = require('../models/place')
const Category = require('../models/category')

/**
 * Get all categories
 * @param req
 * @param res
 * @returns void
 */
const getQuestInfo = (req, res) => {
  let questInfo = {
    descriptives: [],
    types: [],
  }

  let getQuest = {
    descriptives: false,
    types: false,
  }

  Descriptive.findOne({ }, { _id: 0, name: 0, e: 0, sum: 0 }, (descriptiveError, element) => {
    const descriptives = Object.keys(element._doc)

    Category.find({ c: { $in: descriptives } }, { _id: 0 }, (categoryError, elements) => {
      questInfo.descriptives = elements
      getQuest.descriptives = true

      if (getQuest.descriptives && getQuest.types) {
        return res.json(questInfo)
      }
    })
  })

  Type.findOne({ }, { _id: 0, name: 0, e: 0, sum: 0 }, (typeError, element) => {
    const types = Object.keys(element._doc)

    Category.find({ c: { $in: types } }, { _id: 0 }, (categoryError, elements) => {
      questInfo.types = elements
      getQuest.types = true

      if (getQuest.descriptives && getQuest.types) {
        return res.json(questInfo)
      }
    })
  })
}

/**
 * Get recommendations
 * @param req
 * @param res
 * @returns void
 */
const getRecommendations = (req, res) => {
  const { count, viewport, types, descriptives } = req.body
  let columns = []
  let typeMatch = []

  types.includes.map((type) => {
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

  let descriptiveProject = { sum: 1 }

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
        x: { $gte: viewport.southwest.x, $lte: viewport.northeast.x },
        y: { $gte: viewport.southwest.y, $lte: viewport.northeast.y },
      },
    },
    {
      $lookup: {
        from: 'type',
        localField: 'e',
        foreignField: 'e',
        as: 'type',
      },
    },
    {
      $lookup: {
        from: 'descriptive',
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
    if (err) throw err

    let scoreElements = elements.map((element) => {
      let dScore = 0
      let tScore = 0

      if (!descriptives.all) {
        descriptives.stars.map((star) => {
          if (element.descriptive[star] !== '') {
            dScore += parseFloat(element.descriptive[star]) * 1
          }
        })

        descriptives.includes.map((desc) => {
          if (element.descriptive[desc] !== '') {
            dScore += parseFloat(element.descriptive[desc]) * 0.3
          }
        })
      } else {
        if (element.descriptive.sum !== '') {
          dScore += parseFloat(element.descriptive.sum) * 0.3
        }

        descriptives.stars.map((star) => {
          if (element.descriptive[star] !== '') {
            dScore += parseFloat(element.descriptive[star]) * 0.7
          }
        })

        descriptives.excludes.map((desc) => {
          if (element.descriptive[desc] !== '') {
            dScore += parseFloat(element.descriptive[desc]) * (-0.3)
          }
        })
      }

      if (!types.all) {
        types.includes.map((type) => {
          if (element.type[type] !== '') {
            tScore += parseFloat(element.type[type])
          }
        })
      } else {
        if (element.type.sum !== '') {
          tScore += parseFloat(element.type.sum)
        }

        types.excludes.map((type) => {
          if (element.type[type] !== '') {
            tScore -= parseFloat(element.type[type])
          }
        })
      }

      element.score = tScore * (1 + dScore)

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
 * Get recommendations
 * @param req
 * @param res
 * @returns void
 */
const getPlace = (req, res) => {
  const { name } = req.body

  Place.findOne({ name: name }, { _id: 0, e: 0, name: 0 }, (err, place) => {
    if (err) throw err
    return res.json(place || {})
  })
}

module.exports.getQuestInfo = getQuestInfo
module.exports.getRecommendations = getRecommendations
module.exports.getPlace = getPlace
