import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users,
  Calendar,
  ClipboardList,
  FileText,
  ArrowRight,
  Plus,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import patientsAPI from '../../api/patients.api'
import appointmentsAPI from '../../api/appointments.api'
import consultationsAPI from '../../api/consultations.api'
import toast from 'react-hot-toast'

const DoctorDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [patientsRes, appointmentsRes, consultationsRes] =
          await Promise.all([
            patientsAPI.getPatients(),
            appointmentsAPI.getAppointments(),
            consultationsAPI.getConsultations(),
          ])

        setPatients(patientsRes?.data || [])
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

  // Get today's appointments
  const today = new Date().toDateString()
  const todaysAppointments = appointments.filter(
    (apt) => new Date(apt.date).toDateString() === today
  )

  // Get recent consultations
  const recentConsultations = consultations
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

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
          Bienvenue, Dr. {user?.lastName}
        </h1>
        <p className="text-gray-600">Gérez vos patients et consultations</p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <button
          onClick={() => navigate('/patients/new')}
          className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-3 group"
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau patient</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={() => navigate('/consultations')}
          className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center gap-3 group"
        >
          <ClipboardList className="w-5 h-5" />
          <span>Créer consultation</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={() => navigate('/patients')}
          className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-3 group"
        >
          <Users className="w-5 h-5" />
          <span>Mes patients</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
        </button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Patients</p>
              <p className="text-3xl font-bold text-gray-900">
                {patients.length}
              </p>
            </div>
            <Users className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">RDV aujourd'hui</p>
              <p className="text-3xl font-bold text-gray-900">
                {todaysAppointments.length}
              </p>
            </div>
            <Calendar className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total RDV</p>
              <p className="text-3xl font-bold text-gray-900">
                {appointments.length}
              </p>
            </div>
            <FileText className="w-10 h-10 text-green-500" />
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
            <ClipboardList className="w-10 h-10 text-purple-500" />
          </div>
        </div>
      </motion.div>

      {/* Today's Appointments */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Rendez-vous d'aujourd'hui
        </h2>
        {todaysAppointments.length > 0 ? (
          <div className="space-y-3">
            {todaysAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                onClick={() => navigate(`/patients/${apt.patientId}`)}
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {apt.patient?.firstName} {apt.patient?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(apt.date).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {apt.status || 'Confirmé'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Aucun rendez-vous aujourd'hui</p>
        )}
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
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                onClick={() => navigate(`/consultations/${consultation.id}`)}
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {consultation.patient?.firstName}{' '}
                    {consultation.patient?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(consultation.date).toLocaleDateString('fr-FR')}
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

export default DoctorDashboard
