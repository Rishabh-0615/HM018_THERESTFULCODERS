import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaBox, FaCheckCircle, FaTruck, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const DeliveryBoyDashboard = () => {
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data } = await axios.get('/api/delivery-boy/me');
      setUser(data.deliveryBoy);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch profile');
      setLoading(false);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await axios.put(`/api/orders/complete/${orderId}`);
      toast.success('Order marked as completed!');
      // Refresh data here if needed
    } catch (error) {
      toast.error('Failed to complete order');
    }
  };

  const handleStartDelivery = async (orderId) => {
    try {
      await axios.put(`/api/orders/start/${orderId}`);
      toast.success('Delivery started!');
      // Refresh data here if needed
    } catch (error) {
      toast.error('Failed to start delivery');
    }
  };

  // Calculate stats from user data
  const stats = {
    totalAssigned: assignedOrders.length,
    completedToday: completedOrders.filter(order => {
      const today = new Date().toDateString();
      return new Date(order.completedAt).toDateString() === today;
    }).length,
    inProgress: assignedOrders.filter(order => order.status === 'in-progress').length,
    pendingPickup: assignedOrders.filter(order => order.status === 'pending').length,
  };

  const statCards = [
    {
      title: 'Total Assigned',
      value: stats.totalAssigned,
      icon: <FaBox />,
      color: 'bg-blue-500',
    },
    {
      title: 'Completed Today',
      value: stats.completedToday,
      icon: <FaCheckCircle />,
      color: 'bg-green-500',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: <FaTruck />,
      color: 'bg-orange-500',
    },
    {
      title: 'Pending Pickup',
      value: stats.pendingPickup,
      icon: <FaClock />,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F3FB]">      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#343838] mb-2">
            Welcome back, {user?.name || 'Delivery Boy'}!
          </h1>
          <p className="text-[#7F7E85]">Here's your delivery overview</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#055AF9]"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

            {/* Assigned Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#FCFCFE] border border-[#C7C9CE] rounded-lg p-6 shadow-md mb-8"
            >
              <h2 className="text-2xl font-bold text-[#343838] mb-4">Assigned Orders</h2>
              {assignedOrders.length === 0 ? (
                <p className="text-[#7F7E85] text-center py-8">No assigned orders at the moment</p>
              ) : (
                <div className="space-y-4">
                  {assignedOrders.map((order, index) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-[#C7C9CE] rounded-lg p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-[#343838] mb-1">Order #{order.orderNumber}</h3>
                          <p className="text-sm text-[#7F7E85]">{order.customerName}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="flex items-start mb-3">
                        <FaMapMarkerAlt className="text-[#055AF9] mt-1 mr-2 flex-shrink-0" />
                        <p className="text-sm text-[#343838]">{order.deliveryAddress}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-[#7F7E85]">
                          {order.itemCount} items • ₹{order.totalAmount}
                        </p>
                        <div className="flex gap-2">
                          {order.status === 'pending' && (
                            <motion.button
                              onClick={() => handleStartDelivery(order._id)}
                              className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Start Delivery
                            </motion.button>
                          )}
                          {order.status === 'in-progress' && (
                            <motion.button
                              onClick={() => handleCompleteOrder(order._id)}
                              className="px-4 py-2 bg-[#055AF9] text-white rounded-lg text-sm hover:bg-[#013188] transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Mark Complete
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Completed Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#FCFCFE] border border-[#C7C9CE] rounded-lg p-6 shadow-md"
            >
              <h2 className="text-2xl font-bold text-[#343838] mb-4">Completed Orders</h2>
              {completedOrders.length === 0 ? (
                <p className="text-[#7F7E85] text-center py-8">No completed orders yet</p>
              ) : (
                <div className="space-y-4">
                  {completedOrders.slice(0, 5).map((order, index) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-[#C7C9CE] rounded-lg p-4 bg-green-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-[#343838] mb-1">Order #{order.orderNumber}</h3>
                          <p className="text-sm text-[#7F7E85] mb-2">{order.customerName}</p>
                          <p className="text-xs text-[#7F7E85]">
                            Completed on {new Date(order.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <FaCheckCircle className="text-green-500 text-2xl mb-1 ml-auto" />
                          <p className="text-sm font-semibold text-[#343838]">₹{order.totalAmount}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;