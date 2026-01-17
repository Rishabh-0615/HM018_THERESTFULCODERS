import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPills, FaExclamationTriangle, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import NavbarPratik from '../components/Navbar.pratik';
import { UserData } from '../context/UserContext';

const PharmacistDashboardPratik = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = UserData();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/pharma/stats.pratik');
      setStats(data.stats);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch stats');
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Medicines',
      value: stats?.totalMedicines || 0,
      icon: <FaPills />,
      color: 'bg-blue-500',
    },
    {
      title: 'Out of Stock',
      value: stats?.outOfStock || 0,
      icon: <FaExclamationTriangle />,
      color: 'bg-red-500',
    },
    {
      title: 'Low Stock Items',
      value: stats?.lowStockCount || 0,
      icon: <FaExclamationTriangle />,
      color: 'bg-orange-500',
    },
    {
      title: 'Near Expiry',
      value: stats?.nearExpiryCount || 0,
      icon: <FaCalendarAlt />,
      color: 'bg-yellow-500',
    },
    {
      title: 'Inventory Value',
      value: `₹${stats?.totalInventoryValue?.toFixed(2) || 0}`,
      icon: <FaDollarSign />,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F3FB]">
      <NavbarPratik />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#343838] mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-[#7F7E85]">Here's your pharmacy overview</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#055AF9]"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
              {statCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#FCFCFE] border border-[#C7C9CE] rounded-lg p-6 shadow-md"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${card.color} text-white p-3 rounded-lg`}>
                      {card.icon}
                    </div>
                  </div>
                  <h3 className="text-[#7F7E85] text-sm mb-1">{card.title}</h3>
                  <p className="text-2xl font-bold text-[#343838]">{card.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#FCFCFE] border border-[#C7C9CE] rounded-lg p-6 shadow-md"
            >
              <h2 className="text-2xl font-bold text-[#343838] mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.a
                  href="/pharmacist/add-medicine.pratik"
                  className="p-4 bg-[#055AF9] text-white rounded-lg text-center hover:bg-[#013188] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add New Medicine
                </motion.a>
                <motion.a
                  href="/pharmacist/inventory.pratik"
                  className="p-4 bg-orange-500 text-white rounded-lg text-center hover:bg-orange-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Low Stock
                </motion.a>
                <motion.a
                  href="/pharmacist/medicines.pratik"
                  className="p-4 bg-green-500 text-white rounded-lg text-center hover:bg-green-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Manage Medicines
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default PharmacistDashboardPratik;
