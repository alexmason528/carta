const express = require('express')
const router = new express.Router()
const crypto = require('crypto')
const path = require('path')

const AuthController = require('../controllers/auth.controller')

// Login
router.post('/login', AuthController.login)

// Register

const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/public/uploads/user')
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

router.post('/register', upload.any(), AuthController.register)

// Verify
router.post('/verify', AuthController.verify)

// Delete User
router.post('/delete', AuthController.deleteUser)

// export default router
module.exports = router
