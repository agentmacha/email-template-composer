#!/bin/bash

echo "🚀 Setting up Email Template Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully!"
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        echo "📝 Creating .env file from template..."
        cp env.example .env
        echo "⚠️  Please edit .env file and add your OpenAI API key!"
        echo "   OPENAI_API_KEY=your_openai_api_key_here"
    fi
    
    echo ""
    echo "🎉 Backend setup complete!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Edit .env file and add your OpenAI API key"
    echo "   2. Run: npm start (production) or npm run dev (development)"
    echo "   3. Backend will be available at http://localhost:3001"
    echo ""
    echo "🔑 Get your OpenAI API key from: https://platform.openai.com/api-keys"
else
    echo "❌ Failed to install dependencies. Please check the error messages above."
    exit 1
fi




