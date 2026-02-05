import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Plus,
  Filter,
  Stethoscope,
  Eye,
  Edit,
  Clock,
  User,
  RefreshCw,
  Calendar,
  FileText,
  Activity,
} from 'lucide-react'
import { consultationsAPI } from '../../api/consultations.api'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const ConsultationsList = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const { data: consultations = [], isLoading, refetch } = useQuery({
    queryKey: ['consultations'],
    queryFn: consultationsAPI.getAll,
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return <span className="badge badge-info">Planifiee</span>
      case 'IN_PROGRESS':
        return <span className="badge badge-warning">En cours</span>
      case 'COMPLETED':
        return <span className="badge badge-success">Terminee</span>
      case 'CANCELLED':
        return <span className="badge badge-danger">Annulee</span>
      default:
        return <span className="badge badge-info">{status}</span>
    }
  }

  const filteredConsultations = consultations.filter((consultation) => {
    const matchesSearch =
      consultation.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || consultation.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Sample data for demo
  const sampleConsultations = [
    { id: 1, patientName: 'Marie Dupont', reason: 'Douleurs abdominales', diagnosis: 'Gastrite', status: 'COMPLETED', consultationDate: '2024-02-04T09:00:00', doctor: 'Dr. Martin' },
    { id: 2, patientName: 'Jean Pierre', reason: 'Controle annuel', diagnosis: 'En bonne sante', status: 'COMPLETED', consultationDate: '2024-02-04T10:30:00', doctor: 'Dr. Martin' },
    { id: 3, patientName: 'Sophie Bernard', reason: 'Maux de tete frequents', diagnosis: 'En cours d\'evaluation', status: 'IN_PROGRESS', consultationDate: '2024-02-04T11:00:00', doctor: 'Dr. Martin' },
    { id: 4, patientName: 'Lucas Petit', reason: 'Suivi diabete', diagnosis: null, status: 'SCHEDULED', consultationDate: '2024-02-05T14:00:00', doctor: 'Dr. Martin' },
    { id: 5, patientName: 'Claire Moreau', reason: 'Vaccination', diagnosis: null, status: 'SCHEDULED', consultationDate: '2024-02-05T15:30:00', doctor: 'Dr. Martin' },
  ]

  const displayConsultations = consultations.length > 0 ? filteredConsultations : sampleConsultations

  // Stats
  const stats = {
    total: displayConsultations.length,
    scheduled: displayConsultations.filter(c => c.status === 'SCHEDULED').length,
    inProgress: displayConsultations.filter(c => c.status === 'IN_PROGRESS').length,
    completed: displayConsultations.filter(c => c.status === 'COMPLETED').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Consultations</h1>
          <p className="text-white/60">{stats.total} consultations au total</p>
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouvelle Consultation
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
            <Stethoscope className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-sm text-white/60">Total</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.scheduled}</p>
          <p className="text-sm text-white/60">Planifiees</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
            <Activity className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
          <p className="text-sm text-white/60">En cours</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.completed}</p>
          <p className="text-sm text-white/60">Terminees</p>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Rechercher par motif ou diagnostic..."
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
              <option value="SCHEDULED">Planifiee</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="COMPLETED">Terminee</option>
              <option value="CANCELLED">Annulee</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Consultations List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : displayConsultations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card text-center py-12"
        >
          <Stethoscope className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Aucune consultation trouvee</h3>
          <p className="text-white/60">
            {searchQuery ? 'Aucun resultat pour votre recherche' : 'Commencez par creer une consultation'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {displayConsultations.map((consultation, index) => (
              <motion.div
                key={consultation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card hover:bg-white/10 transition-all cursor-pointer group"
                onClick={() => navigate(`/consultations/${consultation.id}`)}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="w-7 h-7 text-white" />
                  </div>

                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {consultation.patientName || `Patient #${consultation.patientId}`}
                        </h3>
                        <p className="text-white/60">{consultation.reason || 'Consultation'}</p>
                      </div>
                      {getStatusBadge(consultation.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {consultation.consultationDate
                          ? format(new Date(consultation.consultationDate), 'dd MMM yyyy', { locale: fr })
                          : 'Date non definie'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {consultation.consultationDate
                          ? format(new Date(consultation.consultationDate), 'HH:mm', { locale: fr })
                          : '--:--'}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {consultation.doctor || 'Dr. Martin'}
                      </span>
                    </div>

                    {consultation.diagnosis && (
                      <div className="mt-3 p-3 rounded-lg bg-white/5">
                        <p className="text-sm text-white/70">
                          <span className="text-white/50">Diagnostic:</span> {consultation.diagnosis}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/consultations/${consultation.id}`)
                      }}
                      className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default ConsultationsList
