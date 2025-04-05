#!/bin/bash
set -e

echo "🚀 Starting deployment to Heroku..."

# Check if logged in to Heroku
echo "✅ Checking Heroku login status..."
heroku auth:whoami || (echo "❌ Not logged in to Heroku. Please run 'heroku login' first." && exit 1)

# Check if logged in to Heroku Container Registry
echo "✅ Logging in to Heroku Container Registry..."
heroku container:login || (echo "❌ Failed to login to Heroku Container Registry." && exit 1)

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -t registry.heroku.com/postreact/web .

# Push the image to Heroku
echo "⬆️ Pushing image to Heroku..."
docker push registry.heroku.com/postreact/web

# Release the image
echo "🚀 Releasing the application..."
heroku container:release web --app postreact

echo "✨ Deployment completed successfully!"
echo "🌐 Your application is now available at: https://postreact.herokuapp.com"
