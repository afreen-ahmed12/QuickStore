# Vercel Deployment Guide

## Quick Deploy

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Method 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub/GitLab repository
4. Vercel will auto-detect the configuration
5. Click "Deploy"

## Configuration

The project is pre-configured with `vercel.json`:
- **Output Directory**: `public` (contains all frontend files)
- **Build Command**: None (static files)
- **Clean URLs**: Enabled

## Project Structure

```
QuickStore/
├── public/          # ← This folder is deployed
│   ├── index.html
│   ├── *.html
│   ├── *.css
│   └── *.js
├── cloud/          # Back4App Cloud Code (not deployed to Vercel)
├── docs/           # Documentation (not deployed)
└── vercel.json     # Vercel configuration
```

## Environment Variables

If you need to change Back4App credentials:

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add variables:
   - `PARSE_APP_ID`
   - `PARSE_JS_KEY`
   - `PARSE_SERVER_URL`

3. Update `public/config.js` to read from environment variables

## Custom Domain

1. Go to Vercel Dashboard → Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Troubleshooting

### Files Not Found
- Ensure all files are in the `public` folder
- Check `vercel.json` has correct `outputDirectory`

### Routing Issues
- The `rewrites` in `vercel.json` handle all routes
- All routes serve the appropriate HTML files

### Build Errors
- This is a static site, no build needed
- If errors occur, check file paths in HTML files

## Continuous Deployment

When connected to GitHub:
- Every push to `main` branch auto-deploys
- Preview deployments for pull requests

---

**Your app is ready for Vercel! 🚀**

