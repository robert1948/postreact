#!/bin/bash
set -e

echo "🔧 Setting up local development environment..."

# Fix permissions issue
echo "🔒 Fixing permissions for node_modules..."
sudo chown -R $(whoami) ./client/node_modules
sudo chmod -R 755 ./client/node_modules

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

# Use concurrently if available, otherwise start in separate terminals
if command -v concurrently &> /dev/null; then
  concurrently "cd client && npm start" "cd server && npm run dev"
else
  echo "⚠️ 'concurrently' not found. Starting servers in separate terminals..."
  gnome-terminal -- bash -c "cd client && npm start; exec bash"
  gnome-terminal -- bash -c "cd server && npm run dev; exec bash"
fi
