# QuickStore - Your Personal Storage Diary

QuickStore is a modern web application that acts as your personal digital storage diary. Store and organize links, text, messages, and files all in one beautiful, secure place.

## Features

- 🔐 **User Authentication** - Secure signup and login with JWT tokens
- 🔗 **Link Management** - Save and organize links in categorized sections (GitHub, Instagram, Twitter, YouTube, etc.)
- 📝 **Text & Messages** - Store notes, messages, and important text snippets
- 📁 **Folder Organization** - Create custom folders with color coding to organize your content
- 📎 **File Uploads** - Upload and store files (up to 10MB)
- 🎨 **Dark/Light Mode** - Beautiful theme switching for comfortable viewing
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- 🎯 **Smart Search** - Quickly find your stored items with search functionality
- 🏷️ **Tags** - Organize items with custom tags

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Parse SDK (Back4App)
- Lucide React (Icons)

### Backend (Back4App/Parse Server)
- Back4App (Backend-as-a-Service)
- Parse Server
- Parse User (Authentication)
- Parse Objects (Database)
- Parse Files (File Storage)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Back4App account (free tier available)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd QuickStore
   ```

2. **Create a Back4App account and app**
   - Go to [https://www.back4app.com/](https://www.back4app.com/)
   - Sign up and create a new app
   - Get your Application ID and JavaScript Key from App Settings → Security & Keys

3. **Set up environment variables**
   
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_PARSE_APPLICATION_ID=your_application_id_here
   VITE_PARSE_JAVASCRIPT_KEY=your_javascript_key_here
   VITE_PARSE_SERVER_URL=https://parseapi.back4app.com/
   ```

4. **Install dependencies**
   ```bash
   npm run install-all
   ```
   Or:
   ```bash
   cd frontend && npm install
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```
   This will start the frontend development server on port 3000.

6. **Access the application**
   
   Open your browser and navigate to:
   - Frontend: http://localhost:3000

**For detailed Back4App setup instructions, see [BACK4APP_SETUP.md](./BACK4APP_SETUP.md)**

## Project Structure

```
QuickStore/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/        # React contexts (Auth, Theme)
│   │   ├── pages/           # Page components
│   │   ├── services/        # Parse service layer
│   │   ├── config/          # Parse configuration
│   │   └── App.jsx          # Main app component
│   ├── .env                 # Back4App credentials (create this)
│   └── package.json
├── BACK4APP_SETUP.md        # Detailed Back4App setup guide
└── package.json             # Root package.json
```

## Usage

1. **Sign Up** - Create a new account with username, email, and password
2. **Login** - Sign in to access your dashboard
3. **Add Items** - Click "Add Item" to store links, text, messages, or files
4. **Create Folders** - Organize items by creating custom folders
5. **Filter & Search** - Use sections and search to find items quickly
6. **Edit/Delete** - Manage your stored items with edit and delete options

## Backend (Back4App/Parse)

This project uses Back4App (Parse Server) as the backend. All operations are handled through the Parse SDK:

### Authentication
- Uses Parse.User for signup/login
- Automatic session management
- Secure password hashing handled by Parse

### Database
- Parse Objects for Items and Folders
- Automatic schema creation
- User-based data isolation

### File Storage
- Parse.File for file uploads
- Automatic CDN distribution
- Secure file access

All API operations are handled through the Parse SDK in `frontend/src/services/parseService.js`.

## Deployment

### Quick Deploy (5 minutes)

Deploy your app to get a public link that works anywhere!

**Easiest option: Vercel**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up
3. Import your repository
4. Add environment variables (Back4App credentials)
5. Deploy!

**Your app will be live at:** `https://your-project.vercel.app`

📖 **See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for step-by-step instructions**  
📖 **See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment guide**

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# The built files will be in frontend/dist
```

### Environment Variables for Deployment

When deploying, add these environment variables in your hosting platform:
- `VITE_PARSE_APPLICATION_ID` - Your Back4App Application ID
- `VITE_PARSE_JAVASCRIPT_KEY` - Your Back4App JavaScript Key
- `VITE_PARSE_SERVER_URL` - `https://parseapi.back4app.com/`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Support

For issues and questions, please contact us through the Contact page or open an issue on GitHub.

---

Made with ❤️ for organizing your digital life

