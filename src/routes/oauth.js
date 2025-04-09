const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT token
    const token = generateToken(req.user);

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL || 'https://www.cape-control.com'}/oauth-callback?token=${token}`);
  }
);

// LinkedIn OAuth routes - temporarily disabled
/*
router.get('/linkedin', passport.authenticate('linkedin'));

router.get('/linkedin/callback',
  passport.authenticate('linkedin', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT token
    const token = generateToken(req.user);

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL || 'https://www.cape-control.com'}/oauth-callback?token=${token}`);
  }
);
*/

// Temporary route to handle LinkedIn requests and show a message
router.get('/linkedin', (req, res) => {
  res.redirect('/login?error=linkedin_disabled');
});

router.get('/linkedin/callback', (req, res) => {
  res.redirect('/login?error=linkedin_disabled');
});

module.exports = router;
