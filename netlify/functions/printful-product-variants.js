const PRINTFUL_API_KEY = 'OuQXFPCYys3ONYsDlPDFy7mNdfIKPFqGxYC1GACl';

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Cache-Control': 'no-cache',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' }),
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Method not allowed',
        allowedMethods: ['GET', 'OPTIONS']
      }),
    };
  }

  try {
    const productId = event.queryStringParameters?.id;
    
    if (!productId) {
      return {
        statusCode: 400,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Product ID is required',
          usage: 'Add ?id=PRODUCT_ID to the URL'
        }),
      };
    }

    console.log('🚀 Fetching product variants for ID:', productId);

    const response = await fetch(`https://api.printful.com/store/products/${productId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Printful product variants API error:', errorData);
      
      return {
        statusCode: response.status,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Printful product variants API error',
          status: response.status,
          message: errorData
        }),
      };
    }

    const productData = await response.json();
    console.log('✅ Product variants fetched successfully');

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData.result || {}),
    };

  } catch (error) {
    console.error('Error fetching product variants:', error);
    
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message
      }),
    };
  }
}; 