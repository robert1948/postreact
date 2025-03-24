
# Make sure you're in the project root directory
cd /media/robert/Linux012/postreact

# Build the Docker image
docker build -t postreact -f server/Dockerfile .

# Push to Heroku
heroku container:push web --app postreact

# Release the container
heroku container:release web --app postreact

# Check the logs
heroku logs --tail --app postreact
