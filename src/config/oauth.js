// OAuth configuration
module.exports = {
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'https://www.cape-control.com/api/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_CLIENT_ID || 'your-linkedin-client-id',
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || 'your-linkedin-client-secret',
    callbackURL: process.env.LINKEDIN_CALLBACK_URL || 'https://www.cape-control.com/api/auth/linkedin/callback',
    scope: ['r_liteprofile', 'r_emailaddress']
  }
};
