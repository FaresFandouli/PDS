import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Plus,
  Filter,
  FileText,
  Eye,
  Download,
  Calendar,
  User,
  RefreshCw,
  Activity,
  Heart,
  Thermometer,
} from 'lucide-react'
import { medicalRecordsAPI } from '../../api/medicalRecords.api'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const MedicalRecordsList = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const { data: records = [], isLoading, refetch } = useQuery({
    queryKey: ['medical-records'],
    queryFn: medicalRecordsAPI.getAll,
  })

  const filteredRecords = records.filter((record) => {
    return (
      record.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.symptoms?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Sample data for demo
  const sampleRecords = [
    {
      id: 1,
      patientId: 1,
      patientName: 'Marie Dupont',
      doctorId: 1,
      diagnosis: 'Hypertension arterielle controlee',
      symptoms: 'Cephalees, vertiges occasionnels',
      treatment: 'Amlodipine 5mg',
      bloodPressure: '140/90',
      heartRate: 78,
      temperature: 36.7,
      weight: 68,
      height: 165,
      recordDate: '2024-02-01',
    },
    {
      id: 2,
      patientId: 2,
      patientName: 'Jean Pierre',
      doctorId: 1,
      diagnosis: 'Diabete type 2 stable',
      symptoms: 'Fatigue, soif excessive',
      treatment: 'Metformine 850mg',
      bloodPressure: '125/80',
      heartRate: 72,
      temperature: 36.5,
      weight: 85,
      height: 178,
      recordDate: '2024-01-28',
    },
    {
      id: 3,
      patientId: 3,
      patientName: 'Sophie Bernard',
      doctorId: 1,
      diagnosis: 'Migraine chronique',
      symptoms: 'Cephalees unilaterales, photophobie',
      treatment: 'Sumatriptan 50mg en cas de crise',
      bloodPressure: '115/75',
      heartRate: 68,
      temperature: 36.8,
      weight: 58,
      height: 162,
      recordDate: '2024-01-25',
    },
    {
      id: 4,
      patientId: 4,
      patientName: 'Lucas Petit',
      doctorId: 1,
      diagnosis: 'Asthme leger',
      symptoms: 'Toux nocturne, dyspnee a l\'effort',
      treatment: 'Ventoline en cas de crise',
      bloodPressure: '120/78',
      heartRate: 75,
      temperature: 36.6,
      weight: 72,
      height: 175,
      recordDate: '2024-01-20',
    },
  ]

  const displayRecords = records.length > 0 ? filteredRecords : sampleRecords

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dossiers Medicaux</h1>
          <p className="text-white/60">{displayRecords.length} dossiers enregistres</p>
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
            className="glass-button flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exporter
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouveau Dossier
          </motion.button>
        </div>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            placeholder="Rechercher par diagnostic ou symptomes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input pl-12"
          />
        </div>
      </motion.div>

      {/* Records Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : displayRecords.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card text-center py-12"
        >
          <FileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Aucun dossier trouve</h3>
          <p className="text-white/60">
            {searchQuery ? 'Aucun resultat pour votre recherche' : 'Commencez par creer un dossier medical'}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {displayRecords.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card hover:bg-white/10 transition-all cursor-pointer group"
                onClick={() => navigate(`/medical-records/${record.id}`)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {record.patientName || `Patient #${record.patientId}`}
                      </h3>
                      <p className="text-sm text-white/50 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {record.recordDate
                          ? format(new Date(record.recordDate), 'dd MMM yyyy', { locale: fr })
                          : 'Date non definie'}
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-info">Dossier #{record.id}</span>
                </div>

                {/* Diagnosis */}
                <div className="mb-4">
                  <p className="text-sm text-white/50 mb-1">Diagnostic</p>
                  <p className="text-white font-medium">{record.diagnosis || 'Non defini'}</p>
                </div>

                {/* Vital Signs */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <Heart className="w-4 h-4 text-red-400 mx-auto mb-1" />
                    <p className="text-xs text-white/50">Tension</p>
                    <p className="text-sm text-white font-medium">{record.bloodPressure || 'N/A'}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <Activity className="w-4 h-4 text-green-400 mx-auto mb-1" />
                    <p className="text-xs text-white/50">Pouls</p>
                    <p className="text-sm text-white font-medium">{record.heartRate || 'N/A'} bpm</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <Thermometer className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                    <p className="text-xs text-white/50">Temp.</p>
                    <p className="text-sm text-white font-medium">{record.temperature || 'N/A'}°C</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <User className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <p className="text-xs text-white/50">Poids</p>
                    <p className="text-sm text-white font-medium">{record.weight || 'N/A'} kg</p>
                  </div>
                </div>

                {/* Symptoms Preview */}
                {record.symptoms && (
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-white/50 mb-1">Symptomes</p>
                    <p className="text-sm text-white/80 line-clamp-2">{record.symptoms}</p>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/medical-records/${record.id}`)
                    }}
                    className="glass-button text-sm flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Voir Details
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default MedicalRecordsList
