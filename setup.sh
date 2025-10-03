#!/bin/bash

echo "🚀 Setting up Email Template Composer..."

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

echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🎉 Setup complete! You can now run:"
    echo "   npm start    - Start the development server"
    echo "   npm run build - Build for production"
    echo ""
    echo "🌐 The application will be available at http://localhost:4200"
else
    echo "❌ Failed to install dependencies. Please check the error messages above."
    exit 1
fi




