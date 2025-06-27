const PRINTFUL_API_KEY = 'OuQXFPCYys3ONYsDlPDFy7mNdfIKPFqGxYC1GACl';
const PRAY_TEES_STORE_ID = 16243594;

exports.handler = async (event, context) => {
  console.log('🚀 Netlify function started');
  console.log('🚀 Event method:', event.httpMethod);
  console.log('🚀 Event path:', event.path);
  console.log('🚀 Event query:', event.queryStringParameters);
  console.log('🚀 Context:', JSON.stringify(context, null, 2));
  console.log('🚀 Environment check:', {
    hasApiKey: !!PRINTFUL_API_KEY,
    storeId: PRAY_TEES_STORE_ID,
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  });

  // Enable CORS for all requests
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Cache-Control': 'no-cache',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    console.log('🚀 Handling OPTIONS/preflight request');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' }),
    };
  }

  // Only allow GET requests for this function
  if (event.httpMethod !== 'GET') {
    console.log('🚀 Method not allowed:', event.httpMethod);
    return {
      statusCode: 405,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Method not allowed',
        allowedMethods: ['GET', 'OPTIONS'],
        receivedMethod: event.httpMethod
      }),
    };
  }

  try {
    console.log('🚀 Starting Printful API request...');
    console.log('🚀 Store ID:', PRAY_TEES_STORE_ID);
    console.log('🚀 API Key present:', !!PRINTFUL_API_KEY);
    console.log('🚀 API Key length:', PRINTFUL_API_KEY ? PRINTFUL_API_KEY.length : 0);
    
    const apiUrl = `https://api.printful.com/store/products?store_id=${PRAY_TEES_STORE_ID}`;
    console.log('🚀 API URL:', apiUrl);
    
    const startTime = Date.now();
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'PrayTees-Netlify-Function/1.0',
      },
    });
    const endTime = Date.now();

    console.log('🚀 Printful API response status:', response.status);
    console.log('🚀 Printful API response ok:', response.ok);
    console.log('🚀 Response time:', `${endTime - startTime}ms`);
    console.log('🚀 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('🚀 Printful API error body:', errorBody);
      
      // Return detailed error information
      return {
        statusCode: response.status,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Printful API error',
          status: response.status,
          statusText: response.statusText,
          message: errorBody,
          apiUrl: apiUrl,
          timestamp: new Date().toISOString()
        }),
      };
    }

    const data = await response.json();
    console.log('✅ Printful API response received successfully');
    console.log('✅ Response structure:', Object.keys(data));
    console.log('✅ Products count:', data.result?.length || 0);
    console.log('✅ Response size:', JSON.stringify(data).length, 'characters');
    
    if (data.result && data.result.length > 0) {
      console.log('✅ First product sample:', {
        id: data.result[0].id,
        name: data.result[0].name,
        variants: data.result[0].variants,
        thumbnail: data.result[0].thumbnail_url ? 'Present' : 'Missing'
      });
    }

    // Return successful response
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.result || []),
    };

  } catch (error) {
    console.error('❌ Error in Netlify function:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    // Return detailed error for debugging
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        type: error.name,
        message: error.message,
        stack: error.stack,
        details: 'Check Netlify function logs for more information',
        timestamp: new Date().toISOString(),
        functionInfo: {
          hasApiKey: !!PRINTFUL_API_KEY,
          storeId: PRAY_TEES_STORE_ID,
          nodeVersion: process.version
        }
      }),
    };
  }
}; 