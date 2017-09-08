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
  let questInfo = {
//    places: [],
    descriptives: [],
    types: [],
  };

  let getQuest = {
//    places: false,
    descriptives: false,
    types: false,
  };

  // Element.find({}, {_id: 0, name: 1, x: 1, y: 1, zoom: 1}, (err, elements) => {
  //   questInfo.places = elements;
  //   getQuest.places = true;

  //   if (getQuest.places && getQuest.descriptives && getQuest.types) {
  //     res.json(questInfo);
  //   }
  // });

  Descriptive.findOne({ }, { _id: 0, name: 0, e: 0, sum: 0 }, (err, element) => {
    const descriptives = Object.keys(element._doc);
    questInfo.descriptives = descriptives;
    getQuest.descriptives = true;

    if (getQuest.descriptives && getQuest.types) {
      res.json(questInfo);
    }
  });

  Type.findOne({ }, { _id: 0, name: 0, e: 0, sum: 0 }, (err, element) => {
    const types = Object.keys(element._doc);
    questInfo.types = types;
    getQuest.types = true;

    if (getQuest.descriptives && getQuest.types) {
      res.json(questInfo);
    }
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
  let columns = [];

  const { count, descriptivesAll, descriptives, typesAll, types, zoomlevel, viewport } = params;

  let typeMatch = [];

  types.active.map((type) => {
    let typeSearch = {};
    typeSearch[`type.${type}`] = '1';

    typeMatch.push(typeSearch);
  });

  let typeProject = {
    sum: 1,
  };

  types.active.map((type) => {
    typeProject[type] = 1;
  });

  types.inactive.map((type) => {
    typeProject[type] = 1;
  });

  let descriptiveProject = {
    sum: 1,
  };

  descriptives.interests.map((interest) => {
    descriptiveProject[interest] = 1;
  });

  descriptives.stars.map((star) => {
    descriptiveProject[star] = 1;
  });

  const pipeline = [
    {
      $match: {
        zmin: { $lte: zoomlevel },
        zmax: { $gte: zoomlevel },
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
  ];

  Element.aggregate(pipeline, (err, elements) => {
    if (err) throw err;

    let scoreElements = elements.map((element) => {
      let dScore = 0;
      let tScore = 0;

      if (descriptivesAll === 0) {
        descriptives.interests.map((interest) => {
          if (element.descriptive[interest] !== '') {
            dScore += parseFloat(element.descriptive[interest]) * 0.3;
          }
        });

        descriptives.stars.map((star) => {
          if (element.descriptive[star] !== '') {
            dScore += parseFloat(element.descriptive[star]) * 1;
          }
        });
      } else if (descriptivesAll === 1) {
        if (element.descriptive.sum !== '') {
          dScore += parseFloat(element.descriptive.sum) * 0.3;
        }

        descriptives.interests.map((interest) => {
          if (element.descriptive[interest] !== '') {
            dScore += parseFloat(element.descriptive[interest]) * (-0.3);
          }
        });

        descriptives.stars.map((star) => {
          if (element.descriptive[star] !== '') {
            dScore += parseFloat(element.descriptive[star]) * 0.7;
          }
        });
      }

      if (typesAll === 0) {
        types.active.map((type) => {
          if (element.type[type] !== '') {
            tScore += parseFloat(element.type[type]);
          }
        });
      } else if (typesAll === 1) {
        if (element.type.sum !== '') {
          tScore += parseFloat(element.type.sum);
        }

        types.inactive.map((type) => {
          if (element.type[type] !== '') {
            tScore -= parseFloat(element.type[type]);
          }
        });
      }

      element.score = tScore * dScore;

      return element;
    });

    let sortedElements = scoreElements.sort((first, second) => {
      return parseFloat(second.score - first.score);
    });

    let recommendations = [];

    for (i = 0; i < sortedElements.length; i += 1) {
      element = sortedElements[i];
      if (element.score !== 0) {
        let recommendation = {
          e: element.e,
          display: element.display,
          score: element.score,
          name: element.name,
        };

        recommendations.push(recommendation);
        if (recommendations.length >= 5) {
          break;
        }
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

