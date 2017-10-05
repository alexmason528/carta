const express = require('express');
const router = new express.Router();

const AuthController = require('../controllers/auth.controller');

// Login
router.route('/login').post(AuthController.login);

// Register
router.route('/register').post(AuthController.register);

// export default router;
module.exports = router;
