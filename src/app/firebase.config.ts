import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBvQjKjKjKjKjKjKjKjKjKjKjKjKjKjKjK", // Replace with your actual API key
  authDomain: "salon-database-464315.firebaseapp.com",
  projectId: "salon-database-464315",
  storageBucket: "salon-database-464315.appspot.com",
  messagingSenderId: "123456789012", // Replace with your actual sender ID
  appId: "1:123456789012:web:abcdefghijklmnopqrstuv" // Replace with your actual app ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;




