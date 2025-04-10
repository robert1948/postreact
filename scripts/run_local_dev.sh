#!/bin/bash
set -e

echo "🔧 Setting up local development environment..."

# Set password
PASSWORD=32714

# Fix permissions issue
echo "🔒 Fixing permissions for node_modules..."
echo $PASSWORD | sudo -S chown -R $(whoami) ./client/node_modules
echo $PASSWORD | sudo -S chmod -R 755 ./client/node_modules

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

# Start development servers
echo "🚀 Starting development servers..."
echo "ℹ️ The client will run on http://localhost:3000"
echo "ℹ️ The server will run on http://localhost:5000"
echo "ℹ️ Press Ctrl+C to stop both servers"

# Start both client and server in background
echo "Starting client in background..."
cd client
npm start &
CLIENT_PID=$!

echo "Starting server in background..."
cd ../server
node src/simple-server.js &
SERVER_PID=$!

# Function to handle exit
function cleanup {
  echo "🛑 Stopping development servers..."
  kill $CLIENT_PID
  kill $SERVER_PID
  exit
}

# Register the cleanup function for when script receives SIGINT
trap cleanup SIGINT

# Keep the script running
echo "✅ Development environment is running"
echo "Press Ctrl+C to stop both servers"
wait
