import apiClient from './axios.config'

const MEDICAL_BASE = '/medical/records'

export const medicalRecordsAPI = {
  getAll: async () => {
    const response = await apiClient.get(MEDICAL_BASE)
    return response.data
  },

  getById: async (id) => {
    const response = await apiClient.get(`${MEDICAL_BASE}/${id}`)
    return response.data
  },

  getByPatient: async (patientId) => {
    const response = await apiClient.get(`${MEDICAL_BASE}/patient/${patientId}`)
    return response.data
  },

  getByDoctor: async (doctorId) => {
    const response = await apiClient.get(`${MEDICAL_BASE}/doctor/${doctorId}`)
    return response.data
  },

  create: async (recordData) => {
    const response = await apiClient.post(MEDICAL_BASE, recordData)
    return response.data
  },

  update: async (id, recordData) => {
    const response = await apiClient.put(`${MEDICAL_BASE}/${id}`, recordData)
    return response.data
  },

  delete: async (id) => {
    const response = await apiClient.delete(`${MEDICAL_BASE}/${id}`)
    return response.data
  },
}

export default medicalRecordsAPI
