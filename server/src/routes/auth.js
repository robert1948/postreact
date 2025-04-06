const express = require('express');
const router = express.Router();
const {
  login,
  register,
  requestVerification,
  verifyCode
} = require('../controllers/authController');
const oauthRoutes = require('./oauth');

// Login route
router.post('/login', login);

// Register route
router.post('/register', register);

// Verification routes
router.post('/request-verification', requestVerification);
router.post('/verify-code', verifyCode);

// OAuth routes
router.use('/', oauthRoutes);

module.exports = router;
