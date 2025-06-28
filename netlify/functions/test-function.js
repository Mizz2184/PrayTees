exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Test basic function execution
    const testData = {
      message: 'Netlify function is working!',
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      environment: {
        hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
        stripeKeyType: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 3) + '...' : 'not set',
        netlifyUrl: process.env.URL || 'not set',
      },
      event: {
        httpMethod: event.httpMethod,
        path: event.path,
        headers: Object.keys(event.headers || {}),
      },
    };

    // Test if we can require packages
    try {
      const fetch = require('cross-fetch');
      testData.crossFetchAvailable = true;
    } catch (error) {
      testData.crossFetchAvailable = false;
      testData.crossFetchError = error.message;
    }

    try {
      const stripe = require('stripe');
      testData.stripePackageAvailable = true;
    } catch (error) {
      testData.stripePackageAvailable = false;
      testData.stripePackageError = error.message;
    }

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData, null, 2),
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Test function failed',
        message: error.message,
        stack: error.stack,
      }, null, 2),
    };
  }
}; 