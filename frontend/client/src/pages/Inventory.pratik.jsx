import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import NavbarPratik from '../components/Navbar.pratik';
import { FaExclamationTriangle, FaCalendarAlt, FaTimesCircle } from 'react-icons/fa';

const InventoryPratik = () => {
  const [lowStock, setLowStock] = useState([]);
  const [nearExpiry, setNearExpiry] = useState([]);
  const [expired, setExpired] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('lowStock');

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      const [lowStockRes, nearExpiryRes, expiredRes] = await Promise.all([
        axios.get('/api/pharma/low-stock.pratik'),
        axios.get('/api/pharma/near-expiry.pratik'),
        axios.get('/api/pharma/expired.pratik')
      ]);

      setLowStock(lowStockRes.data.medicines);
      setNearExpiry(nearExpiryRes.data.medicines);
      setExpired(expiredRes.data.medicines);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch inventory data');
      setLoading(false);
    }
  };

  const updateStock = async (id, newStock) => {
    try {
      await axios.patch(`/api/pharma/medicine.pratik/${id}/stock.pratik`, { stock: newStock });
      toast.success('Stock updated successfully');
      fetchInventoryData();
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  const tabs = [
    { id: 'lowStock', name: 'Low Stock', icon: <FaExclamationTriangle />, count: lowStock.length },
    { id: 'nearExpiry', name: 'Near Expiry', icon: <FaCalendarAlt />, count: nearExpiry.length },
    { id: 'expired', name: 'Expired', icon: <FaTimesCircle />, count: expired.length },
  ];

  const renderTable = (data) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F0F3FB]">
            <th className="px-6 py-3 text-left text-xs font-medium text-[#343838] uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#343838] uppercase">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#343838] uppercase">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#343838] uppercase">Price</th>
            {activeTab === 'nearExpiry' || activeTab === 'expired' ? (
              <th className="px-6 py-3 text-left text-xs font-medium text-[#343838] uppercase">Expiry Date</th>
            ) : null}
            <th className="px-6 py-3 text-left text-xs font-medium text-[#343838] uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-[#FCFCFE] divide-y divide-[#C7C9CE]">
          {data.map((medicine) => (
            <tr key={medicine._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#343838]">{medicine.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#7F7E85]">{medicine.category}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`${medicine.stock === 0 ? 'text-red-600' : 'text-orange-600'} font-semibold`}>
                  {medicine.stock}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#343838]">₹{medicine.price}</td>
              {activeTab === 'nearExpiry' || activeTab === 'expired' ? (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#343838]">
                  {new Date(medicine.expiryDate).toLocaleDateString()}
                </td>
              ) : null}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {activeTab === 'lowStock' && (
                  <button
                    onClick={() => {
                      const newStock = prompt('Enter new stock quantity:', medicine.stock);
                      if (newStock !== null) {
                        updateStock(medicine._id, parseInt(newStock));
                      }
                    }}
                    className="px-3 py-1 bg-[#055AF9] text-white rounded hover:bg-[#013188]"
                  >
                    Update Stock
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F3FB]">
      <NavbarPratik />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#343838] mb-2">Inventory Management</h1>
          <p className="text-[#7F7E85]">Monitor stock levels and expiry dates</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#055AF9] text-white'
                  : 'bg-[#FCFCFE] text-[#343838] border border-[#C7C9CE] hover:bg-[#F0F3FB]'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-white text-[#055AF9]' : 'bg-[#F0F3FB] text-[#343838]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#055AF9]"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#FCFCFE] border border-[#C7C9CE] rounded-lg shadow-md overflow-hidden"
          >
            {activeTab === 'lowStock' && lowStock.length === 0 && (
              <p className="text-center py-8 text-[#7F7E85]">No low stock items</p>
            )}
            {activeTab === 'nearExpiry' && nearExpiry.length === 0 && (
              <p className="text-center py-8 text-[#7F7E85]">No medicines near expiry</p>
            )}
            {activeTab === 'expired' && expired.length === 0 && (
              <p className="text-center py-8 text-[#7F7E85]">No expired medicines</p>
            )}

            {activeTab === 'lowStock' && lowStock.length > 0 && renderTable(lowStock)}
            {activeTab === 'nearExpiry' && nearExpiry.length > 0 && renderTable(nearExpiry)}
            {activeTab === 'expired' && expired.length > 0 && renderTable(expired)}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InventoryPratik;
