// Try to use native fetch first, fallback to cross-fetch
let fetch;
try {
  fetch = globalThis.fetch || require('cross-fetch');
} catch (error) {
  console.error('Failed to load fetch:', error);
}

const PRINTFUL_API_KEY = 'OuQXFPCYys3ONYsDlPDFy7mNdfIKPFqGxYC1GACl';

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

  // Extract product ID from path
  const productId = event.queryStringParameters?.id;
  
  if (!productId) {
    return {
      statusCode: 400,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Product ID required' }),
    };
  }

  try {
    // Check if fetch is available
    if (!fetch) {
      throw new Error('Fetch is not available in this environment');
    }

    console.log('🔍 Netlify function: Fetching variants for product', productId);
    
    const response = await fetch(`https://api.printful.com/store/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Product variants fetched successfully');

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.result || {}),
    };
  } catch (error) {
    console.error('❌ Error fetching product variants:', error);
    
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch product variants',
        message: error.message 
      }),
    };
  }
}; 