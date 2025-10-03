export const environment = {
  production: false,
  firebase: {
    apiKey: "your-api-key-here",
    authDomain: "salon-database-464315.firebaseapp.com",
    projectId: "salon-database-464315",
    storageBucket: "salon-database-464315.appspot.com",
    messagingSenderId: "108380944734969324036",
    appId: "your-app-id-here"
  },
  openai: {
    apiKey: process.env['OPENAI_API_KEY'] || 'your-openai-key-here'
  }
};


