#!/bin/bash

# Set API key for development
if [ -z "$VITE_API_KEY" ]; then
  echo "Please set your VITE_API_KEY before running the script."
  echo "Example: VITE_API_KEY=your_api_key_here ./run.sh"
  exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the development server
echo "Starting Svelte Tube App..."
npm run dev