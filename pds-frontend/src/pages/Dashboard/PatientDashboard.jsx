import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar,
  FileText,
  Heart,
  Clock,
  ArrowRight,
  Plus,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import appointmentsAPI from '../../api/appointments.api'
import consultationsAPI from '../../api/consultations.api'
import toast from 'react-hot-toast'

const PatientDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch user's appointments and consultations
        const [appointmentsRes, consultationsRes] = await Promise.all([
          appointmentsAPI.getAppointments(),
          consultationsAPI.getConsultations(),
        ])

        setAppointments(appointmentsRes?.data || [])
        setConsultations(consultationsRes?.data || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast.error('Erreur lors du chargement des données')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get upcoming appointments
  const upcomingAppointments = appointments
    .filter((apt) => new Date(apt.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3)

  // Get recent consultations
  const recentConsultations = consultations
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenue, {user?.firstName}
        </h1>
        <p className="text-gray-600">Gérez vos rendez-vous et consultations</p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <button
          onClick={() => navigate('/appointments/new')}
          className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-3 group"
        >
          <Plus className="w-5 h-5" />
          <span>Prendre un rendez-vous</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={() => navigate('/medical-records')}
          className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center gap-3 group"
        >
          <FileText className="w-5 h-5" />
          <span>Mes dossiers médicaux</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
        </button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Rendez-vous</p>
              <p className="text-3xl font-bold text-gray-900">
                {appointments.length}
              </p>
            </div>
            <Calendar className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Consultations</p>
              <p className="text-3xl font-bold text-gray-900">
                {consultations.length}
              </p>
            </div>
            <Heart className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Rendez-vous à venir</p>
              <p className="text-3xl font-bold text-gray-900">
                {upcomingAppointments.length}
              </p>
            </div>
            <Clock className="w-10 h-10 text-green-500" />
          </div>
        </div>
      </motion.div>

      {/* Upcoming Appointments */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Rendez-vous à venir
        </h2>
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-3">
            {upcomingAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {apt.doctorName || 'Dr. ' + apt.doctor?.firstName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(apt.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {apt.status || 'Confirmé'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Aucun rendez-vous à venir</p>
        )}
        <button
          onClick={() => navigate('/appointments')}
          className="mt-4 text-blue-500 hover:text-blue-700 flex items-center gap-2"
        >
          Voir tous les rendez-vous <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Recent Consultations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Consultations récentes
        </h2>
        {recentConsultations.length > 0 ? (
          <div className="space-y-3">
            {recentConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                onClick={() => navigate(`/consultations/${consultation.id}`)}
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    Consultation du{' '}
                    {new Date(consultation.date).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {consultation.notes?.substring(0, 50)}...
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Aucune consultation enregistrée</p>
        )}
      </motion.div>
    </div>
  )
}

export default PatientDashboard
