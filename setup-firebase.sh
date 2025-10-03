#!/bin/bash

echo "🔥 Setting up Firebase for Email Template Composer..."
echo "=================================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please login to Firebase..."
    firebase login
fi

echo "🏗️ Initializing Firebase project..."
firebase init

echo "✅ Firebase setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Enable Firestore in Firebase Console"
echo "2. Enable Authentication in Firebase Console"
echo "3. Enable Storage in Firebase Console"
echo "4. Update environment.ts with your Firebase config"
echo "5. Run: npm start"
echo ""
echo "🌐 Firebase Console: https://console.firebase.google.com/project/salon-database-464315"




