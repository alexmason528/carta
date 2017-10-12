const Post = require('../models/post')
const Suggestion = require('../models/suggestion')

/**
 * Get all categories
 * @param req
 * @param res
 * @returns void
 */
const getCommunityInfo = (req, res) => {
  let communityInfo = {
    posts: [],
    suggestions: [],
  }

  let getInfo = {
    posts: false,
    suggestions: false,
  }

  const pipeline = [
    {
      $lookup: {
        from: 'user',
        localField: 'author',
        foreignField: '_id',
        as: 'author',
      },
    },
    {
      $project: {
        _id: 0,
        'author.password': 0,
        'author._id': 0,
        'author.email': 0,
        'author.profile_pic': 0,
        'author.cover_img': 0,
        'author.verified': 0,
      },
    },
  ]

  Post.aggregate(pipeline, (error, elements) => {
    if (error) throw error

    communityInfo.posts = elements
    getInfo.posts = true

    if (getInfo.posts && getInfo.suggestions) {
      return res.json(communityInfo)
    }
  })

  Suggestion.find({}, { _id: 0 }, (error, elements) => {
    if (error) throw error

    communityInfo.suggestions = elements
    getInfo.suggestions = true

    if (getInfo.posts && getInfo.suggestions) {
      return res.json(communityInfo)
    }
  })
}

module.exports.getCommunityInfo = getCommunityInfo
