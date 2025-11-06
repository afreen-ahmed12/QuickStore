# QuickStore - Personal Storage Hub

A modern, full-featured web application for organizing and managing your digital content including links, files, messages, and folders. Built with HTML, CSS, JavaScript, and powered by Back4App (Parse Server) for cloud storage and authentication.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure signup and login with Parse Server
- **Item Management**: Add, edit, and delete links, files, and messages
- **Folder Organization**: Create folders to organize your items
- **Search**: Real-time search across all your items
- **Tags**: Add tags to items for better organization
- **Favorites**: Mark items as favorites for quick access
- **File Uploads**: Upload files directly to Parse Server

### Enhanced Features
- **Dark/Light Theme**: Toggle between themes with persistent preference
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Account Statistics**: View your usage statistics
- **Account Management**: Delete your account and all associated data
- **Contact Form**: Send messages that are stored in Parse Server

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Back4App (Parse Server)
- **Database**: MongoDB (via Parse Server)
- **File Storage**: Parse File Storage
- **Authentication**: Parse User Authentication

## 📦 Setup

### Prerequisites
- A Back4App account (already configured)
- A modern web browser
- A web server (for local development) or deploy to Netlify/Vercel

### Configuration

The app is already configured with Back4App credentials in `config.js`:
- Application ID: `gOfRL3s3M8tosFfoNfjqNoh1MDXYfJqpof9MI8I8Lb`
- JavaScript Key: `dLZovR5KYVhY6VIa2FgalvinseNioqbfkVzdqsgK`
- Server URL: `https://parseapi.back4app.com`

### Local Development

1. Clone or download this repository
2. Open `index.html` in a web browser, or
3. Use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```
4. Navigate to `http://localhost:8000`

### Docker Deployment (Recommended)

The easiest way to deploy QuickStore is using Docker:

```bash
# Build the Docker image
docker build -t quickstore:latest .

# Run the container
docker run -d -p 8080:80 --name quickstore-app quickstore:latest
```

Or using Docker Compose:
```bash
docker-compose up -d
```

Access the app at `http://localhost:8080`

For detailed Docker deployment instructions, see [DOCKER.md](DOCKER.md)

### Deployment

#### Netlify
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Deploy (no build step needed)

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

## 📁 Project Structure

```
QuickStore/
├── index.html          # Login/Signup page
├── home.html           # Main dashboard
├── about.html          # About page
├── contact.html        # Contact form
├── mysetting.html      # User settings
├── logout.html         # Logout page
├── config.js           # Parse Server configuration
├── script.js           # Main application logic
├── styles.css          # Styling and themes
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose configuration
├── nginx.conf          # Nginx server configuration
├── .dockerignore       # Docker ignore file
├── netlify.toml        # Netlify deployment config
├── vercel.json         # Vercel deployment config
├── DEPLOYMENT.md       # Deployment guide
├── DOCKER.md           # Docker deployment guide
└── README.md           # This file
```

## 🎨 Features in Detail

### Authentication
- Secure user registration with email validation
- Password-based login
- Session management with Parse Server
- Automatic redirects for protected routes

### Item Management
- **Links**: Store and organize web links
- **Files**: Upload files or store file references
- **Messages**: Save important notes and messages
- **Folders**: Organize items into folders
- **Tags**: Add multiple tags to items
- **Favorites**: Star items for quick access
- **Search**: Search by title, content, or tags
- **Filter**: Filter by type or favorites

### User Experience
- **Responsive Design**: Mobile-first approach
- **Theme Toggle**: Switch between dark and light themes
- **Smooth Animations**: Polished UI transitions
- **Notifications**: Success and error notifications
- **Empty States**: Helpful messages when no items exist

## 🔒 Security

- All data is stored securely in Parse Server
- User authentication handled by Parse
- User-specific data isolation
- Secure file uploads
- Password validation

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Future Enhancements

Potential features for future versions:
- Export/Import functionality
- Sharing items with other users
- Advanced filtering and sorting
- Item history and versioning
- Rich text editor for messages
- Image previews for links
- Drag and drop organization

## 📝 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, use the contact form in the application or create an issue in the repository.

---

**Made with ❤️ using Back4App and Parse Server**
