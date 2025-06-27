# PrayTees Deployment Guide

## Overview
This e-commerce site is now configured to show **only real Printful products** with proper Netlify deployment support.

## ✅ Confirmed: Printful Store Has 20 Real Products
The PrayTees store (ID: 16243594) contains 20 active products including:
- "Before the Play We Pray Unisex classic tee"
- "Pray Loud Live Bold Unisex classic tee" 
- "Power Moves Start With Prayer Unisex classic tee"
- "Black Men Pray Unisex organic cotton t-shirt"
- And 16 more faith-based designs

## Key Changes Made

### 1. Netlify Serverless Functions
Created three serverless functions to bypass CORS restrictions:

- **`netlify/functions/printful-products.js`** - Fetches all products from Printful store
- **`netlify/functions/printful-shipping.js`** - Calculates real shipping rates
- **`netlify/functions/printful-product-variants.js`** - Gets detailed product variants

### 2. Configuration Files
- **`netlify.toml`** - Netlify build and routing configuration
- **`public/_redirects`** - SPA routing support
- **`public/404.html`** - Fallback page for direct URL access

### 3. API Service Updates
- Updated `src/services/printfulApi.ts` to use Netlify functions
- Enhanced environment detection for production vs development
- Removed all fallback products - site now shows only real Printful products
- Enhanced error handling and debugging

### 4. Component Updates
- **ProductGrid**: Shows loading state, real products, or empty state message
- **Shop**: Proper error handling for no products scenario
- **usePrintfulProducts**: Configured for Netlify function endpoints

## Deployment Process

### For Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Netlify will automatically detect and deploy the functions from `netlify/functions/`

### File Structure for Deployment
```
dist/                      # Built React app
├── index.html            # Main app
├── test-api.html         # Debug page
├── _redirects           # SPA routing
├── 404.html             # Fallback page
└── assets/              # CSS/JS bundles

netlify/functions/        # Serverless functions
├── printful-products.js
├── printful-shipping.js
└── printful-product-variants.js

netlify.toml             # Netlify configuration
```

## Environment Setup

### Printful Configuration
- **Store ID**: 16243594 (PrayTees store) ✅ Confirmed Active
- **API Key**: Configured in serverless functions ✅ Working
- **Products**: 20 real products available ✅ Confirmed

### API Endpoints (Production)
- Products: `/.netlify/functions/printful-products`
- Shipping: `/.netlify/functions/printful-shipping`
- Variants: `/.netlify/functions/printful-product-variants`

## 🚨 Troubleshooting

### If Products Don't Show on Deployed Site:

1. **Check Netlify Function Logs**
   - Go to Netlify dashboard → Functions tab
   - Check logs for the `printful-products` function
   - Look for error messages or API call failures

2. **Test the API Directly**
   - Visit `https://your-domain.com/test-api.html`
   - Click "Test Printful Products Function"
   - Check browser console for detailed error messages

3. **Verify Function Deployment**
   - Ensure `netlify/functions/` folder is in your repository
   - Check that `netlify.toml` is in the root directory
   - Verify functions are listed in Netlify dashboard

4. **Check Browser Console**
   - Open developer tools on your deployed site
   - Look for API call errors or CORS issues
   - Check network tab for failed requests

### Common Issues:

**Problem**: "Products Loading" message appears indefinitely
**Solution**: Check Netlify function logs for API errors

**Problem**: Network request fails to `/.netlify/functions/printful-products`
**Solution**: Verify function is deployed and `netlify.toml` is configured

**Problem**: CORS errors in browser console
**Solution**: This should not happen with serverless functions - check function headers

## Features
✅ **Real Printful Products Only** - 20 products confirmed in store  
✅ **Real Pricing** - Actual prices from Printful API  
✅ **Real Shipping Rates** - Live shipping calculations  
✅ **CORS-Free** - Serverless functions bypass browser restrictions  
✅ **SPA Routing** - Direct URL access works correctly  
✅ **Error Handling** - Graceful handling when API unavailable  
✅ **Debug Tools** - Test page included for troubleshooting  

## Testing Checklist
- [ ] Build completes without errors (`npm run build`)
- [ ] `dist` folder contains all necessary files
- [ ] Netlify functions deploy successfully
- [ ] Test page works: `/test-api.html`
- [ ] Products load on main site
- [ ] Cart and checkout functionality works

## Notes
- The site requires Netlify's serverless function support to work properly
- All API calls are routed through Netlify functions to avoid CORS issues
- Build output is optimized for production deployment
- Debug page included at `/test-api.html` for troubleshooting 