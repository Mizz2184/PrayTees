const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { cartItems, customerInfo, successUrl, cancelUrl } = JSON.parse(event.body);

    // Validate required fields
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Cart items are required' }),
      };
    }

    // Convert cart items to Stripe line items
    const lineItems = cartItems.map(item => {
      // Calculate price in cents (Stripe requires prices in smallest currency unit)
      const unitAmountCents = Math.round(item.price * 100);
      
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: `${item.size} • ${item.color}`,
            images: [item.image], // Stripe supports product images
            metadata: {
              printful_variant_id: item.variant_id || '',
              size: item.size,
              color: item.color,
            },
          },
          unit_amount: unitAmountCents,
        },
        quantity: item.quantity,
      };
    });

    // Add shipping as a line item if specified
    const shippingCost = customerInfo?.shipping || 9.99;
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
            description: 'Standard shipping',
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${process.env.URL || 'https://praytees.com'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.URL || 'https://praytees.com'}/checkout/cancel`,
      customer_email: customerInfo?.email,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP'],
      },
      metadata: {
        customer_phone: customerInfo?.phone || '',
        order_notes: customerInfo?.notes || '',
      },
      // Automatic tax calculation (optional)
      automatic_tax: {
        enabled: true,
      },
      // Custom fields for additional information
      custom_fields: customerInfo?.phone ? [
        {
          key: 'phone',
          label: {
            type: 'text',
            custom: 'Phone Number',
          },
          type: 'text',
          optional: false,
        },
      ] : [],
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
    };

  } catch (error) {
    console.error('Stripe checkout session creation error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to create checkout session',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      }),
    };
  }
}; 