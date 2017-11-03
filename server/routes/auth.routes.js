const express = require('express')
const router = new express.Router()

const AuthController = require('../controllers/auth.controller')

// Login
router.post('/login', AuthController.login)

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
