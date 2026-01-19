import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import NavbarPratik from '../components/Navbar.pratik';
import { FaSearch, FaEye, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const OrdersPratik = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/orders.pratik', {
        params: { search: searchTerm, status: statusFilter }
      });
      setOrders(data.orders);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch orders');
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/order/order-stats.pratik');
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-orange-100 text-orange-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-[#F0F3FB]">
      <NavbarPratik />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-[#343838] mb-8">Order Management</h1>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#FCFCFE] border border-[#C7C9CE] rounded-lg p-4">
                <p className="text-[#7F7E85] text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-[#343838]">{stats.totalOrders}</p>
              </div>
              <div className="bg-[#FCFCFE] border border-[#C7C9CE] rounded-lg p-4">
                <p className="text-[#7F7E85] text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
              </div>
              <div className="bg-[#FCFCFE] border border-[#C7C9CE] rounded-lg p-4">
                <p className="text-[#7F7E85] text-sm">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{stats.deliveredOrders}</p>
              </div>
              <div className="bg-[#FCFCFE] border border-[#C7C9CE] rounded-lg p-4">
                <p className="text-[#7F7E85] text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-[#055AF9]">₹{stats.totalRevenue?.toFixed(2)}</p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-[#FCFCFE] border border-[#C7C9CE] rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7F7E85]" />
                <input
                  type="text"
                  placeholder="Search by order number, name, or mobile..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 border border-[#C7C9CE] bg-[#FCFCFE] rounded-md text-[#343838] focus:outline-none focus:ring-2 focus:ring-[#055AF9]"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-2 px-4 border border-[#C7C9CE] bg-[#FCFCFE] rounded-md text-[#343838] focus:outline-none focus:ring-2 focus:ring-[#055AF9]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#055AF9]"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 bg-[#FCFCFE] border border-[#C7C9CE] rounded-lg">
              <p className="text-[#7F7E85] text-lg">No orders found</p>
            </div>
          ) : (
            <div className="bg-[#FCFCFE] border border-[#C7C9CE] rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F0F3FB]">
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#343838] uppercase">Order #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#343838] uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#343838] uppercase">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#343838] uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#343838] uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#343838] uppercase">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#343838] uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#343838] uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C7C9CE]">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-[#F0F3FB]">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#343838]">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div>
                            <p className="text-[#343838] font-medium">{order.customerDetails?.name || 'N/A'}</p>
                            <p className="text-[#7F7E85] text-xs">{order.customerDetails?.mobile || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#343838]">
                          {order.items.length} item(s)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#055AF9]">
                          ₹{order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#7F7E85]">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            to={`/pharmacist/order.pratik/${order._id}`}
                            className="inline-flex items-center px-3 py-1 bg-[#055AF9] text-white rounded hover:bg-[#013188]"
                          >
                            <FaEye className="mr-1" />
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OrdersPratik;
