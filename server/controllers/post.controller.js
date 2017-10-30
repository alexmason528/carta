const mongoose = require('mongoose')
const Post = require('../models/post')
const Schema = mongoose.Schema

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
        'author.profile_pic': 0,
        'author.cover_img': 0,
        'author.verified': 0,
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
  const { files } = req

  let data = {
    content,
    title,
    link,
  }

  if (files.length > 0) {
    file = files[0]
    data[file.fieldname] = (process.env.NODE_ENV === 'development') ?
    `http://localhost:3000/public/uploads/post/${file.filename}` : `https://cartamap.herokuapp.com/public/uploads/post/${file.filename}`
  } else {
    data.img = img
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
          details: err,
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
  const { title, content, link, author } = req.body
  const { files } = req

  let data = {
    title,
    content,
    link,
    author: mongoose.Types.ObjectId(author),
  }

  if (files.length > 0) {
    file = files[0]
    data.img = (process.env.NODE_ENV === 'development') ?
    `http://localhost:3000/public/uploads/post/${file.filename}` : `https://cartamap.herokuapp.com/public/uploads/post/${file.filename}`
  } else {
    data.img = ''
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
