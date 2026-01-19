import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import NavbarPratik from '../components/Navbar.pratik';
import { FaArrowLeft, FaPills, FaIndustry, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
import { UserData } from '../context/UserContext';

const MedicineDetailPratik = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = UserData();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicine();
  }, [id]);

  const fetchMedicine = async () => {
    try {
      const { data } = await axios.get(`/api/pharma/medicine.pratik/${id}`);
      setMedicine(data.medicine);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch medicine details');
      navigate('/pharmacist/medicines.pratik');
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

  if (!medicine) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F0F3FB]">
      <NavbarPratik />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-[#055AF9] hover:text-[#013188] mb-6"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>

          <div className="bg-[#FCFCFE] border border-[#C7C9CE] rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Image Section */}
              <div className="flex items-center justify-center bg-[#F0F3FB] rounded-lg p-8">
                {medicine.image?.url ? (
                  <img
                    src={medicine.image.url}
                    alt={medicine.name}
                    className="max-h-96 object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-[#7F7E85] text-9xl">💊</div>
                )}
              </div>

              {/* Details Section */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h1 className="text-3xl font-bold text-[#343838]">{medicine.name}</h1>
                    {!medicine.isActive && (
                      <span className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                  {medicine.category && (
                    <p className="text-lg text-[#7F7E85]">{medicine.category}</p>
                  )}
                </div>

                {/* Price and Stock */}
                <div className="flex items-center space-x-8">
                  <div>
                    <p className="text-sm text-[#7F7E85]">Price</p>
                    <p className="text-3xl font-bold text-[#055AF9]">₹{medicine.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#7F7E85]">Stock</p>
                    <p className={`text-2xl font-bold ${medicine.stock > 10 ? 'text-green-600' : 'text-red-600'}`}>
                      {medicine.stock} units
                    </p>
                  </div>
                </div>

                {/* Prescription Badge */}
                {medicine.prescriptionRequired && (
                  <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <FaExclamationTriangle className="text-yellow-600" />
                    <span className="text-yellow-800 font-medium">Prescription Required</span>
                  </div>
                )}

                {/* Additional Info */}
                <div className="space-y-3">
                  {medicine.manufacturer && (
                    <div className="flex items-center space-x-3">
                      <FaIndustry className="text-[#7F7E85]" />
                      <div>
                        <p className="text-xs text-[#7F7E85]">Manufacturer</p>
                        <p className="text-[#343838] font-medium">{medicine.manufacturer}</p>
                      </div>
                    </div>
                  )}

                  {medicine.expiryDate && (
                    <div className="flex items-center space-x-3">
                      <FaCalendarAlt className="text-[#7F7E85]" />
                      <div>
                        <p className="text-xs text-[#7F7E85]">Expiry Date</p>
                        <p className="text-[#343838] font-medium">
                          {new Date(medicine.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {medicine.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#343838] mb-2">Description</h3>
                    <p className="text-[#7F7E85] leading-relaxed">{medicine.description}</p>
                  </div>
                )}

                {/* Contents/Ingredients */}
                {medicine.contents && medicine.contents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#343838] mb-2">Ingredients</h3>
                    <div className="flex flex-wrap gap-2">
                      {medicine.contents.map((content, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#F0F3FB] text-[#343838] rounded-full text-sm"
                        >
                          {content.ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {medicine.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#343838] mb-2">Additional Notes</h3>
                    <p className="text-[#7F7E85] leading-relaxed">{medicine.notes}</p>
                  </div>
                )}

                {/* Action Buttons for Pharmacist */}
                {user?.role === 'pharmacist' && (
                  <div className="flex space-x-4 pt-4">
                    <Link
                      to={`/pharmacist/edit-medicine.pratik/${medicine._id}`}
                      className="flex-1 py-3 px-6 bg-[#055AF9] text-white text-center rounded-md hover:bg-[#013188] transition-colors"
                    >
                      Edit Medicine
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MedicineDetailPratik;
