const Element = require('../models/element');
const Characteristic = require('../models/characteristic');

// import Element from '../models/element';
// import cuid from 'cuid';
// import slug from 'limax';
// import sanitizeHtml from 'sanitize-html';
// import mongoose from 'mongoose';

/**
 * Get all categories
 * @param req
 * @param res
 * @returns void
 */
const getCategories = (req, res) => {
  Characteristic.findOne({ }, { _id: 0, name: 0, id: 0 }, (err, element) => {
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

  Element.aggregate(pipeline, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

module.exports.getCategories = getCategories;
module.exports.getRecommendations = getRecommendations;
