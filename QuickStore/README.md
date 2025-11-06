# QuickStore - Personal Link & Message Diary

A web application for storing links, files, and messages in one place, organized by categories. Built with HTML, CSS, JavaScript, and integrated with Back4App (Parse Server) as the backend.

## Features

- 🔐 **User Authentication**: Sign up, login, and logout functionality
- 📚 **Categories**: Organize items into Books, TEDx, Channels, Links, Repositories, Messages, and Files
- ✏️ **CRUD Operations**: Create, Read, Update, and Delete items
- 📁 **File Storage**: Upload and download files using Parse File storage
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- ☁️ **Cloud Backend**: All data stored in Back4App (Parse Server)

## Setup Instructions

### 1. Create a Back4App Account

1. Go to [Back4App](https://www.back4app.com/)
2. Sign up for a free account
3. Create a new Parse App

### 2. Get Your Application Credentials

1. In your Back4App dashboard, select your app
2. Go to **App Settings** → **Security & Keys**
3. Copy the following:
   - **Application ID**
   - **JavaScript Key**

### 3. Configure the Application

1. Open `config.js` in the project root
2. Replace the placeholder values with your Back4App credentials:

```javascript
const PARSE_CONFIG = {
    applicationId: 'YOUR_APPLICATION_ID',      // Paste your Application ID here
    javascriptKey: 'YOUR_JAVASCRIPT_KEY',      // Paste your JavaScript Key here
    serverURL: 'https://parseapi.back4app.com'
};
```

### 4. Set Up Parse Schema

The application will automatically create the necessary Parse classes when you first use it. However, you can also manually create the schema:

1. In Back4App dashboard, go to **Database** → **Browser**
2. The app will create a class named `QuickStoreItem` with the following fields:
   - `user` (Pointer to _User)
   - `category` (String)
   - `title` (String)
   - `url` (String, optional)
   - `description` (String, optional)
   - `file` (File, optional)
   - `createdAt` (Date, automatic)
   - `updatedAt` (Date, automatic)

### 5. Configure Parse Security (Important!)

1. In Back4App dashboard, go to **App Settings** → **Security & Keys**
2. Under **Class-Level Permissions**, set permissions for `QuickStoreItem`:
   - **Create**: Authenticated users only
   - **Read**: Users can only read their own items
   - **Update**: Users can only update their own items
   - **Delete**: Users can only delete their own items

Alternatively, you can use Cloud Code or client-side ACL (Access Control Lists) for better security.

### 6. Run the Application

1. Open `index.html` in a web browser
2. Sign up with a new account
3. Start adding your items!

## Project Structure

```
QuickStore/
├── index.html          # Login/Signup page
├── dashboard.html      # Main dashboard
├── styles.css          # Global styles
├── dashboard.css       # Dashboard-specific styles
├── config.js           # Parse/Back4App configuration
├── auth.js             # Authentication logic (Parse)
├── dashboard.js        # Dashboard functionality (Parse)
└── README.md           # This file
```

## How to Use

1. **Sign Up**: Create a new account with your email and password
2. **Login**: Access your dashboard with your credentials
3. **Add Items**: Click "+ Add New Item" to create new entries
4. **Organize**: Use categories to filter and organize your items
5. **Edit/Delete**: Click Edit or Delete buttons on any item card
6. **Upload Files**: Attach files when creating or editing items
7. **Download Files**: Click the Download button on items with files

## Technologies Used

- **HTML5**: Structure and semantics
- **CSS3**: Styling and responsive design
- **JavaScript (ES6+)**: Application logic
- **Parse SDK**: Backend-as-a-Service integration
- **Back4App**: Parse Server hosting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security Notes

- All authentication is handled by Parse Server
- User data is isolated per user account
- Files are stored securely in Parse File storage
- HTTPS is recommended for production use

## Troubleshooting

### "Parse SDK not loaded" Error
- Make sure `config.js` is loaded before `auth.js` and `dashboard.js`
- Check that the Parse SDK CDN is accessible
- Verify your internet connection

### "Invalid Application ID" Error
- Double-check your credentials in `config.js`
- Ensure you copied the Application ID and JavaScript Key correctly
- Verify your Back4App app is active

### Items Not Loading
- Check browser console for errors
- Verify you're logged in
- Check Back4App dashboard for any app errors
- Ensure Parse class permissions are set correctly

## License

This project is open source and available for personal and commercial use.
