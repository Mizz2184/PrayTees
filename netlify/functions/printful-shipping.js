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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Method not allowed',
        allowedMethods: ['POST', 'OPTIONS']
      }),
    };
  }

  try {
    const requestBody = JSON.parse(event.body);
    console.log('🚀 Shipping calculation request:', requestBody);

    const response = await fetch('https://api.printful.com/shipping/rates', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Printful shipping API error:', errorData);
      
      return {
        statusCode: response.status,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Printful shipping API error',
          status: response.status,
          message: errorData
        }),
      };
    }

    const shippingData = await response.json();
    console.log('✅ Shipping rates calculated successfully');

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shippingData),
    };

  } catch (error) {
    console.error('Error calculating shipping rates:', error);
    
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