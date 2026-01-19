import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import NavbarPratik from '../components/Navbar.pratik';
import { FaUpload } from 'react-icons/fa';

const EditMedicinePratik = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    stock: '',
    manufacturer: '',
    prescriptionRequired: false,
    expiryDate: '',
    notes: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    "Antibiotics",
    "Painkillers",
    "Vitamins & Supplements",
    "Antiseptics",
    "Cardiovascular",
    "Diabetes Care",
    "Respiratory",
    "Gastrointestinal",
    "Dermatology",
    "Neurology",
    "Orthopedic",
    "Eye Care",
    "Ear Care",
    "Gynecology",
    "Pediatrics",
    "First Aid",
    "Herbal & Ayurvedic",
    "Homeopathy",
    "Other"
  ];

  useEffect(() => {
    fetchMedicine();
  }, [id]);

  const fetchMedicine = async () => {
    try {
      const { data } = await axios.get(`/api/pharma/medicine.pratik/${id}`);
      const medicine = data.medicine;
      
      setFormData({
        name: medicine.name || '',
        category: medicine.category || '',
        description: medicine.description || '',
        price: medicine.price || '',
        stock: medicine.stock || '',
        manufacturer: medicine.manufacturer || '',
        prescriptionRequired: medicine.prescriptionRequired || false,
        expiryDate: medicine.expiryDate ? new Date(medicine.expiryDate).toISOString().split('T')[0] : '',
        notes: medicine.notes || '',
      });
      
      if (medicine.image?.url) {
        setImagePreview(medicine.image.url);
      }
      
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch medicine details');
      navigate('/pharmacist/medicines.pratik');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      if (image) {
        formDataToSend.append('file', image);
      }

      await axios.put(`/api/pharma/medicine.pratik/${id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Medicine updated successfully');
      navigate('/pharmacist/medicines.pratik');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update medicine');
    } finally {
      setSubmitting(false);
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

  return (
    <div className="min-h-screen bg-[#F0F3FB]">
      <NavbarPratik />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-[#343838] mb-8">Edit Medicine</h1>

          <form onSubmit={handleSubmit} className="bg-[#FCFCFE] border border-[#C7C9CE] rounded-lg p-6 shadow-md space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-[#343838] mb-2">
                Medicine Image
              </label>
              <div className="flex items-center space-x-4">
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg" />
                )}
                <label className="cursor-pointer px-4 py-2 bg-[#055AF9] text-white rounded-md hover:bg-[#013188] flex items-center space-x-2">
                  <FaUpload />
                  <span>Change Image</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#343838] mb-1">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-4 border border-[#C7C9CE] bg-[#FCFCFE] rounded-md text-[#343838] focus:outline-none focus:ring-2 focus:ring-[#055AF9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#343838] mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-4 border border-[#C7C9CE] bg-[#FCFCFE] rounded-md text-[#343838] focus:outline-none focus:ring-2 focus:ring-[#055AF9]"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#343838] mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full py-2 px-4 border border-[#C7C9CE] bg-[#FCFCFE] rounded-md text-[#343838] focus:outline-none focus:ring-2 focus:ring-[#055AF9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#343838] mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full py-2 px-4 border border-[#C7C9CE] bg-[#FCFCFE] rounded-md text-[#343838] focus:outline-none focus:ring-2 focus:ring-[#055AF9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#343838] mb-1">
                  Manufacturer
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  className="w-full py-2 px-4 border border-[#C7C9CE] bg-[#FCFCFE] rounded-md text-[#343838] focus:outline-none focus:ring-2 focus:ring-[#055AF9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#343838] mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full py-2 px-4 border border-[#C7C9CE] bg-[#FCFCFE] rounded-md text-[#343838] focus:outline-none focus:ring-2 focus:ring-[#055AF9]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#343838] mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full py-2 px-4 border border-[#C7C9CE] bg-[#FCFCFE] rounded-md text-[#343838] focus:outline-none focus:ring-2 focus:ring-[#055AF9]"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-[#343838] mb-1">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full py-2 px-4 border border-[#C7C9CE] bg-[#FCFCFE] rounded-md text-[#343838] focus:outline-none focus:ring-2 focus:ring-[#055AF9]"
              />
            </div>

            {/* Prescription Required */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="prescriptionRequired"
                checked={formData.prescriptionRequired}
                onChange={handleChange}
                className="h-4 w-4 text-[#055AF9] focus:ring-[#055AF9] border-[#C7C9CE] rounded"
              />
              <label className="ml-2 block text-sm text-[#343838]">
                Prescription Required
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <motion.button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 px-6 bg-[#055AF9] text-white rounded-md hover:bg-[#013188] transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {submitting ? 'Updating...' : 'Update Medicine'}
              </motion.button>
              <button
                type="button"
                onClick={() => navigate('/pharmacist/medicines.pratik')}
                className="px-6 py-3 border border-[#C7C9CE] text-[#343838] rounded-md hover:bg-[#F0F3FB] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditMedicinePratik;
