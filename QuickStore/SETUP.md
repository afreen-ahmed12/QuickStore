# Quick Setup Guide

## Quick Start

1. **Create a Back4App account:**
   - Go to [https://www.back4app.com/](https://www.back4app.com/)
   - Sign up and create a new app
   - Get your Application ID and JavaScript Key from App Settings → Security & Keys

2. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

3. **Create frontend/.env file:**
   ```env
   VITE_PARSE_APPLICATION_ID=your_application_id_here
   VITE_PARSE_JAVASCRIPT_KEY=your_javascript_key_here
   VITE_PARSE_SERVER_URL=https://parseapi.back4app.com/
   ```
   Replace the placeholder values with your actual Back4App credentials.

4. **Run the application:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Frontend: http://localhost:3000

## First Time Setup

1. Sign up for a new account
2. Login with your credentials
3. Start adding items to your dashboard!
4. Check your Back4App dashboard → Database → Browser to see your data

## Troubleshooting

### "Invalid session token" or Parse errors
- Make sure you've created the `.env` file in the `frontend` directory
- Verify your Application ID and JavaScript Key are correct
- Restart the development server after changing `.env`

### "Class does not exist" error
- This is normal on first use - Parse will create classes automatically
- Or create the classes manually in Back4App dashboard

### Module Not Found Errors
- Run `npm install` in the frontend directory
- Delete node_modules and reinstall if needed

### File upload not working
- Check that file size is under 10MB (Back4App free tier limit)
- Verify Parse.File is properly configured

For detailed Back4App setup, see [BACK4APP_SETUP.md](./BACK4APP_SETUP.md)

