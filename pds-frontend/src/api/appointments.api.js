import apiClient from './axios.config'

const CLINIC_BASE = '/clinic/appointments'

export const appointmentsAPI = {
  getAll: async () => {
    const response = await apiClient.get(`${CLINIC_BASE}/getAllAppointments`)
    return response.data
  },

  getById: async (id) => {
    const response = await apiClient.get(`${CLINIC_BASE}/getAppointmentById/${id}`)
    return response.data
  },

  getByPatient: async (patientId) => {
    const response = await apiClient.get(`${CLINIC_BASE}/getByPatient/${patientId}`)
    return response.data
  },

  getByDoctor: async (doctorId) => {
    const response = await apiClient.get(`${CLINIC_BASE}/getByDoctor/${doctorId}`)
    return response.data
  },

  getByDate: async (date) => {
    const response = await apiClient.get(`${CLINIC_BASE}/getByDate/${date}`)
    return response.data
  },

  create: async (appointmentData) => {
    const response = await apiClient.post(`${CLINIC_BASE}/createAppointment`, appointmentData)
    return response.data
  },

  update: async (id, appointmentData) => {
    const response = await apiClient.put(`${CLINIC_BASE}/updateAppointment/${id}`, appointmentData)
    return response.data
  },

  delete: async (id) => {
    const response = await apiClient.delete(`${CLINIC_BASE}/deleteAppointment/${id}`)
    return response.data
  },

  updateStatus: async (id, status) => {
    const response = await apiClient.patch(`${CLINIC_BASE}/${id}/status`, { status })
    return response.data
  },
}

export default appointmentsAPI
