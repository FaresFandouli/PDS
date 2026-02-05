import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Mail, User, Lock, Phone, MapPin, Eye, EyeOff, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import authAPI from '../../api/auth.api'

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '', // Optionnel - affiché temporairement
    role: 'PATIENT',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    dateOfBirth: '',
    gender: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Créer l'objet request sans le mot de passe
      const request = { ...formData }
      delete request.password // Le mot de passe est généré par le serveur

      const response = await authAPI.register(request)

      // Afficher le mot de passe temporaire
      toast.success(`Inscription réussie! Vérifiez votre email.`)

      // Afficher modal avec le mot de passe temporaire
      // Pour la démo, on affiche une notification
      setTimeout(() => {
        toast((t) => (
          <div className="text-sm">
            <p className="font-bold mb-2">Vous recevrez un email avec:</p>
            <p>✓ Mot de passe temporaire</p>
            <p>✓ Lien de vérification d'email</p>
            <p className="mt-2">Connectez-vous avec le mot de passe temporaire.</p>
          </div>
        ), { duration: 10000 })
      }, 1000)

      // Rediriger vers login après 2 secondes
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(
        error.response?.data?.message ||
        'Erreur lors de l\'inscription'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 via-purple-900 to-black">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Registration Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="glass-light rounded-3xl p-8 shadow-glass-lg">
          {/* Header */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">Rejoignez PDS Health</h1>
            <p className="text-white/60">Créez votre compte pour accéder à nos services</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <label className="block text-sm font-medium text-white/80 mb-2">
                Type de compte
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="glass-input w-full"
                required
              >
                <option value="PATIENT">Patient</option>
                <option value="DOCTOR">Docteur</option>
              </select>
            </motion.div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-white/80 mb-2">Prénom</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Jean"
                    className="glass-input pl-12"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
              >
                <label className="block text-sm font-medium text-white/80 mb-2">Nom</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Dupont"
                    className="glass-input pl-12"
                    required
                  />
                </div>
              </motion.div>
            </div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="votre@email.com"
                  className="glass-input pl-12"
                  required
                />
              </div>
              <p className="text-xs text-white/50 mt-1">Un mot de passe temporaire sera envoyé</p>
            </motion.div>

            {/* Contact Fields */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 }}
              >
                <label className="block text-sm font-medium text-white/80 mb-2">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="06 12 34 56 78"
                    className="glass-input pl-12"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-white/80 mb-2">Ville</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Paris"
                    className="glass-input pl-12"
                  />
                </div>
              </motion.div>
            </div>

            {/* Address */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 }}
            >
              <label className="block text-sm font-medium text-white/80 mb-2">Adresse</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Rue de Paris"
                  className="glass-input pl-12"
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full glass-button-primary flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
            >
              {loading ? (
                <div className="spinner w-5 h-5" />
              ) : (
                <>
                  S'inscrire
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-6"
          >
            <p className="text-white/60 text-sm">
              Déjà inscrit?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                Se connecter
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center text-white/40 text-xs mt-6"
        >
          © 2024 PDS Health. Tous droits réservés.
        </motion.p>
      </motion.div>
    </div>
  )
}

export default Register
