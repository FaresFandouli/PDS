import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  Download,
  RefreshCw,
} from 'lucide-react'
import { patientsAPI } from '../../api/patients.api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const PatientsList = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [filterGender, setFilterGender] = useState('all')

  const { data: patients = [], isLoading, refetch } = useQuery({
    queryKey: ['patients'],
    queryFn: patientsAPI.getAll,
  })

  const deleteMutation = useMutation({
    mutationFn: patientsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['patients'])
      toast.success('Patient supprime avec succes')
      setShowDeleteModal(false)
    },
    onError: () => {
      toast.error('Erreur lors de la suppression')
    },
  })

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGender = filterGender === 'all' || patient.gender === filterGender
    return matchesSearch && matchesGender
  })

  const handleDelete = (patient) => {
    setSelectedPatient(patient)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (selectedPatient) {
      deleteMutation.mutate(selectedPatient.id)
    }
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const getGenderBadge = (gender) => {
    if (gender === 'Male' || gender === 'Homme') {
      return <span className="badge badge-info">Homme</span>
    }
    return <span className="badge badge-purple">Femme</span>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Liste des Patients</h1>
          <p className="text-white/60">{filteredPatients.length} patients enregistres</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => refetch()}
            className="glass-button flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exporter
          </motion.button>
          <Link to="/patients/new">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouveau Patient
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Rechercher par nom, prenom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input pl-12"
            />
          </div>

          {/* Gender Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-white/50" />
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="glass-input w-40"
            >
              <option value="all">Tous</option>
              <option value="Male">Hommes</option>
              <option value="Female">Femmes</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Patients Grid/Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : filteredPatients.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card text-center py-12"
        >
          <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Aucun patient trouve</h3>
          <p className="text-white/60 mb-6">
            {searchQuery
              ? 'Aucun resultat pour votre recherche'
              : 'Commencez par ajouter votre premier patient'}
          </p>
          <Link to="/patients/new">
            <button className="glass-button-primary">
              <Plus className="w-4 h-4 inline mr-2" />
              Ajouter un patient
            </button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card overflow-hidden p-0"
        >
          <div className="overflow-x-auto">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Contact</th>
                  <th>Genre</th>
                  <th>Groupe Sanguin</th>
                  <th>Date de Naissance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredPatients.map((patient, index) => (
                    <motion.tr
                      key={patient.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {getInitials(patient.firstName, patient.lastName)}
                          </div>
                          <div>
                            <p className="font-semibold text-white">
                              {patient.firstName} {patient.lastName}
                            </p>
                            <p className="text-sm text-white/50">ID: {patient.id}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="space-y-1">
                          <p className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-white/50" />
                            {patient.email || 'Non renseigne'}
                          </p>
                          <p className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-white/50" />
                            {patient.phone || 'Non renseigne'}
                          </p>
                        </div>
                      </td>
                      <td>{getGenderBadge(patient.gender)}</td>
                      <td>
                        <span className="badge badge-danger">
                          {patient.bloodType || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-white/50" />
                          {patient.dateOfBirth
                            ? format(new Date(patient.dateOfBirth), 'dd MMM yyyy', { locale: fr })
                            : 'Non renseigne'}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate(`/patients/${patient.id}`)}
                            className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                            title="Voir details"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate(`/patients/${patient.id}/edit`)}
                            className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(patient)}
                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Confirmer la suppression</h3>
                <p className="text-white/60 mb-6">
                  Etes-vous sur de vouloir supprimer le patient{' '}
                  <span className="text-white font-semibold">
                    {selectedPatient?.firstName} {selectedPatient?.lastName}
                  </span>
                  ? Cette action est irreversible.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="glass-button"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleteMutation.isPending}
                    className="glass-button-danger flex items-center gap-2"
                  >
                    {deleteMutation.isPending ? (
                      <div className="spinner w-4 h-4" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PatientsList
