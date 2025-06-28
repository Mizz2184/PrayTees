# Stripe Integration Setup Guide

## Environment Variables Required

To complete the Stripe integration, you need to set up the following environment variable in your Netlify deployment:

### Netlify Environment Variables

1. Go to your Netlify dashboard
2. Navigate to your site settings
3. Go to "Environment variables" section
4. Add the following variable:

**STRIPE_SECRET_KEY** = `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`

⚠️ **Important**: This is your live secret key, so make sure it's only added to Netlify's environment variables and never committed to your code repository.

## How It Works

### 1. Checkout Flow
- User fills out contact and shipping information
- Clicks "Pay with Stripe" button
- Creates a Stripe checkout session via Netlify function
- Redirects to Stripe's secure payment page
- After payment, redirects back to success/cancel pages

### 2. Stripe Checkout Session Features
- **Secure Payment Processing**: All payment data handled by Stripe
- **Real Product Images**: Product images displayed in Stripe checkout
- **Automatic Tax Calculation**: Stripe calculates taxes automatically
- **Multiple Payment Methods**: Supports cards, Apple Pay, Google Pay, etc.
- **Shipping Address Collection**: Collects and validates shipping addresses
- **Mobile Optimized**: Responsive design for all devices

### 3. Order Management
- **Success Page**: Shows order confirmation with order number
- **Cancel Page**: Handles cancelled payments gracefully
- **Email Notifications**: Stripe sends receipt emails automatically
- **Order Tracking**: Integration ready for order fulfillment

## Testing

### Local Development
For local testing, you can use Stripe's test keys:
- Test Publishable Key: `pk_test_...`
- Test Secret Key: `sk_test_...`

### Live Environment
The integration is configured with your live Stripe keys:
- Live Publishable Key: Already configured in the code
- Live Secret Key: Set as environment variable

## Stripe Dashboard

Monitor your payments and orders in the Stripe Dashboard:
- View transactions and customer data
- Set up webhooks for order fulfillment
- Access detailed analytics and reporting
- Manage refunds and disputes

## Security Features

- **PCI Compliance**: Stripe handles all PCI compliance requirements
- **Encryption**: All payment data encrypted in transit and at rest
- **Fraud Protection**: Built-in fraud detection and prevention
- **3D Secure**: Automatic 3D Secure authentication when required

## Next Steps

1. Set the `STRIPE_SECRET_KEY` environment variable in Netlify
2. Deploy the updated code
3. Test the checkout flow with a small purchase
4. Monitor payments in your Stripe dashboard

Your PrayTees store is now ready to accept secure payments! 🎉 