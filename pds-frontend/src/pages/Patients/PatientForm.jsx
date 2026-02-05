import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  AlertCircle,
  Loader,
} from 'lucide-react'
import { patientsAPI } from '../../api/patients.api'
import toast from 'react-hot-toast'

const PatientForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = !!id

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    bloodType: '',
    emergencyContact: '',
    emergencyPhone: '',
  })

  const [errors, setErrors] = useState({})

  const { data: patient, isLoading: loadingPatient } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientsAPI.getById(id),
    enabled: isEditing,
  })

  useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient.firstName || '',
        lastName: patient.lastName || '',
        email: patient.email || '',
        phone: patient.phone || '',
        dateOfBirth: patient.dateOfBirth || '',
        gender: patient.gender || '',
        address: patient.address || '',
        bloodType: patient.bloodType || '',
        emergencyContact: patient.emergencyContact || '',
        emergencyPhone: patient.emergencyPhone || '',
      })
    }
  }, [patient])

  const createMutation = useMutation({
    mutationFn: patientsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['patients'])
      toast.success('Patient cree avec succes')
      navigate('/patients')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la creation')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data) => patientsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['patients'])
      queryClient.invalidateQueries(['patient', id])
      toast.success('Patient mis a jour avec succes')
      navigate(`/patients/${id}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise a jour')
    },
  })

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prenom est requis'
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis'
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }
    if (!formData.gender) {
      newErrors.gender = 'Le genre est requis'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs')
      return
    }

    const dataToSubmit = {
      ...formData,
      dateOfBirth: formData.dateOfBirth || null,
    }

    if (isEditing) {
      updateMutation.mutate(dataToSubmit)
    } else {
      createMutation.mutate(dataToSubmit)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  if (isEditing && loadingPatient) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="spinner" />
      </div>
    )
  }

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="p-3 rounded-xl glass hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isEditing ? 'Modifier le Patient' : 'Nouveau Patient'}
          </h1>
          <p className="text-white/60">
            {isEditing ? 'Modifiez les informations du patient' : 'Remplissez les informations du patient'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
        >
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            Informations Personnelles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Prenom <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`glass-input ${errors.firstName ? 'border-red-400' : ''}`}
                placeholder="Entrez le prenom"
              />
              {errors.firstName && (
                <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Nom <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`glass-input ${errors.lastName ? 'border-red-400' : ''}`}
                placeholder="Entrez le nom"
              />
              {errors.lastName && (
                <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Date de Naissance
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="glass-input pl-12"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Genre <span className="text-red-400">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`glass-input ${errors.gender ? 'border-red-400' : ''}`}
              >
                <option value="">Selectionnez</option>
                <option value="Male">Homme</option>
                <option value="Female">Femme</option>
              </select>
              {errors.gender && (
                <p className="text-red-400 text-sm mt-1">{errors.gender}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card"
        >
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-400" />
            Coordonnees
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`glass-input pl-12 ${errors.email ? 'border-red-400' : ''}`}
                  placeholder="email@exemple.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Telephone
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="glass-input pl-12"
                  placeholder="+212 6XX XXX XXX"
                />
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Adresse
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-white/50" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  className="glass-input pl-12 resize-none"
                  placeholder="Adresse complete"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Medical Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card"
        >
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" />
            Informations Medicales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blood Type */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Groupe Sanguin
              </label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                className="glass-input"
              >
                <option value="">Selectionnez</option>
                {bloodTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
        >
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-400" />
            Contact d'Urgence
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emergency Contact Name */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Nom du Contact
              </label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                className="glass-input"
                placeholder="Nom complet"
              />
            </div>

            {/* Emergency Phone */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Telephone d'Urgence
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  className="glass-input pl-12"
                  placeholder="+212 6XX XXX XXX"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-end gap-4"
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="glass-button"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="glass-button-primary flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                {isEditing ? 'Mise a jour...' : 'Creation...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEditing ? 'Mettre a jour' : 'Creer le patient'}
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  )
}

export default PatientForm
