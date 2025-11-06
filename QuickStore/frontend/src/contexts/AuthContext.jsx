import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/parseService'
import Parse from '../config/parse'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = Parse.User.current()
    if (currentUser) {
      setUser({
        id: currentUser.id,
        username: currentUser.get('username'),
        email: currentUser.get('email')
      })
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const result = await authService.logIn(email, password)
      setUser(result.user)
      return result
    } catch (error) {
      throw error
    }
  }

  const signup = async (username, email, password) => {
    try {
      const result = await authService.signUp(username, email, password)
      setUser(result.user)
      return result
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logOut()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup,
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

