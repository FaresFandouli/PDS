import { clsx } from 'clsx'

/**
 * Merge class names conditionally
 */
export const cn = (...inputs) => {
  return clsx(inputs)
}

/**
 * Format a date to a readable string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return 'N/A'

  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  return new Date(date).toLocaleDateString('fr-FR', { ...defaultOptions, ...options })
}

/**
 * Format a date and time
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A'

  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 'N/A'

  const today = new Date()
  const birth = new Date(dateOfBirth)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return `${age} ans`
}

/**
 * Get initials from name
 */
export const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

/**
 * Format phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return 'N/A'
  return phone.replace(/(\d{2})(?=\d)/g, '$1 ').trim()
}

/**
 * Truncate text
 */
export const truncate = (text, length = 50) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

/**
 * Calculate BMI
 */
export const calculateBMI = (weight, height) => {
  if (!weight || !height) return null
  const heightInMeters = height / 100
  return (weight / (heightInMeters * heightInMeters)).toFixed(1)
}

/**
 * Get BMI category
 */
export const getBMICategory = (bmi) => {
  if (!bmi) return null
  const value = parseFloat(bmi)

  if (value < 18.5) return { label: 'Insuffisance ponderale', color: 'blue' }
  if (value < 25) return { label: 'Poids normal', color: 'green' }
  if (value < 30) return { label: 'Surpoids', color: 'yellow' }
  return { label: 'Obesite', color: 'red' }
}

/**
 * Status badge helpers
 */
export const getStatusConfig = (status) => {
  const configs = {
    SCHEDULED: { label: 'Planifie', color: 'info' },
    IN_PROGRESS: { label: 'En cours', color: 'warning' },
    COMPLETED: { label: 'Termine', color: 'success' },
    CANCELLED: { label: 'Annule', color: 'danger' },
  }

  return configs[status] || { label: status, color: 'info' }
}

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
