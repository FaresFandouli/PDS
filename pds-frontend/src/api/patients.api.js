import apiClient from './axios.config'

const CLINIC_BASE = '/clinic/patients'

export const patientsAPI = {
  getAll: async () => {
    const response = await apiClient.get(`${CLINIC_BASE}/getAllPatients`)
    return response.data
  },

  getById: async (id) => {
    const response = await apiClient.get(`${CLINIC_BASE}/getPatientById/${id}`)
    return response.data
  },

  create: async (patientData) => {
    const response = await apiClient.post(`${CLINIC_BASE}/createPatient`, patientData)
    return response.data
  },

  update: async (id, patientData) => {
    const response = await apiClient.put(`${CLINIC_BASE}/updatePatient/${id}`, patientData)
    return response.data
  },

  delete: async (id) => {
    const response = await apiClient.delete(`${CLINIC_BASE}/deletePatient/${id}`)
    return response.data
  },
}

export default patientsAPI
