import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Edit,
  FileText,
  Calendar,
  User,
  Activity,
  Heart,
  Thermometer,
  Scale,
  Ruler,
  Pill,
  AlertCircle,
  Download,
  Printer,
} from 'lucide-react'
import { medicalRecordsAPI } from '../../api/medicalRecords.api'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const MedicalRecordDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: record, isLoading } = useQuery({
    queryKey: ['medical-record', id],
    queryFn: () => medicalRecordsAPI.getById(id),
  })

  // Sample data for demo
  const sampleRecord = {
    id: 1,
    patientId: 1,
    patientName: 'Marie Dupont',
    doctorId: 1,
    doctor: 'Dr. Sarah Martin',
    diagnosis: 'Hypertension arterielle de stade 1 - bien controlee sous traitement',
    symptoms: 'Cephalees occasionnelles en fin de journee, sensation de vertiges lors de changements de position rapides, fatigue legere',
    treatment: 'Amlodipine 5mg - 1 comprime le matin\nRegime hyposode recommande\nActivite physique moderee 30 min/jour',
    prescription: 'Amlodipine 5mg x 30 comprimes\nRenouvellement dans 3 mois',
    notes: 'Patiente compliante au traitement. Tension bien equilibree sous Amlodipine. Continuer le suivi regulier. Prochain controle dans 3 mois avec bilan sanguin.',
    bloodPressure: '135/85',
    heartRate: 76,
    temperature: 36.7,
    weight: 68,
    height: 165,
    recordDate: '2024-02-01',
    createdAt: '2024-02-01T10:30:00',
    updatedAt: '2024-02-01T10:30:00',
  }

  const displayRecord = record || sampleRecord

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return null
    const heightInMeters = height / 100
    return (weight / (heightInMeters * heightInMeters)).toFixed(1)
  }

  const bmi = calculateBMI(displayRecord.weight, displayRecord.height)

  const getBMICategory = (bmi) => {
    if (!bmi) return null
    const value = parseFloat(bmi)
    if (value < 18.5) return { label: 'Insuffisance ponderale', color: 'text-blue-400' }
    if (value < 25) return { label: 'Poids normal', color: 'text-green-400' }
    if (value < 30) return { label: 'Surpoids', color: 'text-yellow-400' }
    return { label: 'Obesite', color: 'text-red-400' }
  }

  const bmiCategory = getBMICategory(bmi)

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
          onClick={() => navigate('/medical-records')}
          className="p-3 rounded-xl glass hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Dossier Medical</h1>
          <p className="text-white/60">Dossier #{displayRecord.id}</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimer
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exporter PDF
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button-primary flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Modifier
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Record Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">
                  {displayRecord.patientName || `Patient #${displayRecord.patientId}`}
                </h2>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-white/50">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {displayRecord.recordDate
                      ? format(new Date(displayRecord.recordDate), 'EEEE dd MMMM yyyy', { locale: fr })
                      : 'Date non definie'}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {displayRecord.doctor || 'Dr. Martin'}
                  </span>
                </div>
              </div>
              <span className="badge badge-info">Dossier #{displayRecord.id}</span>
            </div>
          </motion.div>

          {/* Diagnosis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Diagnostic
            </h3>
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-400/20">
              <p className="text-white leading-relaxed">{displayRecord.diagnosis || 'Aucun diagnostic'}</p>
            </div>
          </motion.div>

          {/* Symptoms */}
          {displayRecord.symptoms && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-400" />
                Symptomes
              </h3>
              <p className="text-white/80 leading-relaxed">{displayRecord.symptoms}</p>
            </motion.div>
          )}

          {/* Treatment */}
          {displayRecord.treatment && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Pill className="w-5 h-5 text-green-400" />
                Traitement
              </h3>
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-400/20">
                <p className="text-white whitespace-pre-line">{displayRecord.treatment}</p>
              </div>
            </motion.div>
          )}

          {/* Prescription */}
          {displayRecord.prescription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Ordonnance
              </h3>
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-400/20">
                <p className="text-white whitespace-pre-line">{displayRecord.prescription}</p>
              </div>
            </motion.div>
          )}

          {/* Notes */}
          {displayRecord.notes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Notes Medicales</h3>
              <p className="text-white/80 leading-relaxed">{displayRecord.notes}</p>
            </motion.div>
          )}
        </div>

        {/* Right Column - Vital Signs */}
        <div className="space-y-6">
          {/* Vital Signs Card */}
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
              {/* Blood Pressure */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/50">Tension Arterielle</p>
                  <p className="text-white font-semibold">{displayRecord.bloodPressure || 'N/A'} mmHg</p>
                </div>
              </div>

              {/* Heart Rate */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/50">Frequence Cardiaque</p>
                  <p className="text-white font-semibold">{displayRecord.heartRate || 'N/A'} bpm</p>
                </div>
              </div>

              {/* Temperature */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Thermometer className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/50">Temperature</p>
                  <p className="text-white font-semibold">{displayRecord.temperature || 'N/A'}°C</p>
                </div>
              </div>

              {/* Weight */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/50">Poids</p>
                  <p className="text-white font-semibold">{displayRecord.weight || 'N/A'} kg</p>
                </div>
              </div>

              {/* Height */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Ruler className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/50">Taille</p>
                  <p className="text-white font-semibold">{displayRecord.height || 'N/A'} cm</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* BMI Card */}
          {bmi && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Indice de Masse Corporelle</h3>
              <div className="text-center py-4">
                <p className="text-4xl font-bold text-white mb-2">{bmi}</p>
                {bmiCategory && (
                  <p className={`text-sm font-medium ${bmiCategory.color}`}>
                    {bmiCategory.label}
                  </p>
                )}
              </div>
              <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500"
                  style={{ width: `${Math.min(parseFloat(bmi) * 2.5, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/50 mt-2">
                <span>16</span>
                <span>25</span>
                <span>40</span>
              </div>
            </motion.div>
          )}

          {/* Patient Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Patient</h3>
            <Link to={`/patients/${displayRecord.patientId}`}>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {displayRecord.patientName?.charAt(0) || 'P'}
                </div>
                <div>
                  <p className="font-medium text-white">
                    {displayRecord.patientName || `Patient #${displayRecord.patientId}`}
                  </p>
                  <p className="text-sm text-white/50">Voir le profil complet</p>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default MedicalRecordDetails
