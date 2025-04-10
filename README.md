# CapeControl

A full-stack application with React frontend and Node.js backend, using PostgreSQL for data storage. CapeControl democratizes access to advanced AI capabilities.

## Features

- **Responsive Design**: Fully optimized for mobile devices using Bootstrap
- **Dark Theme**: Modern dark theme with customizable appearance
- **Authentication**: Secure login and registration with OAuth options
- **Dashboard**: User-friendly dashboard for managing AI capabilities

## Development Setup

### Prerequisites

- Node.js (v16 or later)
- PostgreSQL (v13 or later)
- Docker (optional, for containerized development)

### Local Development with PostgreSQL

To run the application locally with a PostgreSQL database:

```bash
# Make sure the script is executable
chmod +x dev_with_local_db.sh

# Run the development script
./dev_with_local_db.sh
```

This script will:
1. Check if PostgreSQL is installed and running
2. Create the `postreact` database if it doesn't exist
3. Set up the development environment variables
4. Install dependencies if needed
5. Start both the client and server in development mode

The client will be available at http://localhost:3000 and the server at http://localhost:5000.

### Docker Development

To run the application using Docker:

```bash
# Build and start the containers
docker-compose up
```

This will start:
- The React client on port 3000
- The Node.js server on port 5000
- A PostgreSQL database on port 5432

## Deployment

### Deploying to Docker Hub

To deploy the application to Docker Hub:

```bash
# Make sure the script is executable
chmod +x deploy_to_dockerhub.sh

# Run the deployment script
./deploy_to_dockerhub.sh
```

This script will:
1. Check if you're logged in to Docker Hub
2. Build the Docker image
3. Push the image to Docker Hub

The image will be available at https://hub.docker.com/r/stinkie/capecraft

### Deploying to Heroku

To deploy the application to Heroku:

```bash
# Make sure the script is executable
chmod +x deploy_to_heroku.sh

# Run the deployment script
./deploy_to_heroku.sh
```

Or, to deploy from Docker Hub to Heroku:

```bash
# Deploy from Docker Hub to Heroku
./deploy_to_dockerhub.sh --deploy-to-heroku
```

These scripts will:
1. Check if you're logged in to Heroku
2. Set up the necessary environment variables
3. Build and push the Docker image to Heroku
4. Release the application

The application will be available at https://capecraft.herokuapp.com or https://www.cape-control.com.

## Environment Configuration

The application uses different environment configurations for development and production:

- **Development**: Uses a local PostgreSQL database
  - Configuration in `server/.env.development`
  - Database URL: `postgresql://postgres:postgres@localhost:5432/postreact`

- **Production**: Uses Heroku PostgreSQL
  - Configuration in `server/.env.production`
  - Database URL is provided by Heroku

## Docker Image

The application is available as a Docker image on Docker Hub:

```bash
# Pull the image
docker pull stinkie/capecraft:latest

# Run the image
docker run -p 5000:5000 -e DATABASE_URL=your_database_url stinkie/capecraft:latest
```

The Docker image is automatically updated via GitHub Actions whenever changes are pushed to the master branch.

## Database Schema

The application uses the following database schema:

### Users Table

| Column       | Type      | Description                       |
|--------------|-----------|-----------------------------------|
| id           | SERIAL    | Primary key                       |
| email        | VARCHAR   | User's email (unique)             |
| password     | VARCHAR   | Hashed password (nullable for OAuth) |
| name         | VARCHAR   | User's name                       |
| mobile       | VARCHAR   | User's mobile number              |
| provider     | VARCHAR   | OAuth provider (google, linkedin) |
| provider_id  | VARCHAR   | ID from the OAuth provider        |
| picture      | VARCHAR   | Profile picture URL               |
| subscription | VARCHAR   | Subscription type (default: free) |
| credits      | INTEGER   | Available credits (default: 0)    |
| created_at   | TIMESTAMP | Account creation timestamp        |
| last_login   | TIMESTAMP | Last login timestamp              |

## License

MIT
