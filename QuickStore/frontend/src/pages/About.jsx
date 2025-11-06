import { Target, Users, Heart, Code } from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            About QuickStore
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your personal digital storage diary, designed to keep your life organized.
          </p>
        </div>

        <div className="space-y-12">
          <div className="card">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Our Mission</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  QuickStore was created to solve a simple problem: we all have too many links, notes, files, and messages scattered across different platforms. 
                  Our mission is to provide a single, secure, and beautiful place where you can store and organize everything that matters to you.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Built with Modern Technology</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  QuickStore is built using cutting-edge web technologies to ensure a fast, responsive, and secure experience:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                  <li>React for a smooth, interactive user interface</li>
                  <li>Node.js and Express for a robust backend</li>
                  <li>MongoDB for reliable data storage</li>
                  <li>Tailwind CSS for beautiful, responsive design</li>
                  <li>JWT authentication for secure access</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">For Everyone</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Whether you're a developer storing GitHub repos, a content creator organizing social media links, 
                  or just someone who wants to keep their digital life in order, QuickStore is designed for you. 
                  Our intuitive interface makes it easy for anyone to get started.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Privacy First</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Your data is yours. We believe in privacy and security. All your stored content is encrypted and 
                  accessible only to you. We don't sell your data, and we don't track your activity. 
                  QuickStore is your personal storage diary, and it stays that way.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Have questions? <a href="/contact" className="text-primary-600 dark:text-primary-400 hover:underline">Get in touch</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default About

