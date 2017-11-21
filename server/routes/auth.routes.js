const express = require('express')
const router = new express.Router()

const AuthController = require('../controllers/auth.controller')

// SignIn
router.post('/signIn', AuthController.signIn)

// Register
router.post('/register', AuthController.register)

// Verify
router.post('/verify', AuthController.verify)

// Update
router.patch('/:userID', AuthController.updateUser)

// Delete User
router.delete('/:userID', AuthController.deleteUser)

// export default router
module.exports = router
