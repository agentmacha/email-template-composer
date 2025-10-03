#!/bin/bash

echo "🚀 Starting Email Template Composer - Full Stack Application"
echo "============================================================"

# Check if both frontend and backend are set up
if [ ! -d "node_modules" ] || [ ! -d "backend/node_modules" ]; then
    echo "❌ Dependencies not installed. Please run setup first:"
    echo "   ./setup.sh (for frontend)"
    echo "   cd backend && ./setup.sh (for backend)"
    exit 1
fi

# Check if .env file exists in backend
if [ ! -f "backend/.env" ]; then
    echo "❌ Backend .env file not found. Please run backend setup first:"
    echo "   cd backend && ./setup.sh"
    exit 1
fi

# Check if OpenAI API key is set
if ! grep -q "OPENAI_API_KEY=sk-" backend/.env; then
    echo "⚠️  OpenAI API key not set in backend/.env"
    echo "   Please edit backend/.env and add your OpenAI API key"
    echo "   Get your key from: https://platform.openai.com/api-keys"
    echo ""
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "🔧 Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 3

# Check if backend is running
if ! curl -s http://localhost:3001/health > /dev/null; then
    echo "❌ Backend failed to start. Check the logs above."
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Backend started successfully!"

# Go back to root directory
cd ..

echo "🎨 Starting frontend development server..."
npm start &
FRONTEND_PID=$!

echo ""
echo "🎉 Full stack application is starting!"
echo ""
echo "📱 Frontend: http://localhost:4200"
echo "🔧 Backend:  http://localhost:3001"
echo "📊 Health:   http://localhost:3001/health"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait




