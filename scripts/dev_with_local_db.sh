#!/bin/bash
set -e

echo "🚀 Setting up local development environment with PostgreSQL..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "   On Ubuntu: sudo apt install postgresql postgresql-contrib"
    echo "   On macOS: brew install postgresql"
    exit 1
fi

# Check if PostgreSQL service is running
if ! pg_isready &> /dev/null; then
    echo "❌ PostgreSQL service is not running. Please start it first."
    echo "   On Ubuntu: sudo service postgresql start"
    echo "   On macOS: brew services start postgresql"
    exit 1
fi

# Create the database if it doesn't exist
echo "🔍 Checking if database exists..."
if ! psql -lqt | cut -d \| -f 1 | grep -qw postreact; then
    echo "🗄️ Creating postreact database..."
    createdb postreact || sudo -u postgres createdb postreact
else
    echo "✅ Database postreact already exists."
fi

# Copy development environment file if it doesn't exist
if [ ! -f "./server/.env" ] || ! grep -q "localhost" "./server/.env"; then
    echo "📝 Setting up development environment variables..."
    cp ./server/.env.development ./server/.env
    echo "✅ Environment variables configured for local development."
else
    echo "✅ Development environment variables already configured."
fi

# Install dependencies if needed
if [ ! -d "./client/node_modules" ] || [ ! -d "./server/node_modules" ]; then
    echo "📦 Installing dependencies..."
    
    echo "📦 Installing client dependencies..."
    cd client
    npm install
    cd ..
    
    echo "📦 Installing server dependencies..."
    cd server
    npm install
    cd ..
fi

# Fix permissions if needed
echo "🔒 Checking permissions for node_modules..."
if [ -d "./client/node_modules" ] && [ ! -w "./client/node_modules" ]; then
    echo "🔧 Fixing permissions for client/node_modules..."
    sudo chown -R $(whoami) ./client/node_modules
    sudo chmod -R 755 ./client/node_modules
fi

if [ -d "./server/node_modules" ] && [ ! -w "./server/node_modules" ]; then
    echo "🔧 Fixing permissions for server/node_modules..."
    sudo chown -R $(whoami) ./server/node_modules
    sudo chmod -R 755 ./server/node_modules
fi

# Start development servers
echo "🚀 Starting development servers with local PostgreSQL..."
echo "ℹ️ The client will run on http://localhost:3000"
echo "ℹ️ The server will run on http://localhost:5000"
echo "ℹ️ Press Ctrl+C to stop both servers"

# Use concurrently if available, otherwise start in separate terminals
if command -v concurrently &> /dev/null; then
    concurrently "cd client && npm start" "cd server && npm run dev"
else
    echo "⚠️ 'concurrently' not found. Starting servers in separate terminals..."
    gnome-terminal -- bash -c "cd client && npm start; exec bash"
    gnome-terminal -- bash -c "cd server && npm run dev; exec bash"
fi
