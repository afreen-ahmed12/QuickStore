// Parse/Back4App Configuration
// Replace these with your Back4App Application credentials
// Get them from: https://www.back4app.com/dashboard

const PARSE_CONFIG = {
    applicationId: 'YOUR_APPLICATION_ID',  // Replace with your Back4App Application ID
    javascriptKey: 'YOUR_JAVASCRIPT_KEY',  // Replace with your Back4App JavaScript Key
    serverURL: 'https://parseapi.back4app.com'  // Back4App server URL
};

// Initialize Parse when SDK is loaded
function initializeParse() {
    if (typeof Parse === 'undefined') {
        console.error('Parse SDK failed to load. Please check your internet connection and try again.');
        return false;
    }
    
    if (PARSE_CONFIG.applicationId === 'YOUR_APPLICATION_ID' || 
        PARSE_CONFIG.javascriptKey === 'YOUR_JAVASCRIPT_KEY') {
        console.error('Please configure your Back4App credentials in config.js');
        return false;
    }
    
    try {
        Parse.initialize(PARSE_CONFIG.applicationId, PARSE_CONFIG.javascriptKey);
        Parse.serverURL = PARSE_CONFIG.serverURL;
        return true;
    } catch (error) {
        console.error('Error initializing Parse:', error);
        return false;
    }
}

// Wait for Parse SDK to load, then initialize
if (typeof Parse !== 'undefined') {
    initializeParse();
} else {
    // If Parse is not loaded yet, wait for it
    window.addEventListener('load', function() {
        if (typeof Parse !== 'undefined') {
            initializeParse();
        } else {
            console.error('Parse SDK not loaded after page load');
        }
    });
}
