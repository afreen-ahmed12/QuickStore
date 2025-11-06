import Parse from 'parse';

// Initialize Parse with your Back4App credentials
// Replace these with your actual Back4App Application ID and JavaScript Key
Parse.initialize(
  process.env.VITE_PARSE_APPLICATION_ID || 'YOUR_APPLICATION_ID',
  process.env.VITE_PARSE_JAVASCRIPT_KEY || 'YOUR_JAVASCRIPT_KEY'
);

// Set the server URL (Back4App)
Parse.serverURL = process.env.VITE_PARSE_SERVER_URL || 'https://parseapi.back4app.com/';

export default Parse;

