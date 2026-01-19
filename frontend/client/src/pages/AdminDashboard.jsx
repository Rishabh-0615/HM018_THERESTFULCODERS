import React, { useState } from 'react'
import { AdminData } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaShieldAlt, 
  FaSignOutAlt, 
  FaTruck, 
  FaUsers, 
  FaBox,
  FaChartLine,
  FaBars,
  FaTimes,
  FaUserCheck
} from 'react-icons/fa'
import UnverifiedPharmacists from '../components/UnverifiedPharmacists'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('deliveries')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  const { admin, logoutAdmin, btnLoading } = AdminData()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutAdmin(navigate)
  }

  const menuItems = [
    { id: 'deliveries', name: 'Assigned Deliveries', icon: FaTruck },
    { id: 'users', name: 'Users', icon: FaUsers },
    { id: 'pharmacists', name: 'Unverified Pharmacists', icon: FaUserCheck  },
    { id: 'analytics', name: 'Analytics', icon: FaChartLine },
  ]

  return (
    <div className='min-h-screen bg-[#F0F3FB]'>
      {/* Top Navigation Bar */}
      <motion.div 
        className='bg-[#FCFCFE] border-b border-[#C7C9CE] px-6 py-4 flex items-center justify-between shadow-sm'
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className='flex items-center gap-4'>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='text-[#343838] hover:text-[#055AF9] transition-colors'
          >
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <div className='flex items-center gap-2'>
            <FaShieldAlt className='text-[#055AF9] text-2xl' />
            <h1 className='text-xl font-bold text-[#055AF9]'>NexPharma ADMIN</h1>
          </div>
        </div>
        
        <div className='flex items-center gap-4'>
          <div className='text-right hidden md:block'>
            <p className='text-sm font-medium text-[#343838]'>{admin?.email || 'Admin'}</p>
            <p className='text-xs text-[#7F7E85]'>Administrator</p>
          </div>
          <motion.button
            onClick={handleLogout}
            disabled={btnLoading}
            className='flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSignOutAlt />
            <span className='hidden md:inline'>Logout</span>
          </motion.button>
        </div>
      </motion.div>

      <div className='flex'>
        {/* Sidebar */}
        <motion.div 
          className={`bg-[#FCFCFE] border-r border-[#C7C9CE] h-[calc(100vh-73px)] transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-0'
          } overflow-hidden`}
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='p-4'>
            <nav className='space-y-2'>
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                    activeTab === item.id
                      ? 'bg-[#055AF9] text-white'
                      : 'text-[#343838] hover:bg-[#F0F3FB]'
                  }`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon size={20} />
                  <span className='font-medium'>{item.name}</span>
                </motion.button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className='flex-1 p-6 overflow-y-auto h-[calc(100vh-73px)]'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === 'users' && (
              <div className='bg-[#FCFCFE] p-6 rounded-lg shadow-md'>
                <h2 className='text-2xl font-bold text-[#343838] mb-4'>Users Management</h2>
                <p className='text-[#7F7E85]'>Users management coming soon...</p>
              </div>
            )}
            {activeTab === 'pharmacists' && <UnverifiedPharmacists />}
            {activeTab === 'analytics' && (
              <div className='bg-[#FCFCFE] p-6 rounded-lg shadow-md'>
                <h2 className='text-2xl font-bold text-[#343838] mb-4'>Analytics Dashboard</h2>
                <p className='text-[#7F7E85]'>Analytics coming soon...</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard