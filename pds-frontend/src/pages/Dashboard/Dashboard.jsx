import { useAuth } from '../../context/AuthContext'
import PatientDashboard from './PatientDashboard'
import DoctorDashboard from './DoctorDashboard'
import AdminDashboard from './AdminDashboard'

const Dashboard = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    )
  }

  // Render the appropriate dashboard based on user role
  switch (user?.role) {
    case 'PATIENT':
      return <PatientDashboard />
    case 'DOCTOR':
      return <DoctorDashboard />
    case 'ADMIN':
      return <AdminDashboard />
    default:
      return <PatientDashboard /> // Default to patient dashboard
  }
}

export default Dashboard
