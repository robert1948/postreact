#!/bin/bash
set -e

# Google API Key
GOOGLE_API_KEY="AIzaSyClXbs-vEpEFfCnnZDUw560xjDb4i7EDnw"

# Google OAuth Client ID and Secret
# Note: You need to replace these with your actual client ID and secret from Google Cloud Console
GOOGLE_CLIENT_ID=1055096336002-j34npg32oshsfb6itirk1fo5mddsggj9.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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


echo "🔑 Setting up Google OAuth credentials for Heroku..."

# Set the Google API Key
echo "🔧 Setting Google API Key..."
heroku config:set GOOGLE_API_KEY=$GOOGLE_API_KEY --app postreact

# Set the Google OAuth credentials
echo "🔧 Setting Google OAuth credentials..."
heroku config:set GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID --app postreact
heroku config:set GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET --app postreact
heroku config:set GOOGLE_CALLBACK_URL=https://postreact-65ee402eb124.herokuapp.com/api/auth/google/callback --app postreact

# Set the client URL
echo "🔧 Setting client URL..."
heroku config:set CLIENT_URL=https://postreact-65ee402eb124.herokuapp.com --app postreact

echo "✅ Google credentials set up successfully!"
echo "🚀 Restarting the application..."
heroku restart --app postreact

echo "✨ Done! Your application should now be able to authenticate with Google."
echo "🌐 Visit https://postreact-65ee402eb124.herokuapp.com/login to test the Google OAuth authentication."
