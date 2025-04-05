const express = require('express');
const router = express.Router();
const {
  login,
  register,
  requestVerification,
  verifyCode
} = require('../controllers/authController');

// Login route
router.post('/login', login);

// Register route
router.post('/register', register);

// Verification routes
router.post('/request-verification', requestVerification);
router.post('/verify-code', verifyCode);

module.exports = router;
