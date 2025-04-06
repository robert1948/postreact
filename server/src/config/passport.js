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
    console.log('Google OAuth profile:', {
      id: profile.id,
      displayName: profile.displayName,
      email: profile.emails && profile.emails[0] ? profile.emails[0].value : 'No email',
      photo: profile.photos && profile.photos[0] ? 'Has photo' : 'No photo'
    });

    // Check if user already exists by provider ID
    let user = await User.findByProvider('google', profile.id);

    if (user) {
      console.log('User found by provider ID');
      // User exists, return the user
      return done(null, user);
    }

    // If not found by provider, create or link account
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
    if (!email) {
      return done(new Error('No email found in Google profile'), null);
    }

    // Create a new user or link to existing account
    user = await User.createOAuthUser({
      provider: 'google',
      providerId: profile.id,
      email: email,
      name: profile.displayName || email.split('@')[0],
      picture: profile.photos && profile.photos[0] ? profile.photos[0].value : null
    });

    console.log('User created or linked:', user.id);
    return done(null, user);
  } catch (error) {
    console.error('Error in Google OAuth strategy:', error);
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
    console.log('LinkedIn OAuth profile:', {
      id: profile.id,
      displayName: profile.displayName,
      email: profile.emails && profile.emails[0] ? profile.emails[0].value : 'No email',
      photo: profile.photos && profile.photos[0] ? 'Has photo' : 'No photo'
    });

    // Check if user already exists by provider ID
    let user = await User.findByProvider('linkedin', profile.id);

    if (user) {
      console.log('User found by provider ID');
      // User exists, return the user
      return done(null, user);
    }

    // If not found by provider, create or link account
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
    if (!email) {
      return done(new Error('No email found in LinkedIn profile'), null);
    }

    // Create a new user or link to existing account
    user = await User.createOAuthUser({
      provider: 'linkedin',
      providerId: profile.id,
      email: email,
      name: profile.displayName || email.split('@')[0],
      picture: profile.photos && profile.photos[0] ? profile.photos[0].value : null
    });

    console.log('User created or linked:', user.id);
    return done(null, user);
  } catch (error) {
    console.error('Error in LinkedIn OAuth strategy:', error);
    return done(error, null);
  }
}));

module.exports = passport;
