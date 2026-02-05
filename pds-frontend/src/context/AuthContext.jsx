import { createContext, useContext, useState, useEffect } from 'react'
import authAPI from '../api/auth.api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState(null)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('pds_token')
        const savedUser = localStorage.getItem('pds_user')

        if (token && savedUser) {
          // Try to validate the token by fetching the profile
          const profile = await authAPI.getProfile()
          setUser(profile)
          setIsAuthenticated(true)
        }
      } catch (err) {
        // Token is invalid, clear storage
        localStorage.removeItem('pds_token')
        localStorage.removeItem('pds_user')
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authAPI.login(email, password)

      // Store token and user data
      if (response.token) {
        localStorage.setItem('pds_token', response.token)
      }
      if (response.refreshToken) {
        localStorage.setItem('pds_refresh_token', response.refreshToken)
      }

      // Extract user data from response
      const userData = {
        id: response.id,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role, // DOCTOR, PATIENT, ADMIN, etc.
        avatar: response.avatar || null,
      }

      localStorage.setItem('pds_user', JSON.stringify(userData))
      setUser(userData)
      setIsAuthenticated(true)

      return userData
    } catch (err) {
      const errorMsg = err.message || 'Authentication failed'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      // Call logout endpoint to invalidate token on server
      await authAPI.logout()
    } catch (err) {
      console.warn('Logout API error:', err)
    } finally {
      // Clear local storage regardless of API success
      localStorage.removeItem('pds_token')
      localStorage.removeItem('pds_refresh_token')
      localStorage.removeItem('pds_user')
      setUser(null)
      setIsAuthenticated(false)
      setLoading(false)
      setError(null)
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    error,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
