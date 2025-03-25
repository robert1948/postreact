# Build the Docker image from the root Dockerfile
docker build -t registry.heroku.com/postreact/web .

# Push the tagged image to Heroku
docker push registry.heroku.com/postreact/web

# Release the image
heroku container:release web --app postreact
