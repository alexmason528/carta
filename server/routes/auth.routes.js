const express = require('express')
const router = new express.Router()

const AuthController = require('../controllers/auth.controller')

// SignIn user
router.post('/signIn', AuthController.signIn)

// Register user
router.post('/register', AuthController.register)

// Verify user
router.post('/verify', AuthController.verify)

// Update user
router.patch('/:userID', AuthController.updateUser)

// Delete user
router.delete('/:userID', AuthController.deleteUser)

// export default router
module.exports = router
