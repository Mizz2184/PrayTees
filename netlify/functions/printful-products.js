// Try to use native fetch first, fallback to cross-fetch
let fetch;
try {
  fetch = globalThis.fetch || require('cross-fetch');
} catch (error) {
  console.error('Failed to load fetch:', error);
}

const PRAY_TEES_STORE_ID = 16243594;
const crossFetch = require('cross-fetch');

// 🚀 SERVER-SIDE CACHING
let cachedProducts = null;
let cacheTimestamp = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache

exports.handler = async (event, context) => {
  // Get API key from environment variables
  const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY || 'OuQXFPCYys3ONYsDlPDFy7mNdfIKPFqGxYC1GACl';
  
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

  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    console.log('🚀 Handling OPTIONS/preflight request');
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    console.log('🚀 Method not allowed:', event.httpMethod);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }
  
  if (!PRINTFUL_API_KEY) {
    console.error('❌ PRINTFUL_API_KEY is not configured');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'API key not configured' }),
    };
  }

  try {
    // 🚀 CHECK CACHE FIRST
    const now = Date.now();
    if (cachedProducts && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('🚀 Returning cached products');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cachedProducts),
      };
    }

    // Check if fetch is available
    const fetch = global.fetch || crossFetch;
    if (!fetch) {
      throw new Error('Fetch is not available in this environment');
    }

    console.log('🌐 Netlify function: Fetching Printful products...');
    
    // 🚀 FETCH ALL PRODUCTS WITH PAGINATION
    let allProducts = [];
    let offset = 0;
    const limit = 100; // Max allowed by Printful API
    let hasMoreProducts = true;
    
    while (hasMoreProducts) {
      console.log(`📄 Fetching products page: offset=${offset}, limit=${limit}`);
      
      const response = await fetch(`https://api.printful.com/store/products?offset=${offset}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Printful API error:', response.status, errorText);
        throw new Error(`Printful API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.code === 200 && data.result) {
        const products = data.result;
        allProducts = allProducts.concat(products);
        
        console.log(`📄 Page fetched: ${products.length} products (total so far: ${allProducts.length})`);
        
        // Check if we need to fetch more pages
        if (products.length < limit) {
          hasMoreProducts = false;
          console.log('✅ All products fetched - reached last page');
        } else {
          offset += limit;
        }
      } else {
        throw new Error('Invalid response from Printful API');
      }
    }
    
    console.log(`🎯 Total products fetched: ${allProducts.length}`);
    
    // 🚀 CACHE THE RESULTS
    cachedProducts = allProducts;
    cacheTimestamp = now;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(allProducts),
    };
    
  } catch (error) {
    console.error('❌ Error fetching Printful products:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch products',
        details: error.message 
      }),
    };
  }
}; 