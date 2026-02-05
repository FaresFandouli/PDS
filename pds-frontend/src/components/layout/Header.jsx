import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Bell,
  LogOut,
  User,
  ChevronDown,
  Moon,
  Sun,
  Settings,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const getPageTitle = () => {
    const path = location.pathname
    if (path.includes('dashboard')) return 'Tableau de Bord'
    if (path.includes('patients')) return 'Gestion des Patients'
    if (path.includes('appointments')) return 'Rendez-vous'
    if (path.includes('consultations')) return 'Consultations'
    if (path.includes('medical-records')) return 'Dossiers Medicaux'
    return 'PDS Health'
  }

  const notifications = [
    { id: 1, title: 'Nouveau patient enregistre', time: 'Il y a 5 min', type: 'info' },
    { id: 2, title: 'Rendez-vous confirme', time: 'Il y a 15 min', type: 'success' },
    { id: 3, title: 'Rappel: Consultation a 14h', time: 'Il y a 1h', type: 'warning' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-20 glass-dark border-b border-white/10 px-6 flex items-center justify-between sticky top-0 z-30"
    >
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-white">{getPageTitle()}</h2>
        <p className="text-sm text-white/60">
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input pl-12 w-64"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 rounded-xl glass hover:bg-white/20 transition-all"
          >
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 glass-light rounded-2xl overflow-hidden shadow-glass-lg"
              >
                <div className="p-4 border-b border-white/10">
                  <h3 className="font-semibold text-white">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-4 border-b border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <p className="text-sm text-white">{notif.title}</p>
                      <p className="text-xs text-white/50 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center">
                  <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Voir toutes les notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 pr-4 rounded-xl glass hover:bg-white/20 transition-all"
          >
            <div className="avatar">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-white/60">{user?.role}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 glass-light rounded-2xl overflow-hidden shadow-glass-lg"
              >
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 transition-colors">
                    <User className="w-4 h-4" />
                    <span>Mon Profil</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Parametres</span>
                  </button>
                  <div className="my-2 border-t border-white/10" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Deconnexion</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
