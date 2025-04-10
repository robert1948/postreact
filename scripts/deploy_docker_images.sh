#!/bin/bash
set -e

echo "🚀 Starting Docker build and deployment process..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker first."
  exit 1
fi

# Check if logged in to Docker Hub
echo "🔍 Checking Docker Hub login status..."
if ! docker info | grep -q "Username"; then
  echo "🔑 Please login to Docker Hub:"
  docker login -u stinkie
fi

# Check if logged in to Heroku
echo "🔍 Checking Heroku login status..."
if ! heroku auth:whoami &> /dev/null; then
  echo "🔑 Please login to Heroku:"
  heroku login
  heroku container:login
else
  echo "✅ Already logged in to Heroku"
  heroku container:login
fi

# Build the main application image
echo "🔨 Building main application Docker image..."
docker build -t registry.heroku.com/postreact/web .

# Tag the main image for Docker Hub
echo "🏷️ Tagging main image for Docker Hub..."
docker tag registry.heroku.com/postreact/web stinkie/postreact:latest
docker tag registry.heroku.com/postreact/web stinkie/postreact:1.0.0

# Build the client and server images separately using docker-compose
echo "🔨 Building client and server images with docker-compose..."
docker-compose build server

# Tag the server image
echo "🏷️ Tagging server image..."
if docker images | grep -q "postreact-server"; then
  docker tag postreact-server stinkie/postreact-server:latest
  docker tag postreact-server stinkie/postreact-server:1.0.0
  echo "✅ Server image tagged successfully"
else
  echo "⚠️ postreact-server image not found, skipping tagging"
fi

# Push images to Docker Hub
echo "⬆️ Pushing images to Docker Hub..."
docker push stinkie/postreact:latest
docker push stinkie/postreact:1.0.0

# Push server image if it exists
if docker images | grep -q "stinkie/postreact-server"; then
  docker push stinkie/postreact-server:latest
  docker push stinkie/postreact-server:1.0.0
  echo "✅ Server image pushed successfully"
else
  echo "⚠️ stinkie/postreact-server image not found, skipping push"
fi

# Push to Heroku and release
echo "⬆️ Pushing image to Heroku..."
docker push registry.heroku.com/postreact/web

echo "🚀 Releasing the application on Heroku..."
heroku container:release web --app postreact

echo "✨ Deployment completed successfully!"
echo "🌐 Your application is now available at: https://postreact.herokuapp.com"
echo "🐳 Docker images have been pushed to Docker Hub: stinkie/postreact"
