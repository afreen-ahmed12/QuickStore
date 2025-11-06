# QuickStore Deployment Guide

This guide will help you deploy QuickStore to various hosting platforms.

## Prerequisites

- A Back4App account (already configured)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Options

### 1. Netlify (Recommended for Static Sites)

#### Method 1: Netlify Dashboard
1. Go to [Netlify](https://www.netlify.com/)
2. Sign up or log in
3. Click "Add new site" → "Import an existing project"
4. Connect your Git repository
5. Configure build settings:
   - Build command: (leave empty)
   - Publish directory: `.` (root)
6. Click "Deploy site"

#### Method 2: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### 2. Vercel

#### Method 1: Vercel Dashboard
1. Go to [Vercel](https://vercel.com/)
2. Sign up or log in
3. Click "Add New Project"
4. Import your Git repository
5. Configure:
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: `.`
6. Click "Deploy"

#### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 3. GitHub Pages

1. Push your code to GitHub
2. Go to your repository settings
3. Navigate to "Pages" section
4. Select source branch (usually `main` or `master`)
5. Select folder: `/ (root)`
6. Click "Save"
7. Your site will be available at `https://yourusername.github.io/repository-name`

**Note**: For GitHub Pages, you may need to update all internal links to use relative paths.

### 4. Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy --only hosting
```

### 5. AWS S3 + CloudFront

1. Create an S3 bucket
2. Enable static website hosting
3. Upload all files
4. Configure CloudFront distribution
5. Set up custom domain (optional)

## Environment Configuration

The app uses Back4App which is already configured in `config.js`. No environment variables are needed for basic deployment.

## Post-Deployment Checklist

- [ ] Test user registration
- [ ] Test user login
- [ ] Test adding items
- [ ] Test file uploads
- [ ] Test search functionality
- [ ] Test theme toggle
- [ ] Verify responsive design on mobile
- [ ] Check browser console for errors

## Custom Domain Setup

### Netlify
1. Go to Site settings → Domain management
2. Add custom domain
3. Follow DNS configuration instructions

### Vercel
1. Go to Project settings → Domains
2. Add your domain
3. Configure DNS records as instructed

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your Back4App app allows your domain:
1. Go to Back4App Dashboard
2. Navigate to App Settings → Security
3. Add your domain to allowed origins

### Parse SDK Not Loading
- Check internet connection
- Verify CDN link is accessible
- Consider hosting Parse SDK locally if needed

### Authentication Not Working
- Verify Back4App credentials in `config.js`
- Check browser console for errors
- Ensure Parse Server is accessible

## Support

For deployment issues, check:
- Platform-specific documentation
- Browser console for errors
- Network tab for failed requests

---

**Happy Deploying! 🚀**
