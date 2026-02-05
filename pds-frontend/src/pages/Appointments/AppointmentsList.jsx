import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Plus,
  Filter,
  Calendar,
  Clock,
  User,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { appointmentsAPI } from '../../api/appointments.api'
import toast from 'react-hot-toast'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isToday, isSameDay } from 'date-fns'
import { fr } from 'date-fns/locale'

const AppointmentsList = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState('list')

  const { data: appointments = [], isLoading, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentsAPI.getAll,
  })

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return <span className="badge badge-info">Planifie</span>
      case 'COMPLETED':
        return <span className="badge badge-success">Termine</span>
      case 'CANCELLED':
        return <span className="badge badge-danger">Annule</span>
      case 'IN_PROGRESS':
        return <span className="badge badge-warning">En cours</span>
      default:
        return <span className="badge badge-info">{status}</span>
    }
  }

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientId?.toString().includes(searchQuery) ||
      apt.reason?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getAppointmentsForDay = (day) => {
    return filteredAppointments.filter((apt) => {
      if (!apt.appointmentDate) return false
      return isSameDay(new Date(apt.appointmentDate), day)
    })
  }

  // Sample data for demo
  const sampleAppointments = [
    { id: 1, patientName: 'Marie Dupont', time: '09:00', type: 'Consultation', status: 'SCHEDULED', doctor: 'Dr. Martin' },
    { id: 2, patientName: 'Jean Pierre', time: '10:30', type: 'Suivi', status: 'COMPLETED', doctor: 'Dr. Martin' },
    { id: 3, patientName: 'Sophie Bernard', time: '11:00', type: 'Premiere visite', status: 'IN_PROGRESS', doctor: 'Dr. Martin' },
    { id: 4, patientName: 'Lucas Petit', time: '14:00', type: 'Controle', status: 'SCHEDULED', doctor: 'Dr. Martin' },
    { id: 5, patientName: 'Claire Moreau', time: '15:30', type: 'Consultation', status: 'CANCELLED', doctor: 'Dr. Martin' },
    { id: 6, patientName: 'Paul Durand', time: '16:00', type: 'Suivi', status: 'SCHEDULED', doctor: 'Dr. Martin' },
  ]

  const displayAppointments = appointments.length > 0 ? filteredAppointments : sampleAppointments

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Rendez-vous</h1>
          <p className="text-white/60">Gerez vos rendez-vous medicaux</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => refetch()}
            className="glass-button flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
          <Link to="/appointments/new">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouveau RDV
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Calendar Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
            className="p-2 rounded-lg glass hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h3 className="text-lg font-semibold text-white">
            {format(weekStart, 'dd MMM', { locale: fr })} - {format(weekEnd, 'dd MMM yyyy', { locale: fr })}
          </h3>
          <button
            onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
            className="p-2 rounded-lg glass hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const dayAppointments = getAppointmentsForDay(day)
            const isSelected = isSameDay(day, selectedDate)
            const today = isToday(day)

            return (
              <motion.button
                key={day.toISOString()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedDate(day)}
                className={`p-4 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg'
                    : today
                    ? 'glass-light'
                    : 'glass hover:bg-white/20'
                }`}
              >
                <p className={`text-xs font-medium ${isSelected ? 'text-white/80' : 'text-white/50'}`}>
                  {format(day, 'EEE', { locale: fr })}
                </p>
                <p className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-white/80'}`}>
                  {format(day, 'd')}
                </p>
                {dayAppointments.length > 0 && (
                  <div className="flex justify-center gap-1 mt-2">
                    {dayAppointments.slice(0, 3).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? 'bg-white/80' : 'bg-blue-400'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            placeholder="Rechercher un patient ou motif..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input pl-12"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-white/50" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="glass-input w-40"
          >
            <option value="all">Tous les statuts</option>
            <option value="SCHEDULED">Planifie</option>
            <option value="COMPLETED">Termine</option>
            <option value="CANCELLED">Annule</option>
            <option value="IN_PROGRESS">En cours</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            {format(selectedDate, 'EEEE dd MMMM', { locale: fr })}
          </h3>

          <div className="space-y-3">
            {displayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/60">Aucun rendez-vous pour ce jour</p>
              </div>
            ) : (
              displayAppointments.map((apt, index) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="text-center min-w-[60px]">
                    <p className="text-lg font-bold text-white">{apt.time || '09:00'}</p>
                    <p className="text-xs text-white/50">{apt.durationMinutes || 30} min</p>
                  </div>
                  <div className="w-1 h-12 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
                  <div className="flex-1">
                    <p className="font-semibold text-white">{apt.patientName || `Patient #${apt.patientId}`}</p>
                    <p className="text-sm text-white/60">{apt.type || apt.reason || 'Consultation'}</p>
                  </div>
                  {getStatusBadge(apt.status)}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(`/appointments/${apt.id}/edit`)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <Edit className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Quick Stats & Actions */}
        <div className="space-y-6">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="glass-card text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-white">{displayAppointments.filter(a => a.status === 'SCHEDULED').length}</p>
              <p className="text-sm text-white/60">Planifies</p>
            </div>
            <div className="glass-card text-center">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-white">{displayAppointments.filter(a => a.status === 'COMPLETED').length}</p>
              <p className="text-sm text-white/60">Termines</p>
            </div>
            <div className="glass-card text-center">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-white">{displayAppointments.filter(a => a.status === 'IN_PROGRESS').length}</p>
              <p className="text-sm text-white/60">En cours</p>
            </div>
            <div className="glass-card text-center">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mx-auto mb-3">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-2xl font-bold text-white">{displayAppointments.filter(a => a.status === 'CANCELLED').length}</p>
              <p className="text-sm text-white/60">Annules</p>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Actions Rapides</h3>
            <div className="space-y-3">
              <Link to="/appointments/new" className="block">
                <button className="w-full glass-button-primary flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nouveau Rendez-vous
                </button>
              </Link>
              <button className="w-full glass-button flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Voir le Planning Complet
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentsList
