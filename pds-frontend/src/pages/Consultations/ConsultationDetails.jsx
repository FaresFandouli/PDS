import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Edit,
  Stethoscope,
  Calendar,
  Clock,
  User,
  FileText,
  Activity,
  AlertCircle,
  Pill,
  ClipboardList,
} from 'lucide-react'
import { consultationsAPI } from '../../api/consultations.api'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const ConsultationDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: consultation, isLoading } = useQuery({
    queryKey: ['consultation', id],
    queryFn: () => consultationsAPI.getById(id),
  })

  // Sample data for demo
  const sampleConsultation = {
    id: 1,
    patientId: 1,
    patientName: 'Marie Dupont',
    doctorId: 1,
    doctor: 'Dr. Sarah Martin',
    consultationDate: '2024-02-04T09:00:00',
    reason: 'Douleurs abdominales persistantes',
    diagnosis: 'Gastrite - Inflammation de la muqueuse gastrique',
    prescription: 'Omeprazole 20mg - 1 comprimer par jour pendant 4 semaines',
    notes: 'Patiente presentant des douleurs epigastriques depuis 2 semaines. Recommandation: regime alimentaire adapte, eviter les aliments acides et epices. Controle dans 4 semaines.',
    status: 'COMPLETED',
    symptoms: 'Douleurs epigastriques, brulures d\'estomac, nausees occasionnelles',
    vitalSigns: {
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 36.8,
      weight: 65,
    },
  }

  const displayConsultation = consultation || sampleConsultation

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

  if (isLoading) {
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
          onClick={() => navigate('/consultations')}
          className="p-3 rounded-xl glass hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Details de la Consultation</h1>
          <p className="text-white/60">Consultation #{displayConsultation.id}</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Modifier
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Consultation Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    {displayConsultation.patientName || `Patient #${displayConsultation.patientId}`}
                  </h2>
                  {getStatusBadge(displayConsultation.status)}
                </div>
                <p className="text-white/60 mt-1">{displayConsultation.reason}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/50">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {displayConsultation.consultationDate
                      ? format(new Date(displayConsultation.consultationDate), 'EEEE dd MMMM yyyy', { locale: fr })
                      : 'Date non definie'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {displayConsultation.consultationDate
                      ? format(new Date(displayConsultation.consultationDate), 'HH:mm', { locale: fr })
                      : '--:--'}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {displayConsultation.doctor || 'Dr. Martin'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Symptoms */}
          {displayConsultation.symptoms && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-400" />
                Symptomes
              </h3>
              <p className="text-white/80 leading-relaxed">{displayConsultation.symptoms}</p>
            </motion.div>
          )}

          {/* Diagnosis */}
          {displayConsultation.diagnosis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Diagnostic
              </h3>
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-400/20">
                <p className="text-white font-medium">{displayConsultation.diagnosis}</p>
              </div>
            </motion.div>
          )}

          {/* Prescription */}
          {displayConsultation.prescription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Pill className="w-5 h-5 text-green-400" />
                Prescription
              </h3>
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-400/20">
                <p className="text-white">{displayConsultation.prescription}</p>
              </div>
            </motion.div>
          )}

          {/* Notes */}
          {displayConsultation.notes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-purple-400" />
                Notes et Recommandations
              </h3>
              <p className="text-white/80 leading-relaxed">{displayConsultation.notes}</p>
            </motion.div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Vital Signs */}
          {displayConsultation.vitalSigns && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-400" />
                Signes Vitaux
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-white/60">Tension</span>
                  <span className="text-white font-semibold">
                    {displayConsultation.vitalSigns.bloodPressure} mmHg
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-white/60">Frequence Cardiaque</span>
                  <span className="text-white font-semibold">
                    {displayConsultation.vitalSigns.heartRate} bpm
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-white/60">Temperature</span>
                  <span className="text-white font-semibold">
                    {displayConsultation.vitalSigns.temperature}°C
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-white/60">Poids</span>
                  <span className="text-white font-semibold">
                    {displayConsultation.vitalSigns.weight} kg
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Patient Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Patient</h3>
            <Link to={`/patients/${displayConsultation.patientId}`}>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {displayConsultation.patientName?.charAt(0) || 'P'}
                </div>
                <div>
                  <p className="font-medium text-white">
                    {displayConsultation.patientName || `Patient #${displayConsultation.patientId}`}
                  </p>
                  <p className="text-sm text-white/50">Voir le dossier patient</p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
            <div className="space-y-3">
              <button className="w-full glass-button flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Imprimer
              </button>
              <button className="w-full glass-button flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Planifier un suivi
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ConsultationDetails
