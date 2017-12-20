const mongoose = require('mongoose')
const Post = require('../models/post')

/**
 * list post
 * @param req
 * @param res
 * @returns post list
 */

const listPost = (req, res) => {
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
        'author.password': 0,
        'author.email': 0,
        'author.profilePic': 0,
        'author.coverPic': 0,
        'author.verified': 0,
      },
    },
    {
      $sort: {
        created_at: -1,
      },
    },
  ]

  Post.aggregate(pipeline, (err, elements) => {
    if (err) {
      return res.status(400).send({
        error: {
          details: err,
        },
      })
    } else {
      return res.json(elements)
    }
  })
}

/**
 * update post
 * @param req
 * @param res
 * @returns updated post
 */
const updatePost = (req, res) => {
  const { postID } = req.params
  const { content, title, link, img } = req.body

  let data = {
    content,
    title,
    link,
    img,
  }

  Post.findOneAndUpdate({ _id: postID }, { $set: data }, { new: true }, (err, element) => {
    if (element && element._id) {
      return res.json(element)
    }

    return res.status(400).send({
      error: {
        details: 'Failed to upddate post',
      },
    })
  })
}

/**
 * delete post
 * @param req
 * @param res
 * @returns void
 */

const deletePost = (req, res) => {
  const { postID } = req.params
  Post.remove({ _id: postID }, (err) => {
    if (err) {
      return res.status(400).send({
        error: {
          details: err.toString(),
        },
      })
    } else {
      return res.json({})
    }
  })
}

/**
 * create post
 * @param req
 * @param res
 * @returns created post
 */

const createPost = (req, res) => {
  const { title, content, link, author, img } = req.body

  let data = {
    title,
    content,
    link,
    img,
    author: mongoose.Types.ObjectId(author),
  }

  Post.create(data, (err, element) => {
    if (err) {
      return res.status(400).send({
        error: {
          details: err,
        },
      })
    } else {
      return res.json(element)
    }
  })
}

module.exports.listPost = listPost
module.exports.createPost = createPost
module.exports.updatePost = updatePost
module.exports.deletePost = deletePost
