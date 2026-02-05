import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import VerifyEmail from './pages/Auth/VerifyEmail'
import Dashboard from './pages/Dashboard/Dashboard'
import Unauthorized from './pages/Unauthorized'
import ProtectedRoute from './components/ProtectedRoute'
import PatientsList from './pages/Patients/PatientsList'
import PatientDetails from './pages/Patients/PatientDetails'
import PatientForm from './pages/Patients/PatientForm'
import AppointmentsList from './pages/Appointments/AppointmentsList'
import AppointmentForm from './pages/Appointments/AppointmentForm'
import ConsultationsList from './pages/Consultations/ConsultationsList'
import ConsultationDetails from './pages/Consultations/ConsultationDetails'
import MedicalRecordsList from './pages/MedicalRecords/MedicalRecordsList'
import MedicalRecordDetails from './pages/MedicalRecords/MedicalRecordDetails'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Patients Routes - accessible to DOCTOR and ADMIN */}
        <Route
          path="patients"
          element={
            <ProtectedRoute requiredRoles={['DOCTOR', 'ADMIN']}>
              <PatientsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="patients/new"
          element={
            <ProtectedRoute requiredRoles={['DOCTOR', 'ADMIN']}>
              <PatientForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="patients/:id"
          element={
            <ProtectedRoute requiredRoles={['DOCTOR', 'ADMIN']}>
              <PatientDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="patients/:id/edit"
          element={
            <ProtectedRoute requiredRoles={['DOCTOR', 'ADMIN']}>
              <PatientForm />
            </ProtectedRoute>
          }
        />

        {/* Appointments Routes - PATIENT can book, DOCTOR and ADMIN can view */}
        <Route
          path="appointments"
          element={
            <ProtectedRoute requiredRoles={['PATIENT', 'DOCTOR', 'ADMIN']}>
              <AppointmentsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="appointments/new"
          element={
            <ProtectedRoute requiredRoles={['PATIENT']}>
              <AppointmentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="appointments/:id/edit"
          element={
            <ProtectedRoute requiredRoles={['DOCTOR', 'ADMIN']}>
              <AppointmentForm />
            </ProtectedRoute>
          }
        />

        {/* Consultations Routes */}
        <Route
          path="consultations"
          element={
            <ProtectedRoute requiredRoles={['PATIENT', 'DOCTOR', 'ADMIN']}>
              <ConsultationsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="consultations/:id"
          element={
            <ProtectedRoute requiredRoles={['PATIENT', 'DOCTOR', 'ADMIN']}>
              <ConsultationDetails />
            </ProtectedRoute>
          }
        />

        {/* Medical Records Routes - accessible to PATIENT to see their own, DOCTOR and ADMIN to see all */}
        <Route
          path="medical-records"
          element={
            <ProtectedRoute requiredRoles={['PATIENT', 'DOCTOR', 'ADMIN']}>
              <MedicalRecordsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="medical-records/:id"
          element={
            <ProtectedRoute requiredRoles={['PATIENT', 'DOCTOR', 'ADMIN']}>
              <MedicalRecordDetails />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
