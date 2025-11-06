# QuickStore - Personal Storage Hub

A modern, full-featured web application for organizing and managing your digital content.

## 🚀 Quick Start

### Local Development

```bash
cd public
python -m http.server 8000
# or
npx serve
```

Then open `http://localhost:8000`

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

## 📁 Project Structure

```
QuickStore/
├── public/          # Frontend files (deployed to Vercel)
│   ├── *.html      # All HTML pages
│   ├── *.css       # Styles
│   └── *.js        # JavaScript files
├── cloud/          # Back4App Cloud Code
│   └── main.js     # Backend functions
├── docs/           # Documentation
└── vercel.json     # Vercel config
```

## 📚 Documentation

See `docs/` folder for detailed documentation:
- `README.md` - Full documentation
- `BACK4APP_DEPLOYMENT.md` - Cloud Code deployment
- `SECURITY_FEATURES.md` - Security features

## 🔧 Configuration

Back4App credentials are in `public/config.js`

## 🚀 Deployment

The `public` folder is automatically deployed to Vercel. Just run `vercel` from the project root.

---

**Made with ❤️ using Back4App and Vercel**
