#!/bin/bash
set -e

# Configuration
DOCKER_USERNAME="stinkie"
REPOSITORY_NAME="capecraft"
IMAGE_TAG="latest"

echo "🚀 Starting deployment to Docker Hub..."

# Check if logged in to Docker Hub
echo "✅ Checking Docker Hub login status..."
docker info | grep Username || (echo "❌ Not logged in to Docker Hub. Please run 'docker login' first." && exit 1)

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -t $DOCKER_USERNAME/$REPOSITORY_NAME:$IMAGE_TAG .

# Push the image to Docker Hub
echo "⬆️ Pushing image to Docker Hub..."
docker push $DOCKER_USERNAME/$REPOSITORY_NAME:$IMAGE_TAG

echo "✨ Deployment to Docker Hub completed successfully!"
echo "🌐 Your image is now available at: docker.io/$DOCKER_USERNAME/$REPOSITORY_NAME:$IMAGE_TAG"

# Optional: Deploy to Heroku from Docker Hub
if [ "$1" == "--deploy-to-heroku" ]; then
  echo "🚀 Deploying from Docker Hub to Heroku..."
  
  # Check if logged in to Heroku
  echo "✅ Checking Heroku login status..."
  heroku whoami || (echo "❌ Not logged in to Heroku. Please run 'heroku login' first." && exit 1)
  
  # Login to Heroku Container Registry
  echo "✅ Logging in to Heroku Container Registry..."
  heroku container:login
  
  # Pull the image from Docker Hub
  echo "⬇️ Pulling image from Docker Hub..."
  docker pull $DOCKER_USERNAME/$REPOSITORY_NAME:$IMAGE_TAG
  
  # Tag the image for Heroku
  echo "🏷️ Tagging image for Heroku..."
  docker tag $DOCKER_USERNAME/$REPOSITORY_NAME:$IMAGE_TAG registry.heroku.com/capecraft/web
  
  # Push the image to Heroku
  echo "⬆️ Pushing image to Heroku..."
  docker push registry.heroku.com/capecraft/web
  
  # Release the application
  echo "🚀 Releasing the application..."
  heroku container:release web --app capecraft
  
  echo "✅ Deployment to Heroku completed successfully!"
fi
