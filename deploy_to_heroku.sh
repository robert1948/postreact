#!/bin/bash
set -e

echo "🚀 Starting deployment to Heroku..."

# Check if logged in to Heroku
echo "✅ Checking Heroku login status..."
heroku auth:whoami || (echo "❌ Not logged in to Heroku. Please run 'heroku login' first." && exit 1)

# Check if logged in to Heroku Container Registry
echo "✅ Logging in to Heroku Container Registry..."
heroku container:login || (echo "❌ Failed to login to Heroku Container Registry." && exit 1)

# Check and set environment variables
echo "🔧 Checking Heroku environment variables..."
JWT_SECRET=$(heroku config:get JWT_SECRET --app postreact)
DATABASE_URL=$(heroku config:get DATABASE_URL --app postreact)

if [ -z "$JWT_SECRET" ]; then
    echo "⚙️ Setting JWT_SECRET environment variable..."
    heroku config:set JWT_SECRET=d7e558ada6d1b9a5c95c62b6de0a5f8c4b6a4c0e2d8f3b7a9c1e5d8f2b4a6c8 --app postreact
fi

if [ -z "$DATABASE_URL" ]; then
    echo "⚠️ DATABASE_URL is not set. Make sure you have a PostgreSQL addon installed."
    echo "⚙️ Checking PostgreSQL addon..."
    if ! heroku addons | grep -q "heroku-postgresql"; then
        echo "🗄️ Adding PostgreSQL addon..."
        heroku addons:create heroku-postgresql:hobby-dev --app postreact
    fi
fi

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
