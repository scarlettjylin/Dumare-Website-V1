#!/bin/bash
# Dumaré — start local dev server
# Double-click this file in Finder, or run it in Terminal

cd "$(dirname "$0")"

# Check for Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Please install Node.js from https://nodejs.org"
  read -p "Press Enter to close..."
  exit 1
fi

# Install deps if node_modules .bin is missing
if [ ! -d "node_modules/.bin" ] || [ -z "$(ls -A node_modules/.bin 2>/dev/null)" ]; then
  echo "📦 Installing dependencies..."
  npm install --legacy-peer-deps
fi

echo ""
echo "🎬 Starting Dumaré dev server..."
echo "   Open Chrome at → http://localhost:5173"
echo ""
echo "   Press Ctrl+C to stop."
echo ""

npm run dev
