import apiClient from './axios.config'

const CONSULTATION_BASE = '/consultation/consultations'

export const consultationsAPI = {
  getAll: async () => {
    const response = await apiClient.get(`${CONSULTATION_BASE}/getAllConsultations`)
    return response.data
  },

  getById: async (id) => {
    const response = await apiClient.get(`${CONSULTATION_BASE}/getConsultationById/${id}`)
    return response.data
  },

  getByPatient: async (patientId) => {
    const response = await apiClient.get(`${CONSULTATION_BASE}/patient/${patientId}`)
    return response.data
  },

  getByDoctor: async (doctorId) => {
    const response = await apiClient.get(`${CONSULTATION_BASE}/doctor/${doctorId}`)
    return response.data
  },

  getByStatus: async (status) => {
    const response = await apiClient.get(`${CONSULTATION_BASE}/getConsultationsByStatus/status/${status}`)
    return response.data
  },

  create: async (consultationData) => {
    const response = await apiClient.post(`${CONSULTATION_BASE}/createConsultation`, consultationData)
    return response.data
  },

  update: async (id, consultationData) => {
    const response = await apiClient.put(`${CONSULTATION_BASE}/updateConsultation/${id}`, consultationData)
    return response.data
  },

  delete: async (id) => {
    const response = await apiClient.delete(`${CONSULTATION_BASE}/deleteConsultation/${id}`)
    return response.data
  },
}

export default consultationsAPI
