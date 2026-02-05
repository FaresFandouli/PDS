import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import authAPI from '../../api/auth.api'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading') // loading, success, error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token')

      if (!token) {
        setStatus('error')
        setMessage('Token de vérification manquant')
        return
      }

      try {
        await authAPI.verifyEmail({ token })
        setStatus('success')
        setMessage('Votre email a été vérifié avec succès!')
        toast.success('Email vérifié!')

        // Rediriger vers le login après 3 secondes
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } catch (error) {
        setStatus('error')
        setMessage(
          error.response?.data?.message ||
          'Erreur lors de la vérification de l\'email'
        )
        toast.error('Vérification échouée')
      }
    }

    verifyEmail()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 via-purple-900 to-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        {status === 'loading' && (
          <>
            <Loader className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-white mb-2">Vérification en cours...</h1>
            <p className="text-white/60">Veuillez patienter</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Email vérifié!</h1>
            <p className="text-white/60 mb-6">{message}</p>
            <p className="text-sm text-white/40">Redirection vers la connexion...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Erreur de vérification</h1>
            <p className="text-white/60 mb-6">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Retour à la connexion
            </button>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default VerifyEmail
