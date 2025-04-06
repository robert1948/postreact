const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/User');
const oauthConfig = require('./oauth');

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: oauthConfig.google.clientID,
  clientSecret: oauthConfig.google.clientSecret,
  callbackURL: oauthConfig.google.callbackURL,
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findByProvider('google', profile.id);
    
    if (user) {
      // User exists, return the user
      return done(null, user);
    }
    
    // Create a new user
    user = await User.createOAuthUser({
      provider: 'google',
      providerId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      picture: profile.photos[0].value
    });
    
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// LinkedIn OAuth Strategy
passport.use(new LinkedInStrategy({
  clientID: oauthConfig.linkedin.clientID,
  clientSecret: oauthConfig.linkedin.clientSecret,
  callbackURL: oauthConfig.linkedin.callbackURL,
  scope: oauthConfig.linkedin.scope,
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findByProvider('linkedin', profile.id);
    
    if (user) {
      // User exists, return the user
      return done(null, user);
    }
    
    // Create a new user
    user = await User.createOAuthUser({
      provider: 'linkedin',
      providerId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      picture: profile.photos && profile.photos[0] ? profile.photos[0].value : null
    });
    
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

module.exports = passport;
