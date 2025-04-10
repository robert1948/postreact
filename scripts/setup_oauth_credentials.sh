#!/bin/bash
set -e

echo "🔑 Setting up OAuth credentials for Heroku..."

# Check if the required environment variables are set
if [ -z "$GOOGLE_CLIENT_ID" ] || [ -z "$GOOGLE_CLIENT_SECRET" ]; then
  echo "❌ Error: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables must be set."
  echo "Please set them by running:"
  echo "export GOOGLE_CLIENT_ID=your_client_id"
  echo "export GOOGLE_CLIENT_SECRET=your_client_secret"
  exit 1
fi

# Set the Google OAuth credentials
echo "🔧 Setting Google OAuth credentials..."
heroku config:set GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID --app postreact
heroku config:set GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET --app postreact
heroku config:set GOOGLE_CALLBACK_URL=https://postreact-65ee402eb124.herokuapp.com/api/auth/google/callback --app postreact

# Set the LinkedIn OAuth credentials (if available)
if [ ! -z "$LINKEDIN_CLIENT_ID" ] && [ ! -z "$LINKEDIN_CLIENT_SECRET" ]; then
  echo "🔧 Setting LinkedIn OAuth credentials..."
  heroku config:set LINKEDIN_CLIENT_ID=$LINKEDIN_CLIENT_ID --app postreact
  heroku config:set LINKEDIN_CLIENT_SECRET=$LINKEDIN_CLIENT_SECRET --app postreact
  heroku config:set LINKEDIN_CALLBACK_URL=https://postreact-65ee402eb124.herokuapp.com/api/auth/linkedin/callback --app postreact
fi

# Set the client URL
echo "🔧 Setting client URL..."
heroku config:set CLIENT_URL=https://postreact-65ee402eb124.herokuapp.com --app postreact

echo "✅ OAuth credentials set up successfully!"
echo "🚀 Restarting the application..."
heroku restart --app postreact

echo "✨ Done! Your application should now be able to authenticate with Google and LinkedIn."
echo "🌐 Visit https://postreact-65ee402eb124.herokuapp.com/login to test the OAuth authentication."
