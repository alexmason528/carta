const mongoose = require('mongoose')
const Post = require('../models/post')

/**
 * List posts
 */

exports.listPosts = (req, res) => {
  const { lastPostDate, limit } = req.query
  const DEFAULT_LIMIT = 6
  let pipeline = [
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
        'author.password': 0,
        'author.email': 0,
        'author.profilePic': 0,
        'author.verified': 0,
      },
    },
    {
      $sort: {
        created_at: -1,
      },
    },
  ]

  if (lastPostDate) {
    pipeline.push({
      $match: {
        created_at: { $lt: new Date(lastPostDate) },
      },
    })
  }

  Post.aggregate(pipeline)
    .limit(parseInt(limit, 10) || DEFAULT_LIMIT)
    .exec((err, posts) => {
      if (err) {
        return res.status(400).send({
          error: { details: err.toString() },
        })
      }
      return res.json({
        posts: posts.map(post => ({ ...post, author: post.author[0] })),
        hasMore: posts.length === DEFAULT_LIMIT,
      })
    })
}

/**
 * Update post
 */
exports.updatePost = (req, res) => {
  const { postID } = req.params
  const { content, title, link, img } = req.body

  let data = {
    content,
    title,
    link,
    img,
  }

  Post.findOneAndUpdate({ _id: postID }, { $set: data }, { new: true }, (err, post) => {
    if (err) {
      return res.status(400).send({
        error: { details: err.toString() },
      })
    }

    if (post && post._id) {
      return res.json(post)
    }
  })
}

/**
 * Delete post
 */

exports.deletePost = (req, res) => {
  const { postID } = req.params
  Post.remove({ _id: postID }, err => {
    if (err) {
      return res.status(400).send({
        error: {
          details: err.toString(),
        },
      })
    }
    return res.json({})
  })
}

/**
 * Create post
 */

exports.createPost = (req, res) => {
  const { title, content, link, author, img } = req.body

  let data = {
    title,
    content,
    link,
    img,
    author: mongoose.Types.ObjectId(author),
  }

  Post.create(data, (err, post) => {
    if (err) {
      return res.status(400).send({
        error: { details: err.toString() },
      })
    }
    return res.json(post)
  })
}
