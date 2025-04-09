#!/bin/bash
set -e

echo "🚀 Starting local development environment..."

# Start the server
echo "🖥️ Starting server on http://localhost:5000..."
cd server
node src/index.js &
SERVER_PID=$!

# Start the client
echo "🌐 Starting client on http://localhost:3000..."
cd ../client
npm start &
CLIENT_PID=$!

# Function to handle exit
function cleanup {
  echo "🛑 Stopping development servers..."
  kill $SERVER_PID
  kill $CLIENT_PID
  exit
}

# Register the cleanup function for when script receives SIGINT
trap cleanup SIGINT

# Keep the script running
echo "✅ Development environment is running"
echo "Press Ctrl+C to stop both servers"
wait
