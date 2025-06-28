// Try to use native fetch first, fallback to cross-fetch
let fetch;
try {
  fetch = globalThis.fetch || require('cross-fetch');
} catch (error) {
  console.error('Failed to load fetch:', error);
}

exports.handler = async (event, context) => {
  // Get API key from environment variables with fallback
  const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY || 'OuQXFPCYys3ONYsDlPDFy7mNdfIKPFqGxYC1GACl';
  
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Check if fetch is available
    if (!fetch) {
      throw new Error('Fetch is not available in this environment');
    }

    if (!event.body) {
      throw new Error('Request body is required');
    }

    const requestBody = JSON.parse(event.body);
    console.log('🚚 Netlify function: Calculating shipping rates...', requestBody);
    
    // Validate required fields
    if (!requestBody.recipient || !requestBody.items) {
      throw new Error('Missing required fields: recipient and items');
    }
    
    if (!requestBody.recipient.country_code) {
      throw new Error('Missing required field: recipient.country_code');
    }
    
    if (!Array.isArray(requestBody.items) || requestBody.items.length === 0) {
      throw new Error('Items array is required and must not be empty');
    }
    
    // Validate variant IDs
    for (const item of requestBody.items) {
      if (!item.variant_id || isNaN(parseInt(item.variant_id))) {
        throw new Error(`Invalid variant_id: ${item.variant_id}`);
      }
    }
    
    // Transform the request to match Printful API format
    const printfulRequest = {
      recipient: {
        address1: requestBody.recipient.address1 || "123 Main St",
        city: requestBody.recipient.city || "New York", 
        state_code: requestBody.recipient.state_code,
        country_code: requestBody.recipient.country_code,
        zip: requestBody.recipient.zip || "10001"
      },
      items: requestBody.items.map(item => ({
        variant_id: parseInt(item.variant_id),
        quantity: parseInt(item.quantity) || 1
      }))
    };

    console.log('🚚 Transformed request for Printful:', printfulRequest);
    
    const response = await fetch('https://api.printful.com/shipping/rates', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(printfulRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Printful API error response:', response.status, errorText);
      throw new Error(`Printful shipping API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Shipping rates calculated successfully:', data);
    
    // Validate the response structure
    if (!data || typeof data.code === 'undefined') {
      throw new Error('Invalid response format from Printful API');
    }
    
    if (data.code !== 200) {
      throw new Error(`Printful API returned error code: ${data.code} - ${data.error || 'Unknown error'}`);
    }

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('❌ Error calculating shipping rates:', error);
    
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to calculate shipping',
        message: error.message 
      }),
    };
  }
}; 