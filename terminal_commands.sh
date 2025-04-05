# Build the Docker image from the root Dockerfile
docker build -t registry.heroku.com/postreact/web .

# Push the tagged image to Heroku
docker push registry.heroku.com/postreact/web

# Release the image
heroku container:release web --app postreact

# Login to Docker Hub
docker login -u stinkie

# Tag the main image with your username and version
docker tag registry.heroku.com/postreact/web stinkie/postreact:1.0.0

# Push the main image to Docker Hub
docker push stinkie/postreact:1.0.0

# Tag and push the latest version
docker tag stinkie/postreact:1.0.0 stinkie/postreact:latest
docker push stinkie/postreact:latest

# Build and tag client and server images using docker-compose
docker-compose build client
docker-compose build server

# Tag the client and server images
docker tag postreact_client stinkie/postreact-client:1.0.0
docker tag postreact_server stinkie/postreact-server:1.0.0

# Push the client and server images to Docker Hub
docker push stinkie/postreact-client:1.0.0
docker push stinkie/postreact-server:1.0.0

# Tag and push latest versions of client and server
docker tag stinkie/postreact-client:1.0.0 stinkie/postreact-client:latest
docker tag stinkie/postreact-server:1.0.0 stinkie/postreact-server:latest
docker push stinkie/postreact-client:latest
docker push stinkie/postreact-server:latest
