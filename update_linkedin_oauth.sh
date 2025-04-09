#!/bin/bash
set -e

# Check if the required environment variables are set
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "❌ Error: LinkedIn Client ID and Client Secret are required."
  echo "Usage: ./update_linkedin_oauth.sh <client_id> <client_secret>"
  exit 1
fi

LINKEDIN_CLIENT_ID=$1
LINKEDIN_CLIENT_SECRET=$2

echo "🔑 Updating LinkedIn OAuth credentials for Heroku..."

# Set the LinkedIn OAuth credentials
echo "🔧 Setting LinkedIn OAuth credentials..."
heroku config:set LINKEDIN_CLIENT_ID=$LINKEDIN_CLIENT_ID --app postreact
heroku config:set LINKEDIN_CLIENT_SECRET=$LINKEDIN_CLIENT_SECRET --app postreact
heroku config:set LINKEDIN_CALLBACK_URL=https://postreact-65ee402eb124.herokuapp.com/api/auth/linkedin/callback --app postreact

echo "✅ LinkedIn credentials updated successfully!"
echo "🚀 Restarting the application..."
heroku restart --app postreact

echo "✨ Done! Your application should now be able to authenticate with LinkedIn."
echo "🌐 Visit https://postreact-65ee402eb124.herokuapp.com/login to test the LinkedIn OAuth authentication."
