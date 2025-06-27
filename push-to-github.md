# How to Push to GitHub

## Option 1: GitHub Desktop (Easiest)
1. Download GitHub Desktop: https://desktop.github.com/
2. Sign in with your GitHub account
3. Click "Add an Existing Repository from your Hard Drive"
4. Select this folder: `C:\Users\MP\Downloads\faith-threads-commerce-main`
5. Click "Publish repository" and choose "PrayTees" as the name

## Option 2: Personal Access Token
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens
2. Generate a new token with "repo" permissions
3. Copy the token
4. Run these commands:

```bash
git remote set-url origin https://YOUR_TOKEN@github.com/Mizz2184/PrayTees.git
git push -u origin master
```

Replace `YOUR_TOKEN` with the token you copied.

## Option 3: Manual Upload
1. Go to https://github.com/Mizz2184/PrayTees
2. Click "uploading an existing file"
3. Drag the entire project folder
4. Commit the upload

## Current Status
✅ All code changes are committed locally
✅ Repository is configured with the correct remote URL
✅ Ready to push to GitHub

The code includes:
- Fixed Netlify functions for Printful API
- Diagnostic tools for troubleshooting
- Enhanced error handling
- Complete e-commerce functionality
- 20 real Printful products confirmed 