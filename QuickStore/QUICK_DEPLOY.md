# 🚀 Quick Deploy - Get Your App Live in 5 Minutes!

## Fastest Way: Deploy to Vercel

### Step 1: Push to GitHub (2 minutes)

```bash
# If you haven't initialized git yet
git init
git add .
git commit -m "QuickStore - Ready to deploy"
git branch -M main

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/QuickStore.git
git push -u origin main
```

### Step 2: Deploy to Vercel (3 minutes)

1. **Go to [vercel.com](https://vercel.com)** and sign up with GitHub

2. **Click "Add New Project"**

3. **Import your QuickStore repository**

4. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add these 3 variables:
     ```
     VITE_PARSE_APPLICATION_ID = (your Back4App Application ID)
     VITE_PARSE_JAVASCRIPT_KEY = (your Back4App JavaScript Key)
     VITE_PARSE_SERVER_URL = https://parseapi.back4app.com/
     ```

5. **Click "Deploy"**

6. **Wait 2-3 minutes** ⏳

7. **Done!** 🎉 Your app is live at `https://your-project.vercel.app`

---

## That's It!

Your QuickStore app is now accessible from anywhere in the world!

**Share your link:** `https://your-project.vercel.app`

---

## Need Back4App Credentials?

1. Go to [back4app.com](https://www.back4app.com)
2. Sign up and create a new app
3. Go to App Settings → Security & Keys
4. Copy Application ID and JavaScript Key

See [BACK4APP_SETUP.md](./BACK4APP_SETUP.md) for detailed instructions.

---

## Alternative: Netlify

If you prefer Netlify:

1. Go to [netlify.com](https://www.netlify.com)
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select your repository
5. Add environment variables (same as above)
6. Deploy!

Your app will be at `https://your-project.netlify.app`

---

**Questions?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

