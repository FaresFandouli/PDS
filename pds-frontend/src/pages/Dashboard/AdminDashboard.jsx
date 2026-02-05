import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users,
  BarChart3,
  Activity,
  TrendingUp,
  Settings,
  ArrowRight,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import patientsAPI from '../../api/patients.api'
import appointmentsAPI from '../../api/appointments.api'
import consultationsAPI from '../../api/consultations.api'
import toast from 'react-hot-toast'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const AdminDashboard = () => {
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

  // Calculate statistics
  const stats = [
    {
      label: 'Total Patients',
      value: patients.length,
      icon: Users,
      color: 'blue',
      trend: '+5%',
    },
    {
      label: 'RDV ce mois',
      value: appointments.length,
      icon: Activity,
      color: 'red',
      trend: '+12%',
    },
    {
      label: 'Consultations',
      value: consultations.length,
      icon: BarChart3,
      color: 'purple',
      trend: '+8%',
    },
    {
      label: 'Taux d\'utilisation',
      value: '87%',
      icon: TrendingUp,
      color: 'green',
      trend: '+3%',
    },
  ]

  // Sample data for charts
  const appointmentsTrendData = [
    { name: 'Jan', appointments: 40, consultations: 24 },
    { name: 'Feb', appointments: 45, consultations: 30 },
    { name: 'Mar', appointments: 50, consultations: 35 },
    { name: 'Apr', appointments: 55, consultations: 40 },
    { name: 'May', appointments: 60, consultations: 45 },
    { name: 'Jun', appointments: 65, consultations: 50 },
  ]

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
          Tableau de bord Administrateur
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble et gestion globale du système
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const bgColor = {
            blue: 'bg-blue-500',
            red: 'bg-red-500',
            purple: 'bg-purple-500',
            green: 'bg-green-500',
          }[stat.color]

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-green-600 mt-2">{stat.trend}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Appointments Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Tendance des rendez-vous
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={appointmentsTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="appointments"
                stroke="#3b82f6"
                name="RDV"
              />
              <Line
                type="monotone"
                dataKey="consultations"
                stroke="#8b5cf6"
                name="Consultations"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Distribution par mois
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appointmentsTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="appointments" fill="#3b82f6" name="RDV" />
              <Bar dataKey="consultations" fill="#8b5cf6" name="Consultations" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <button className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-3 group">
          <Users className="w-5 h-5" />
          <span>Gérer les utilisateurs</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
        </button>

        <button className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center gap-3 group">
          <Settings className="w-5 h-5" />
          <span>Paramètres système</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
        </button>

        <button className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-3 group">
          <BarChart3 className="w-5 h-5" />
          <span>Rapports détaillés</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
        </button>
      </motion.div>

      {/* System Health */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">État du système</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">API Gateway</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              Opérationnel
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Base de données</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              Opérationnel
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Service de cache</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              Opérationnel
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminDashboard
