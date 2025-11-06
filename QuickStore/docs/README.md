# QuickStore - Personal Storage Hub

A modern, full-featured web application for organizing and managing your digital content including links, files, messages, and folders. Built with HTML, CSS, JavaScript, and powered by Back4App (Parse Server) for cloud storage and authentication.

## 🚀 Quick Start

### Local Development

1. Navigate to the `public` folder
2. Open `index.html` in a web browser, or use a local server:
   ```bash
   cd public
   python -m http.server 8000
   # or
   npx serve
   ```
3. Navigate to `http://localhost:8000`

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Or connect your GitHub repository to Vercel dashboard for automatic deployments.

## 📁 Project Structure

```
QuickStore/
├── public/              # Frontend files (deployed to Vercel)
│   ├── index.html      # Login/Signup page
│   ├── home.html       # Main dashboard
│   ├── about.html      # About page
│   ├── contact.html    # Contact form
│   ├── mysetting.html  # User settings
│   ├── logout.html     # Logout page
│   ├── config.js       # Parse Server configuration
│   ├── script.js       # Main application logic
│   └── styles.css      # Styling and themes
├── cloud/              # Back4App Cloud Code
│   ├── main.js         # Cloud functions and hooks
│   └── package.json   # Cloud Code dependencies
├── docs/               # Documentation
│   ├── README.md       # This file
│   ├── BACK4APP_DEPLOYMENT.md
│   └── SECURITY_FEATURES.md
├── vercel.json        # Vercel deployment config
└── .gitignore         # Git ignore file
```

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Back4App (Parse Server)
- **Database**: MongoDB (via Parse Server)
- **File Storage**: Parse File Storage
- **Authentication**: Parse User Authentication
- **Deployment**: Vercel

## ✨ Features

### Core Functionality
- User Authentication with email verification
- Item Management (links, files, messages)
- Folder Organization
- Search & Filter
- Tags & Favorites
- File Uploads

### Security Features
- Email Verification
- Password Reset
- Rate Limiting
- Input Validation
- Activity Logging
- GDPR Compliant Data Export

## 📦 Setup

### Prerequisites
- A Back4App account
- Vercel account (for deployment)

### Configuration

The app is configured with Back4App credentials in `public/config.js`:
- Application ID: `gOfRL3s3M8tosFfoNfjqNoh1MDXYfJqpof9MI8I8Lb`
- JavaScript Key: `dLZovR5KYVhY6VIa2FgalvinseNioqbfkVzdqsgK`
- Server URL: `https://parseapi.back4app.com`

### Deploy Cloud Code

1. Go to Back4App Dashboard
2. Navigate to Server Settings → Cloud Code
3. Upload `cloud/main.js`
4. Deploy

See `docs/BACK4APP_DEPLOYMENT.md` for detailed instructions.

## 🚀 Deployment

### Vercel Deployment

The project is configured for Vercel deployment. The `public` folder contains all frontend files that will be deployed.

**Using Vercel CLI:**
```bash
vercel
```

**Using Vercel Dashboard:**
1. Connect your GitHub repository
2. Set root directory to project root
3. Vercel will automatically detect the configuration

## 📚 Documentation

- **Back4App Deployment**: See `docs/BACK4APP_DEPLOYMENT.md`
- **Security Features**: See `docs/SECURITY_FEATURES.md`

## 🔒 Security

- All data validated server-side
- Rate limiting enabled
- Activity logging
- Secure authentication
- GDPR compliant

## 📝 License

This project is open source and available for personal and commercial use.

---

**Made with ❤️ using Back4App and Vercel**
