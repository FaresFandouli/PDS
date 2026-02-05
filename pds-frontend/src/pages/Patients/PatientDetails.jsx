import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Heart,
  AlertCircle,
  FileText,
  Stethoscope,
  Clock,
  Activity,
} from 'lucide-react'
import { patientsAPI } from '../../api/patients.api'
import { consultationsAPI } from '../../api/consultations.api'
import { medicalRecordsAPI } from '../../api/medicalRecords.api'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const PatientDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('info')

  const { data: patient, isLoading } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientsAPI.getById(id),
  })

  const { data: consultations = [] } = useQuery({
    queryKey: ['patient-consultations', id],
    queryFn: () => consultationsAPI.getByPatient(id),
    enabled: !!id,
  })

  const { data: medicalRecords = [] } = useQuery({
    queryKey: ['patient-records', id],
    queryFn: () => medicalRecordsAPI.getByPatient(id),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="spinner" />
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="glass-card text-center py-12">
        <AlertCircle className="w-16 h-16 text-white/30 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Patient non trouve</h3>
        <p className="text-white/60 mb-6">Ce patient n'existe pas ou a ete supprime.</p>
        <Link to="/patients">
          <button className="glass-button-primary">
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Retour a la liste
          </button>
        </Link>
      </div>
    )
  }

  const getInitials = () => {
    return `${patient.firstName?.charAt(0) || ''}${patient.lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A'
    const today = new Date()
    const birth = new Date(dateOfBirth)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return `${age} ans`
  }

  const tabs = [
    { id: 'info', label: 'Informations', icon: User },
    { id: 'consultations', label: 'Consultations', icon: Stethoscope },
    { id: 'records', label: 'Dossier Medical', icon: FileText },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/patients')}
          className="p-3 rounded-xl glass hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Fiche Patient</h1>
          <p className="text-white/60">Details et historique medical</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/patients/${id}/edit`)}
            className="glass-button flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Modifier
          </motion.button>
        </div>
      </div>

      {/* Patient Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar & Basic Info */}
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {getInitials()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {patient.firstName} {patient.lastName}
              </h2>
              <p className="text-white/60">ID: #{patient.id}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`badge ${patient.gender === 'Male' ? 'badge-info' : 'badge-purple'}`}>
                  {patient.gender === 'Male' ? 'Homme' : 'Femme'}
                </span>
                <span className="badge badge-danger">{patient.bloodType || 'N/A'}</span>
                <span className="badge badge-success">{calculateAge(patient.dateOfBirth)}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass rounded-xl p-4 text-center">
              <Stethoscope className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{consultations.length}</p>
              <p className="text-xs text-white/60">Consultations</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <FileText className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{medicalRecords.length}</p>
              <p className="text-xs text-white/60">Dossiers</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <Calendar className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">2</p>
              <p className="text-xs text-white/60">RDV a venir</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <Activity className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">Bon</p>
              <p className="text-xs text-white/60">Etat general</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'glass-light text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                Informations Personnelles
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <Calendar className="w-5 h-5 text-white/50" />
                  <div>
                    <p className="text-xs text-white/50">Date de Naissance</p>
                    <p className="text-white">
                      {patient.dateOfBirth
                        ? format(new Date(patient.dateOfBirth), 'dd MMMM yyyy', { locale: fr })
                        : 'Non renseigne'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <Mail className="w-5 h-5 text-white/50" />
                  <div>
                    <p className="text-xs text-white/50">Email</p>
                    <p className="text-white">{patient.email || 'Non renseigne'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <Phone className="w-5 h-5 text-white/50" />
                  <div>
                    <p className="text-xs text-white/50">Telephone</p>
                    <p className="text-white">{patient.phone || 'Non renseigne'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <MapPin className="w-5 h-5 text-white/50" />
                  <div>
                    <p className="text-xs text-white/50">Adresse</p>
                    <p className="text-white">{patient.address || 'Non renseigne'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                Contact d'Urgence
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <User className="w-5 h-5 text-white/50" />
                  <div>
                    <p className="text-xs text-white/50">Nom</p>
                    <p className="text-white">{patient.emergencyContact || 'Non renseigne'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <Phone className="w-5 h-5 text-white/50" />
                  <div>
                    <p className="text-xs text-white/50">Telephone</p>
                    <p className="text-white">{patient.emergencyPhone || 'Non renseigne'}</p>
                  </div>
                </div>
              </div>

              {/* Medical Info */}
              <h3 className="text-lg font-semibold text-white mb-4 mt-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                Informations Medicales
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <Heart className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-xs text-white/50">Groupe Sanguin</p>
                    <p className="text-white text-lg font-semibold">{patient.bloodType || 'Non renseigne'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'consultations' && (
          <div className="glass-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Historique des Consultations</h3>
              <Link to={`/consultations?patientId=${id}`}>
                <button className="glass-button text-sm">Voir tout</button>
              </Link>
            </div>
            {consultations.length === 0 ? (
              <div className="text-center py-8">
                <Stethoscope className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/60">Aucune consultation enregistree</p>
              </div>
            ) : (
              <div className="space-y-3">
                {consultations.slice(0, 5).map((consultation) => (
                  <div
                    key={consultation.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{consultation.reason || 'Consultation'}</p>
                      <p className="text-sm text-white/60">
                        {consultation.consultationDate
                          ? format(new Date(consultation.consultationDate), 'dd MMM yyyy - HH:mm', { locale: fr })
                          : 'Date non disponible'}
                      </p>
                    </div>
                    <span className={`badge ${
                      consultation.status === 'COMPLETED' ? 'badge-success' :
                      consultation.status === 'SCHEDULED' ? 'badge-info' :
                      consultation.status === 'IN_PROGRESS' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {consultation.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'records' && (
          <div className="glass-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Dossiers Medicaux</h3>
              <Link to={`/medical-records?patientId=${id}`}>
                <button className="glass-button text-sm">Voir tout</button>
              </Link>
            </div>
            {medicalRecords.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/60">Aucun dossier medical enregistre</p>
              </div>
            ) : (
              <div className="space-y-3">
                {medicalRecords.slice(0, 5).map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => navigate(`/medical-records/${record.id}`)}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{record.diagnosis || 'Diagnostic non disponible'}</p>
                      <p className="text-sm text-white/60">
                        {record.recordDate
                          ? format(new Date(record.recordDate), 'dd MMM yyyy', { locale: fr })
                          : 'Date non disponible'}
                      </p>
                    </div>
                    <span className="badge badge-info">Dossier #{record.id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default PatientDetails
