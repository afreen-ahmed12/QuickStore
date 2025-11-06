# Quick Setup Guide for QuickStore with Back4App

Follow these steps to get QuickStore up and running with Back4App backend:

## Step 1: Create Back4App Account and App

1. Visit [https://www.back4app.com/](https://www.back4app.com/)
2. Sign up for a free account (or log in if you already have one)
3. Click "Create a new app" or "New App"
4. Choose "Build new app" → "Backend as a Service"
5. Enter app name: `QuickStore` (or any name you prefer)
6. Click "Create"

## Step 2: Get Your Credentials

1. In your Back4App dashboard, select your newly created app
2. Go to **App Settings** (click the gear icon ⚙️ in the left sidebar)
3. Click on **Security & Keys**
4. You'll see two important values:
   - **Application ID** - Copy this value
   - **JavaScript Key** - Copy this value
   - Keep the **Master Key** secret (don't use it in client-side code)

## Step 3: Configure Your App

1. Open `config.js` in your QuickStore project
2. Replace the placeholder values:

```javascript
const PARSE_CONFIG = {
    applicationId: 'PASTE_YOUR_APPLICATION_ID_HERE',
    javascriptKey: 'PASTE_YOUR_JAVASCRIPT_KEY_HERE',
    serverURL: 'https://parseapi.back4app.com'
};
```

**Example:**
```javascript
const PARSE_CONFIG = {
    applicationId: 'abc123xyz456',
    javascriptKey: 'def789uvw012',
    serverURL: 'https://parseapi.back4app.com'
};
```

## Step 4: Set Up Database Permissions (Important for Security)

1. In Back4App dashboard, go to **Database** → **Browser**
2. You should see `_User` class (this is created automatically)
3. When you first use the app, a class called `QuickStoreItem` will be created automatically
4. After creating your first item, go to **App Settings** → **Security & Keys**
5. Scroll down to **Class-Level Permissions**
6. Find `QuickStoreItem` class and configure:
   - **Create**: ✅ Authenticated users
   - **Read**: ✅ Users can only read their own items
   - **Update**: ✅ Users can only update their own items
   - **Delete**: ✅ Users can only delete their own items

**Alternative:** You can also use Cloud Code with ACL (Access Control Lists) for more granular control.

## Step 5: Test Your Setup

1. Open `index.html` in your web browser
2. You should see the login page without any errors
3. Click "Sign up" and create a test account
4. After signing up, you should be redirected to the dashboard
5. Try adding a new item to test if everything works

## Troubleshooting

### "Parse SDK not loaded" Error
- Check your internet connection
- The Parse SDK is loaded from a CDN, so you need internet access
- Try refreshing the page

### "Please configure your Back4App credentials" Error
- Make sure you've updated `config.js` with your actual credentials
- Check that you copied the Application ID and JavaScript Key correctly (no extra spaces)
- Make sure the file is saved

### "Invalid Application ID" or Authentication Errors
- Double-check your Application ID and JavaScript Key in `config.js`
- Verify they match exactly what's in your Back4App dashboard
- Make sure your Back4App app is active (not deleted or suspended)

### Items Not Saving
- Check browser console for errors (F12 → Console tab)
- Verify you're logged in
- Check Back4App dashboard → Logs for any server errors
- Ensure class-level permissions are set correctly

### Files Not Uploading
- Check file size limits in Back4App (free tier may have limits)
- Check browser console for errors
- Verify Parse File storage is enabled in Back4App

## Next Steps

Once everything is working:
- Start adding your links, files, and messages
- Organize them using categories
- Your data is now stored securely in the cloud!

## Need Help?

- Check the main [README.md](README.md) for more details
- Visit [Back4App Documentation](https://www.back4app.com/docs)
- Check Parse Server documentation for advanced features
