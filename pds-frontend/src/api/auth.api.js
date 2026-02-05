import apiClient from './axios.config'

const authAPI = {
  // Login with email and password
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Register a new user
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await apiClient.get('/auth/profile')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    try {
      const response = await apiClient.post('/auth/refresh', {
        refreshToken,
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Logout (invalidate token on server)
  logout: async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.warn('Logout error:', error)
    }
  },

  // Verify email with token
  verifyEmail: async (data) => {
    try {
      const response = await apiClient.post('/auth/verify-email', data)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Request password reset
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', null, {
        params: { email }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiClient.post('/auth/reset-password', null, {
        params: { token, newPassword }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },
}

export default authAPI
