const Post = require('../models/post')

/**
 * update post
 * @param req
 * @param res
 * @returns void
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
          details: 'Wrong password',
        },
      })
    } else {
      return res.json({})
    }
  })
}

module.exports.updatePost = updatePost
module.exports.deletePost = deletePost
