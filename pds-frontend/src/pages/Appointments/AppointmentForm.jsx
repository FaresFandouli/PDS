import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  User,
  FileText,
  Loader,
} from 'lucide-react'
import { appointmentsAPI } from '../../api/appointments.api'
import { patientsAPI } from '../../api/patients.api'
import toast from 'react-hot-toast'

const AppointmentForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = !!id

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '1',
    appointmentDate: '',
    appointmentTime: '',
    durationMinutes: 30,
    reason: '',
    notes: '',
    status: 'SCHEDULED',
  })

  const [errors, setErrors] = useState({})

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: patientsAPI.getAll,
  })

  const { data: appointment, isLoading: loadingAppointment } = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentsAPI.getById(id),
    enabled: isEditing,
  })

  useEffect(() => {
    if (appointment) {
      const appointmentDateTime = new Date(appointment.appointmentDate)
      setFormData({
        patientId: appointment.patientId?.toString() || '',
        doctorId: appointment.doctorId?.toString() || '1',
        appointmentDate: appointmentDateTime.toISOString().split('T')[0],
        appointmentTime: appointmentDateTime.toTimeString().slice(0, 5),
        durationMinutes: appointment.durationMinutes || 30,
        reason: appointment.reason || '',
        notes: appointment.notes || '',
        status: appointment.status || 'SCHEDULED',
      })
    }
  }, [appointment])

  const createMutation = useMutation({
    mutationFn: appointmentsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments'])
      toast.success('Rendez-vous cree avec succes')
      navigate('/appointments')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la creation')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data) => appointmentsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments'])
      toast.success('Rendez-vous mis a jour avec succes')
      navigate('/appointments')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise a jour')
    },
  })

  const validateForm = () => {
    const newErrors = {}

    if (!formData.patientId) {
      newErrors.patientId = 'Veuillez selectionner un patient'
    }
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'La date est requise'
    }
    if (!formData.appointmentTime) {
      newErrors.appointmentTime = "L'heure est requise"
    }
    if (!formData.reason.trim()) {
      newErrors.reason = 'Le motif est requis'
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

    const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`)

    const dataToSubmit = {
      patientId: parseInt(formData.patientId),
      doctorId: parseInt(formData.doctorId),
      appointmentDate: appointmentDateTime.toISOString(),
      durationMinutes: parseInt(formData.durationMinutes),
      reason: formData.reason,
      notes: formData.notes,
      status: formData.status,
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

  if (isEditing && loadingAppointment) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="spinner" />
      </div>
    )
  }

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
            {isEditing ? 'Modifier le Rendez-vous' : 'Nouveau Rendez-vous'}
          </h1>
          <p className="text-white/60">
            {isEditing ? 'Modifiez les details du rendez-vous' : 'Planifiez un nouveau rendez-vous'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
        >
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            Selection du Patient
          </h3>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Patient <span className="text-red-400">*</span>
            </label>
            <select
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              className={`glass-input ${errors.patientId ? 'border-red-400' : ''}`}
            >
              <option value="">Selectionnez un patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>
            {errors.patientId && (
              <p className="text-red-400 text-sm mt-1">{errors.patientId}</p>
            )}
          </div>
        </motion.div>

        {/* Date & Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card"
        >
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-400" />
            Date et Heure
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Date <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  className={`glass-input pl-12 ${errors.appointmentDate ? 'border-red-400' : ''}`}
                />
              </div>
              {errors.appointmentDate && (
                <p className="text-red-400 text-sm mt-1">{errors.appointmentDate}</p>
              )}
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Heure <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  className={`glass-input pl-12 ${errors.appointmentTime ? 'border-red-400' : ''}`}
                />
              </div>
              {errors.appointmentTime && (
                <p className="text-red-400 text-sm mt-1">{errors.appointmentTime}</p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Duree (minutes)
              </label>
              <select
                name="durationMinutes"
                value={formData.durationMinutes}
                onChange={handleChange}
                className="glass-input"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 heure</option>
                <option value={90}>1h30</option>
                <option value={120}>2 heures</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card"
        >
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            Details du Rendez-vous
          </h3>

          <div className="space-y-6">
            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Motif <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className={`glass-input ${errors.reason ? 'border-red-400' : ''}`}
                placeholder="Ex: Consultation generale, Suivi, Controle..."
              />
              {errors.reason && (
                <p className="text-red-400 text-sm mt-1">{errors.reason}</p>
              )}
            </div>

            {/* Status (only for editing) */}
            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Statut
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="glass-input"
                >
                  <option value="SCHEDULED">Planifie</option>
                  <option value="IN_PROGRESS">En cours</option>
                  <option value="COMPLETED">Termine</option>
                  <option value="CANCELLED">Annule</option>
                </select>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="glass-input resize-none"
                placeholder="Notes supplementaires..."
              />
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
                {isEditing ? 'Mettre a jour' : 'Creer le rendez-vous'}
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  )
}

export default AppointmentForm
