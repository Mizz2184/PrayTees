# PrayTees E-commerce - Deployment Guide

## 🚀 Quick Deployment to Netlify

### Method 1: Deploy from GitHub (Recommended)

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Netlify**:
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "New site from Git"
   - Choose GitHub and select your `PrayTees` repository
   - Build settings should auto-detect from `netlify.toml`:
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Functions directory: `netlify/functions`
   - Click "Deploy site"

### Method 2: Manual Deploy

1. **Build the project**:
   ```bash
   npm install
   npm run build
   ```

2. **Manual upload**:
   - Go to Netlify dashboard
   - Drag and drop the `dist` folder
   - Upload `netlify/functions` to the functions directory

## 🔧 Environment Configuration

The Printful API key is embedded in the Netlify functions for immediate deployment. No additional environment variables needed.

## 🧪 Testing Deployment

### 1. Function Test (Primary Diagnostic Tool)

Visit: `https://YOUR-SITE.netlify.app/function-test.html`

This page will test:
- ✅ Basic connectivity
- ✅ Netlify function deployment
- ✅ Printful API integration
- ✅ CORS configuration
- ✅ Error handling

### 2. API Test (Secondary Tool)

Visit: `https://YOUR-SITE.netlify.app/test-api.html`

### 3. Main Application

Visit: `https://YOUR-SITE.netlify.app`

Expected results:
- 20 real Printful products displayed
- Real pricing ($18.95 - $52.99)
- Working cart and checkout
- No fallback/dummy products

## 🔍 Troubleshooting

### Issue: Functions Return HTML Instead of JSON

**Symptoms:**
- Error: "SyntaxError: Unexpected token '<', "<!DOCTYPE"... is not valid JSON"
- Products not loading on main site

**Solutions:**

1. **Check function deployment**:
   - Go to Netlify dashboard → Functions tab
   - Verify `printful-products`, `printful-shipping`, `printful-product-variants` are listed
   - Check function logs for errors

2. **Verify configuration**:
   - Ensure `netlify.toml` is in root directory
   - Check redirects: `/api/*` → `/.netlify/functions/:splat`

3. **Force redeploy**:
   - In Netlify dashboard: Deploys → Trigger deploy → Deploy site

### Issue: Products Not Loading

**Check these in order:**

1. **Function diagnostic**: Visit `/function-test.html`
2. **Network tab**: Look for 404s on `/api/` calls
3. **Function logs**: Check Netlify dashboard → Functions → View logs
4. **API connectivity**: Ensure functions return JSON, not HTML

### Issue: CORS Errors

**Solutions:**
- Functions include proper CORS headers
- Check `netlify.toml` headers configuration
- Ensure no browser extensions blocking requests

## 📁 File Structure After Deployment

```
dist/                     # Built React application
├── index.html           # Main app
├── function-test.html   # Primary diagnostic tool
├── test-api.html       # Secondary test tool
├── _redirects          # SPA routing
└── assets/             # CSS/JS bundles

netlify/functions/       # Serverless functions
├── printful-products.js
├── printful-shipping.js
└── printful-product-variants.js
```

## ✅ Success Criteria

After successful deployment:

1. **Functions working**: `/function-test.html` shows all green checkmarks
2. **Products loading**: Main site displays 20 real Printful products
3. **Real pricing**: Products show actual Printful prices ($18.95+)
4. **Cart functional**: Add to cart and checkout work
5. **No fallbacks**: Zero dummy/placeholder products shown

## 🆘 Still Having Issues?

1. Check the `/function-test.html` diagnostic tool first
2. Review Netlify function logs in dashboard
3. Verify `netlify.toml` configuration
4. Try manual redeploy
5. Check browser network tab for specific error messages

## 📞 Support Resources

- **Netlify Functions**: [docs.netlify.com/functions](https://docs.netlify.com/functions/)
- **Printful API**: [developers.printful.com](https://developers.printful.com)
- **React Router**: For SPA routing issues

---

The site is configured to work immediately after deployment with real Printful products from store ID 16243594. 