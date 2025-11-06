# Deployment Guide - QuickStore

This guide will help you deploy QuickStore to a free hosting platform so it can be accessed from anywhere via a public link.

## Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest) ⭐

Vercel is the easiest way to deploy React/Vite apps with automatic deployments.

#### Steps:

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Go to Vercel**
   - Visit [https://vercel.com](https://vercel.com)
   - Sign up/login with GitHub

3. **Import your project**
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite

4. **Configure environment variables**
   - In project settings, go to "Environment Variables"
   - Add these three variables:
     ```
     VITE_PARSE_APPLICATION_ID = your_application_id
     VITE_PARSE_JAVASCRIPT_KEY = your_javascript_key
     VITE_PARSE_SERVER_URL = https://parseapi.back4app.com/
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at `https://your-project-name.vercel.app`

6. **Automatic updates**
   - Every time you push to GitHub, Vercel automatically redeploys!

---

### Option 2: Netlify

Netlify is another excellent free hosting option.

#### Steps:

1. **Push your code to GitHub** (same as above)

2. **Go to Netlify**
   - Visit [https://www.netlify.com](https://www.netlify.com)
   - Sign up/login with GitHub

3. **Add new site**
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

4. **Configure build settings**
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`
   - Netlify will auto-detect the `netlify.toml` file

5. **Add environment variables**
   - Go to Site settings → Environment variables
   - Add:
     ```
     VITE_PARSE_APPLICATION_ID = your_application_id
     VITE_PARSE_JAVASCRIPT_KEY = your_javascript_key
     VITE_PARSE_SERVER_URL = https://parseapi.back4app.com/
     ```

6. **Deploy**
   - Click "Deploy site"
   - Your app will be live at `https://random-name.netlify.app`
   - You can change the name in Site settings → Change site name

---

### Option 3: GitHub Pages (Alternative)

For GitHub Pages, you'll need to modify the build slightly.

#### Steps:

1. **Install gh-pages**
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   Add to scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

3. **Update vite.config.js**
   ```js
   export default defineConfig({
     base: '/QuickStore/', // Your repo name
     // ... rest of config
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**
   - Go to repo Settings → Pages
   - Select gh-pages branch
   - Your app will be at `https://yourusername.github.io/QuickStore`

---

## Pre-Deployment Checklist

Before deploying, make sure:

- ✅ You have a Back4App account and app created
- ✅ You have your Back4App credentials (Application ID, JavaScript Key)
- ✅ Your code is pushed to GitHub (for Vercel/Netlify)
- ✅ Environment variables are set in the hosting platform
- ✅ You've tested the app locally

## Testing Your Deployment

After deployment:

1. Visit your live URL
2. Try signing up for a new account
3. Test creating items, folders, and uploading files
4. Check that dark/light mode works
5. Test on mobile device

## Custom Domain (Optional)

Both Vercel and Netlify support custom domains:

- **Vercel**: Project Settings → Domains → Add Domain
- **Netlify**: Site Settings → Domain Management → Add custom domain

## Troubleshooting

### Build fails
- Check that all dependencies are in `package.json`
- Verify build command is correct
- Check build logs in the hosting platform

### Environment variables not working
- Make sure variable names start with `VITE_`
- Redeploy after adding environment variables
- Check that variables are set in the hosting platform (not just `.env`)

### App loads but shows errors
- Check browser console for errors
- Verify Back4App credentials are correct
- Make sure Back4App app is active
- Check CORS settings in Back4App dashboard

### Routing not working (404 on refresh)
- Vercel: The `vercel.json` handles this automatically
- Netlify: The `netlify.toml` handles this automatically
- Make sure redirect rules are configured

## Recommended: Vercel

**Why Vercel?**
- ✅ Easiest setup
- ✅ Automatic deployments from GitHub
- ✅ Free SSL certificate
- ✅ Global CDN
- ✅ Great performance
- ✅ Free tier is generous

## Your Live URL

Once deployed, you'll get a URL like:
- Vercel: `https://quickstore-xyz.vercel.app`
- Netlify: `https://quickstore-xyz.netlify.app`

Share this URL with anyone to access your QuickStore app from anywhere! 🚀

---

**Need help?** Check the hosting platform's documentation or open an issue in your repository.

