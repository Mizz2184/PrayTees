exports.handler = async (event, context) => {
  console.log('📧 Contact form submission received');
  console.log('📧 Event method:', event.httpMethod);
  
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    console.log('📧 Handling OPTIONS/preflight request');
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    console.log('📧 Method not allowed:', event.httpMethod);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { name, email, phone, message } = JSON.parse(event.body);
    
    console.log('📧 Form data received:', { name, email, phone: phone ? 'provided' : 'not provided' });

    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          details: 'Name, email, and message are required' 
        }),
      };
    }

    // Webhook URL for Make.com
    const webhookUrl = 'https://hook.us2.make.com/hsrvwinyy5o4gfsokcgkdpom256fwmoq';

    // Prepare the data to send to the webhook
    const webhookData = {
      name,
      email,
      phone: phone || null,
      message,
      timestamp: new Date().toISOString(),
      source: 'PrayTees Contact Form'
    };

    console.log('📧 Sending data to webhook...');

    // Send data to the webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed with status: ${response.status} - ${response.statusText}`);
    }

    const responseData = await response.text();
    console.log('✅ Webhook response:', responseData);
    
    console.log('✅ Contact form data sent successfully to webhook');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Contact form submitted successfully',
        success: true 
      }),
    };

  } catch (error) {
    console.error('❌ Error sending data to webhook:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to submit contact form',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
    };
  }
}; 