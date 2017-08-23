const Element = require('../models/element');
const Descriptive = require('../models/descriptive');
const Type = require('../models/type');
const Place = require('../models/place');

/**
 * Get all categories
 * @param req
 * @param res
 * @returns void
 */
const getQuestInfo = (req, res) => {
  Descriptive.findOne({ }, { _id: 0, name: 0, id: 0 }, (err, element) => {
    if (err) throw err;
    const categories = Object.keys(element._doc);
    res.json(categories);
  });
};

/**
 * Get recommendations
 * @param req
 * @param res
 * @returns void
 */
const getRecommendations = (req, res) => {
  const params = req.body;
  const interests = params.interests;
  let columns = [];

  for (const key in interests) {
    columns.push(`$ch.${params.interests[key]}`);
  }

  const pipeline = [{
    $match: {
      zmin: { $lte: params.zoomlevel },
      zmax: { $gte: params.zoomlevel },
      x: { $gte: params.viewport.southwest.x, $lte: params.viewport.northeast.x },
      y: { $gte: params.viewport.southwest.y, $lte: params.viewport.northeast.y },
    },
  }, {
    $lookup: {
      from: 'characteristic',
      localField: 'characteristic',
      foreignField: '_id',
      as: 'ch',
    },
  }, {
    $unwind: '$ch',
  }, {
    $project: {
      _id: 0,
      name: 1,
      e: 1,
      display: 1,
      x: 1,
      y: 1,
      score: {
        $add: columns,
      },
    },
  }, {
    $sort: {
      score: -1,
    },
  }, {
    $limit: params.count,
  }];

  Element.aggregate(pipeline, (err, results) => {
    if (err) throw err;

    let recommendations = [];

    for (const key in results) {
      if (results[key].score !== 0) {
        recommendations.push(results[key]);
      }
    }

    res.json(recommendations);
  });
};

/**
 * Get recommendations
 * @param req
 * @param res
 * @returns void
 */
const getPlace = (req, res) => {
  const params = req.body;
  const name = params.name;

  Place.findOne({ name: name }, { _id: 0, e: 0, name: 0 }, (err, place) => {
    if (err) throw err;

    if (place) {
      res.json(place);
    } else {
      res.json({});
    }
  });
};

module.exports.getQuestInfo = getQuestInfo;
module.exports.getRecommendations = getRecommendations;
module.exports.getPlace = getPlace;

