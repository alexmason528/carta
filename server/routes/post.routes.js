const express = require('express')
const router = new express.Router()
const crypto = require('crypto')
const path = require('path')

const PostController = require('../controllers/post.controller')


// Update Post

const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/public/uploads/post')
  },
  filename: (req, file, cb) => {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      if (!err) {
        cb(null, raw.toString('hex') + path.extname(file.originalname))
      }
      return err
    })
  },
})
const upload = multer({ storage: storage })

router.put('/:postID', upload.any(), PostController.updatePost)

router.delete('/:postID', PostController.deletePost)

// export default router
module.exports = router
