import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  FileText,
  Settings,
  HelpCircle,
  Activity,
  Heart,
  BarChart3,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const getNavigationByRole = (role) => {
  const baseNav = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['PATIENT', 'DOCTOR', 'ADMIN'] },
  ]

  const roleNav = {
    PATIENT: [
      { name: 'Rendez-vous', href: '/appointments', icon: Calendar, roles: ['PATIENT'] },
      { name: 'Consultations', href: '/consultations', icon: Stethoscope, roles: ['PATIENT'] },
      { name: 'Dossiers Medicaux', href: '/medical-records', icon: FileText, roles: ['PATIENT'] },
    ],
    DOCTOR: [
      { name: 'Patients', href: '/patients', icon: Users, roles: ['DOCTOR', 'ADMIN'] },
      { name: 'Rendez-vous', href: '/appointments', icon: Calendar, roles: ['DOCTOR', 'ADMIN'] },
      { name: 'Consultations', href: '/consultations', icon: Stethoscope, roles: ['DOCTOR', 'ADMIN'] },
      { name: 'Dossiers Medicaux', href: '/medical-records', icon: FileText, roles: ['DOCTOR', 'ADMIN'] },
    ],
    ADMIN: [
      { name: 'Patients', href: '/patients', icon: Users, roles: ['DOCTOR', 'ADMIN'] },
      { name: 'Rendez-vous', href: '/appointments', icon: Calendar, roles: ['DOCTOR', 'ADMIN'] },
      { name: 'Consultations', href: '/consultations', icon: Stethoscope, roles: ['DOCTOR', 'ADMIN'] },
      { name: 'Dossiers Medicaux', href: '/medical-records', icon: FileText, roles: ['DOCTOR', 'ADMIN'] },
      { name: 'Statistiques', href: '/reports', icon: BarChart3, roles: ['ADMIN'] },
    ],
  }

  return [...baseNav, ...(roleNav[role] || roleNav.PATIENT)]
}

const secondaryNavigation = [
  { name: 'Parametres', href: '/settings', icon: Settings },
  { name: 'Aide', href: '/help', icon: HelpCircle },
]

const Sidebar = () => {
  const { user } = useAuth()
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-0 h-screen w-64 glass-dark z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Heart className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">PDS Health</h1>
            <p className="text-xs text-white/60">Gestion de Sante</p>
          </div>
        </div>
      </div>

      {/* Health Status Card */}
      <div className="mx-4 mt-4 p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center">
            <Activity className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Systeme Actif</p>
            <p className="text-xs text-green-400">Tous les services OK</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 px-4">
          Menu Principal
        </p>
        {getNavigationByRole(user?.role).map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full"
                    />
                  )}
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : ''}`} />
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 rounded-full bg-blue-400"
                    />
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}

        {/* Secondary Navigation */}
        <div className="pt-6 mt-6 border-t border-white/10">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 px-4">
            Support
          </p>
          {secondaryNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Version Info */}
      <div className="p-4 border-t border-white/10">
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-xs text-white/60">PDS Health v2.0</p>
          <p className="text-xs text-white/40">2024 - Tous droits reserves</p>
        </div>
      </div>
    </motion.aside>
  )
}

export default Sidebar
