import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTimes, FaBicycle, FaMotorcycle, FaCar, FaUser } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import NavbarPratik from '../components/Navbar.pratik';

const DeliveryBoys = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    vehicleType: 'bike',
    vehicleNumber: '',
    location: ''
  });

  // Fetch all delivery boys
  const fetchDeliveryBoys = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/pharma/delivery-boys');
      setDeliveryBoys(data.deliveryBoys);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch delivery boys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post('/api/pharma/delivery-boy', formData);
      toast.success(data.message);
      setShowModal(false);
      setFormData({
        name: '',
        email: '',
        mobile: '',
        vehicleType: 'bike',
        vehicleNumber: '',
        location: ''
      });
      fetchDeliveryBoys();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create delivery boy');
    } finally {
      setLoading(false);
    }
  };

  // Get vehicle icon
  const getVehicleIcon = (type) => {
    switch (type) {
      case 'bike':
      case 'scooter':
        return <FaMotorcycle className="text-[#055AF9]" />;
      case 'bicycle':
        return <FaBicycle className="text-[#055AF9]" />;
      case 'car':
        return <FaCar className="text-[#055AF9]" />;
      default:
        return <FaMotorcycle className="text-[#055AF9]" />;
    }
  };

  return (
    <>
    <NavbarPratik />
    <div className="min-h-screen bg-[#FCFCFE] p-6">

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#343838]">Delivery Boys</h1>
            <p className="text-[#7F7E85] mt-1">Manage your delivery team</p>
          </div>
          <motion.button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-[#055AF9] text-white rounded-lg hover:bg-blue-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus />
            <span>Add Delivery Boy</span>
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-[#C7C9CE]">
            <h3 className="text-[#7F7E85] text-sm font-medium">Total Delivery Boys</h3>
            <p className="text-3xl font-bold text-[#343838] mt-2">{deliveryBoys.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-[#C7C9CE]">
            <h3 className="text-[#7F7E85] text-sm font-medium">Active</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {deliveryBoys.filter(db => db.isActive).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-[#C7C9CE]">
            <h3 className="text-[#7F7E85] text-sm font-medium">Inactive</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {deliveryBoys.filter(db => !db.isActive).length}
            </p>
          </div>
        </div>

        {/* Delivery Boys List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#055AF9]"></div>
          </div>
        ) : deliveryBoys.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#C7C9CE] p-12 text-center">
            <FaUser className="text-6xl text-[#C7C9CE] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#343838] mb-2">No Delivery Boys Yet</h3>
            <p className="text-[#7F7E85] mb-4">Add your first delivery boy to get started</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-[#055AF9] text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Delivery Boy
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-[#C7C9CE] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F0F3FB]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#343838] uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#343838] uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#343838] uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#343838] uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#343838] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#343838] uppercase tracking-wider">
                      Password Changed
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C7C9CE]">
                  {deliveryBoys.map((deliveryBoy) => (
                    <motion.tr
                      key={deliveryBoy._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-[#F0F3FB] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-[#055AF9] rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {deliveryBoy.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-[#343838]">{deliveryBoy.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#343838]">{deliveryBoy.email}</div>
                        <div className="text-sm text-[#7F7E85]">{deliveryBoy.mobile}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getVehicleIcon(deliveryBoy.vehicleType)}
                          <div>
                            <div className="text-sm font-medium text-[#343838] capitalize">
                              {deliveryBoy.vehicleType}
                            </div>
                            {deliveryBoy.vehicleNumber && (
                              <div className="text-xs text-[#7F7E85]">{deliveryBoy.vehicleNumber}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#343838]">{deliveryBoy.location || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            deliveryBoy.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {deliveryBoy.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            deliveryBoy.isPasswordChanged
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {deliveryBoy.isPasswordChanged ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Delivery Boy Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-[#C7C9CE]">
                <h2 className="text-2xl font-bold text-[#343838]">Add Delivery Boy</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[#7F7E85] hover:text-[#343838] transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#343838] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#C7C9CE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#055AF9]"
                      placeholder="Enter full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-[#343838] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#C7C9CE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#055AF9]"
                      placeholder="email@example.com"
                    />
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-medium text-[#343838] mb-2">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#C7C9CE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#055AF9]"
                      placeholder="1234567890"
                    />
                  </div>

                  {/* Vehicle Type */}
                  <div>
                    <label className="block text-sm font-medium text-[#343838] mb-2">
                      Vehicle Type *
                    </label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#C7C9CE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#055AF9]"
                    >
                      <option value="bike">Bike</option>
                      <option value="scooter">Scooter</option>
                      <option value="bicycle">Bicycle</option>
                      <option value="car">Car</option>
                    </select>
                  </div>

                  {/* Vehicle Number */}
                  <div>
                    <label className="block text-sm font-medium text-[#343838] mb-2">
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-[#C7C9CE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#055AF9]"
                      placeholder="MH12AB1234"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-[#343838] mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-[#C7C9CE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#055AF9]"
                      placeholder="Enter location"
                    />
                  </div>
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> A temporary password will be automatically generated and sent to the delivery boy's email address. They will be prompted to change it on first login.
                  </p>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-[#C7C9CE] text-[#343838] rounded-lg hover:bg-[#F0F3FB] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-[#055AF9] text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating...' : 'Create Delivery Boy'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
};

export default DeliveryBoys;