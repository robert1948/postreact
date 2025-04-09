#!/bin/bash
set -e

# App name
APP_NAME="capecraft"

echo "🚀 Starting deployment to Heroku ($APP_NAME)..."

# Check if logged in to Heroku
echo "✅ Checking Heroku login status..."
heroku whoami || (echo "❌ Not logged in to Heroku. Please run 'heroku login' first." && exit 1)

# Login to Heroku Container Registry
echo "✅ Logging in to Heroku Container Registry..."
heroku container:login

# Check if the app exists, create it if it doesn't
if ! heroku apps:info --app $APP_NAME &> /dev/null; then
  echo "🆕 Creating new Heroku app: $APP_NAME..."
  heroku create $APP_NAME

  # Add PostgreSQL addon
  echo "🔧 Adding PostgreSQL addon..."
  heroku addons:create heroku-postgresql:hobby-dev --app $APP_NAME
fi

# Check environment variables
echo "🔧 Checking Heroku environment variables..."
heroku config --app $APP_NAME

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -t registry.heroku.com/$APP_NAME/web .

# Push the image to Heroku
echo "⬆️ Pushing image to Heroku..."
docker push registry.heroku.com/$APP_NAME/web

# Release the application
echo "🚀 Releasing the application..."
heroku container:release web --app $APP_NAME

echo "✨ Deployment completed successfully!"
echo "🌐 Your application is now available at: https://$APP_NAME.herokuapp.com/"

# Set up OAuth credentials if available
if [ ! -z "$GOOGLE_CLIENT_ID" ] && [ ! -z "$GOOGLE_CLIENT_SECRET" ]; then
  echo "🔑 Setting up Google OAuth credentials..."
  heroku config:set GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID --app $APP_NAME
  heroku config:set GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET --app $APP_NAME
  heroku config:set GOOGLE_CALLBACK_URL=https://www.cape-control.com/api/auth/google/callback --app $APP_NAME
fi

if [ ! -z "$LINKEDIN_CLIENT_ID" ] && [ ! -z "$LINKEDIN_CLIENT_SECRET" ]; then
  echo "🔑 Setting up LinkedIn OAuth credentials..."
  heroku config:set LINKEDIN_CLIENT_ID=$LINKEDIN_CLIENT_ID --app $APP_NAME
  heroku config:set LINKEDIN_CLIENT_SECRET=$LINKEDIN_CLIENT_SECRET --app $APP_NAME
  heroku config:set LINKEDIN_CALLBACK_URL=https://www.cape-control.com/api/auth/linkedin/callback --app $APP_NAME
fi

# Set client URL
echo "🔧 Setting client URL..."
heroku config:set CLIENT_URL=https://www.cape-control.com --app $APP_NAME

# Set JWT secret
echo "🔧 Setting JWT secret..."
heroku config:set JWT_SECRET=d7e558ada6d1b9a5c95c62b6de0a5f8c4b6a4c0e2d8f3b7a9c1e5d8f2b4a6c8 --app $APP_NAME

echo "✅ All set! Your application is deployed and configured."
