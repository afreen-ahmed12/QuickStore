# Back4App Setup Guide for QuickStore

This guide will help you set up QuickStore with Back4App (Parse Server).

## Step 1: Create a Back4App Account

1. Go to [https://www.back4app.com/](https://www.back4app.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create a New Parse App

1. Log in to your Back4App dashboard
2. Click "New App" or "Create App"
3. Choose "Create a new app"
4. Enter app name: **QuickStore**
5. Click "Create"

## Step 3: Get Your App Credentials

1. In your app dashboard, go to **App Settings** → **Security & Keys**
2. You'll find:
   - **Application ID**
   - **JavaScript Key** (Client Key)
   - **REST API Key** (optional, for server-side)

## Step 4: Configure Environment Variables

1. In the `frontend` directory, create a `.env` file:
   ```env
   VITE_PARSE_APPLICATION_ID=your_application_id_here
   VITE_PARSE_JAVASCRIPT_KEY=your_javascript_key_here
   VITE_PARSE_SERVER_URL=https://parseapi.back4app.com/
   ```

2. Replace the placeholder values with your actual credentials from Step 3

## Step 5: Set Up Parse Classes (Database Schema)

Back4App will automatically create classes when you first save data, but you can also create them manually:

### Option A: Automatic (Recommended)
The app will create the classes automatically when you first use them.

### Option B: Manual Setup
1. Go to **Database** → **Browser** in your Back4App dashboard
2. Create the following classes:

#### Class: `Item`
- `userId` (Pointer to `_User`)
- `type` (String) - 'link', 'text', 'message', 'file'
- `title` (String)
- `content` (String)
- `url` (String)
- `section` (String) - 'repos', 'github', 'useful', etc.
- `folderId` (Pointer to `Folder`, optional)
- `file` (File, optional)
- `fileName` (String, optional)
- `tags` (Array of Strings)
- `createdAt` (Date)
- `updatedAt` (Date)

#### Class: `Folder`
- `userId` (Pointer to `_User`)
- `name` (String)
- `description` (String)
- `color` (String)
- `createdAt` (Date)
- `updatedAt` (Date)

## Step 6: Configure Security (ACLs)

### For `Item` class:
1. Go to **Database** → **Browser** → **Item** → **Security**
2. Set **Default ACL** to:
   - **Read**: Only the user who created it
   - **Write**: Only the user who created it

### For `Folder` class:
1. Go to **Database** → **Browser** → **Folder** → **Security**
2. Set **Default ACL** to:
   - **Read**: Only the user who created it
   - **Write**: Only the user who created it

### Alternative: Use Cloud Code (Recommended for Production)

You can also set up Cloud Code functions to enforce security. This is more secure and recommended for production.

## Step 7: Install Dependencies and Run

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

## Step 8: Test the Application

1. Sign up for a new account
2. Log in
3. Try creating items, folders, and uploading files
4. Check your Back4App dashboard → **Database** → **Browser** to see your data

## Troubleshooting

### "Invalid session token" error
- Make sure you're using the correct Application ID and JavaScript Key
- Check that your `.env` file is in the `frontend` directory
- Restart your development server after changing `.env`

### "Class does not exist" error
- This is normal on first use - Parse will create the class automatically
- Or create the class manually in Back4App dashboard

### File upload not working
- Check that file size is under 10MB (Back4App free tier limit)
- Verify Parse.File is properly configured

### CORS errors
- Back4App handles CORS automatically, but make sure your app URL is whitelisted if needed
- Check Back4App dashboard → **App Settings** → **Security & Keys** → **CORS**

## Additional Resources

- [Back4App Documentation](https://www.back4app.com/docs)
- [Parse JavaScript SDK Guide](https://docs.parseplatform.org/js/guide/)
- [Back4App Dashboard](https://www.back4app.com/dashboard)

## Security Best Practices

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Use environment variables** for all sensitive data
3. **Set up proper ACLs** for your Parse classes
4. **Enable Cloud Code** for additional security in production
5. **Use HTTPS** in production

## Free Tier Limits

Back4App free tier includes:
- 10,000 requests/month
- 1GB database storage
- 1GB file storage
- Basic features

For production apps, consider upgrading to a paid plan.

---

Your QuickStore app is now ready to use with Back4App! 🚀

