const express = require('express')
const router = new express.Router()
const PostController = require('../controllers/post.controller')

// List Post
router.get('/', PostController.listPosts)

// Create Post
router.post('/', PostController.createPost)

// Update Post
router.put('/:postID', PostController.updatePost)

// Delete Post
router.delete('/:postID', PostController.deletePost)

// export default router
module.exports = router
