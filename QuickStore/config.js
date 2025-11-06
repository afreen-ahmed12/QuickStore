// Back4App Parse Configuration
const PARSE_CONFIG = {
    applicationId: 'gOfRL3s3M8tosFfoNfjqNoh1MDXYfJqpof9MI8I8Lb',
    javascriptKey: 'dLZovR5KYVhY6VIa2FgalvinseNioqbfkVzdqsgK',
    serverURL: 'https://parseapi.back4app.com'
};

// Initialize Parse
Parse.initialize(PARSE_CONFIG.applicationId, PARSE_CONFIG.javascriptKey);
Parse.serverURL = PARSE_CONFIG.serverURL;

