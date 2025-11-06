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

### 5. Docker Deployment

#### Build and Run Locally
```bash
# Build the Docker image
docker build -t quickstore:latest .

# Run the container
docker run -d -p 8080:80 --name quickstore-app quickstore:latest

# Access the app at http://localhost:8080
```

#### Using Docker Compose
```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

#### Deploy to Cloud Platforms

**Docker Hub:**
```bash
# Build image
docker build -t yourusername/quickstore:latest .

# Push to Docker Hub
docker push yourusername/quickstore:latest
```

**AWS ECS/Fargate:**
1. Build and push image to ECR (Elastic Container Registry)
2. Create ECS task definition
3. Create ECS service
4. Configure load balancer

**Google Cloud Run:**
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/PROJECT-ID/quickstore
gcloud run deploy quickstore --image gcr.io/PROJECT-ID/quickstore --platform managed
```

**Azure Container Instances:**
```bash
# Build and push to Azure Container Registry
az acr build --registry myregistry --image quickstore:latest .

# Deploy
az container create --resource-group myResourceGroup --name quickstore --image myregistry.azurecr.io/quickstore:latest --dns-name-label quickstore --ports 80
```

**DigitalOcean App Platform:**
1. Connect your GitHub repository
2. Select Docker as the source type
3. Use the Dockerfile
4. Deploy

**Heroku:**
```bash
# Login to Heroku Container Registry
heroku container:login

# Create app
heroku create your-app-name

# Push and release
heroku container:push web
heroku container:release web
```

### 6. AWS S3 + CloudFront

1. Create an S3 bucket
2. Enable static website hosting
3. Upload all files
4. Configure CloudFront distribution
5. Set up custom domain (optional)

## Environment Configuration

The app uses Back4App which is already configured in `config.js`. No environment variables are needed for basic deployment.

### Docker Environment Variables (Optional)

If you want to use environment variables for configuration, you can modify the Dockerfile to support them:

```dockerfile
# Add to Dockerfile
ENV PARSE_APP_ID=your_app_id
ENV PARSE_JS_KEY=your_js_key
ENV PARSE_SERVER_URL=https://parseapi.back4app.com
```

Then update `config.js` to read from environment variables if needed.

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
