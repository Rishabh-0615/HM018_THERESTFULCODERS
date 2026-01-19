import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import NavbarPratik from '../components/Navbar.pratik';
import { FaArrowLeft, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { UserData } from '../context/UserContext';

const OrderDetailPratik = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = UserData();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [pharmacistNotes, setPharmacistNotes] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/api/order/order.pratik/${id}`);
      setOrder(data.order);
      setNewStatus(data.order.status);
      setNewPaymentStatus(data.order.paymentStatus);
      setPharmacistNotes(data.order.pharmacistNotes || '');
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch order details');
      navigate('/pharmacist/orders.pratik');
    }
  };

  const updateStatus = async () => {
    try {
      await axios.patch(`/api/order/order.pratik/${id}/status`, {
        status: newStatus,
        pharmacistNotes
      });
      toast.success('Order status updated');
      fetchOrder();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const updatePaymentStatus = async () => {
    try {
      await axios.patch(`/api/order/order.pratik/${id}/payment`, {
        paymentStatus: newPaymentStatus
      });
      toast.success('Payment status updated');
      fetchOrder();
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F3FB]">
        <NavbarPratik />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#055AF9]"></div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#F0F3FB]">
      <NavbarPratik />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-[#055AF9] hover:text-[#013188] mb-6"
          >
            <FaArrowLeft />
            <span>Back to Orders</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Info */}
              <div className="bg-[#FCFCFE] border border-[#C7C9CE] rounded-lg p-6">
                <h2 className="text-2xl font-bold text-[#343838] mb-4">
                  Order #{order.orderNumber}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#7F7E85]">Order Date</p>
                    <p className="text-[#343838] font-medium">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#7F7E85]">Payment Method</p>
                    <p className="text-[#343838] font-medium capitalize">{order.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="bg-[#FCFCFE] border border-[#C7C9CE] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#343838] mb-4">Customer Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FaUser className="text-[#7F7E85]" />
                    <span className="text-[#343838]">{order.customerDetails.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-[#7F7E85]" />
                    <span className="text-[#343838]">{order.customerDetails.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-[#7F7E85]" />
                    <span className="text-[#343838]">{order.customerDetails.mobile}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaMapMarkerAlt className="text-[#7F7E85] mt-1" />
                    <span className="text-[#343838]">{order.customerDetails.address}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-[#FCFCFE] border border-[#C7C9CE] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#343838] mb-4">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 pb-4 border-b border-[#C7C9CE] last:border-0">
                      {item.image?.url && (
                        <img src={item.image.url} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-[#343838]">{item.name}</p>
                        <p className="text-sm text-[#7F7E85]">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-[#055AF9]">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 border-t-2 border-[#343838]">
                    <span className="text-lg font-bold text-[#343838]">Total Amount</span>
                    <span className="text-2xl font-bold text-[#055AF9]">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="bg-[#FCFCFE] border border-[#C7C9CE] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#343838] mb-2">Customer Notes</h3>
                  <p className="text-[#7F7E85]">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Status Management */}
            {user?.role === 'pharmacist' && (
              <div className="space-y-6">
                {/* Order Status */}
                <div className="bg-[#FCFCFE] border border-[#C7C9CE] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#343838] mb-4">Update Order Status</h3>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full py-2 px-4 border border-[#C7C9CE] bg-[#FCFCFE] rounded-md text-[#343838] focus:outline-none focus:ring-2 focus:ring-[#055AF9] mb-4"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={updateStatus}
                    className="w-full py-2 px-4 bg-[#055AF9] text-white rounded-md hover:bg-[#013188]"
                  >
                    Update Status
                  </button>
                </div>

                {/* Payment Status */}
                <div className="bg-[#FCFCFE] border border-[#C7C9CE] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#343838] mb-4">Update Payment Status</h3>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value)}
                    className="w-full py-2 px-4 border border-[#C7C9CE] bg-[#FCFCFE] rounded-md text-[#343838] focus:outline-none focus:ring-2 focus:ring-[#055AF9] mb-4"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                  <button
                    onClick={updatePaymentStatus}
                    className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Update Payment
                  </button>
                </div>

                {/* Pharmacist Notes */}
                <div className="bg-[#FCFCFE] border border-[#C7C9CE] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#343838] mb-4">Pharmacist Notes</h3>
                  <textarea
                    value={pharmacistNotes}
                    onChange={(e) => setPharmacistNotes(e.target.value)}
                    rows="4"
                    className="w-full py-2 px-4 border border-[#C7C9CE] bg-[#FCFCFE] rounded-md text-[#343838] focus:outline-none focus:ring-2 focus:ring-[#055AF9] mb-4"
                    placeholder="Add notes about this order..."
                  />
                  <button
                    onClick={updateStatus}
                    className="w-full py-2 px-4 bg-[#055AF9] text-white rounded-md hover:bg-[#013188]"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetailPratik;
