import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Bookmark, Link2, FileText, MessageSquare, Folder, Shield, Zap, Palette } from 'lucide-react'

const Home = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: <Link2 className="w-8 h-8" />,
      title: 'Organize Links',
      description: 'Store and organize all your important links in categorized sections like GitHub, Instagram, and more.'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Save Text & Messages',
      description: 'Keep your notes, messages, and important text snippets safe and easily accessible.'
    },
    {
      icon: <Folder className="w-8 h-8" />,
      title: 'Create Folders',
      description: 'Organize your content with custom folders and color-coded categories.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure Storage',
      description: 'Your data is encrypted and secure. Only you have access to your personal storage diary.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Fast & Responsive',
      description: 'Lightning-fast access to your stored content with a beautiful, responsive design.'
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'Dark Mode',
      description: 'Switch between light and dark themes for comfortable viewing at any time.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 bg-clip-text text-transparent">
              Your Personal Storage Diary
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Store links, text, messages, and files all in one place. Organize your digital life with QuickStore.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="btn-primary text-lg px-8 py-3">
                    Get Started Free
                  </Link>
                  <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 dark:bg-primary-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-pulse delay-700"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-primary-600 dark:text-primary-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Join thousands of users organizing their digital life with QuickStore.
            </p>
            {!isAuthenticated && (
              <Link to="/signup" className="inline-block bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors">
                Create Your Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

