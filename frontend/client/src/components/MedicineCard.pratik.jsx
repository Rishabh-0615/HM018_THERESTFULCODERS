import React from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MedicineCardPratik = ({ medicine, onDelete, onToggle, isPharmacist }) => {
  return (
    <motion.div
      className="bg-[#FCFCFE] border border-[#C7C9CE] rounded-lg shadow-md overflow-hidden"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}
      <div className="h-48 bg-[#F0F3FB] flex items-center justify-center">
        {medicine.image?.url ? (
          <img
            src={medicine.image.url}
            alt={medicine.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-[#7F7E85] text-4xl">💊</div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-[#343838]">{medicine.name}</h3>
          {!medicine.isActive && (
            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
              Inactive
            </span>
          )}
        </div>

        {medicine.category && (
          <p className="text-sm text-[#7F7E85] mb-2">{medicine.category}</p>
        )}

        <p className="text-sm text-[#343838] mb-3 line-clamp-2">
          {medicine.description}
        </p>

        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-[#055AF9]">
            ₹{medicine.price}
          </span>
          <span className={`text-sm ${medicine.stock > 10 ? 'text-green-600' : 'text-red-600'}`}>
            Stock: {medicine.stock}
          </span>
        </div>

        {medicine.prescriptionRequired && (
          <div className="mb-3">
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              Prescription Required
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Link
            to={`/medicine.pratik/${medicine._id}`}
            className="flex-1 py-2 px-4 bg-[#055AF9] text-white text-center rounded-md hover:bg-[#013188] transition-colors"
          >
            View Details
          </Link>

          {isPharmacist && (
            <>
              <Link
                to={`/pharmacist/edit-medicine.pratik/${medicine._id}`}
                className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                <FaEdit />
              </Link>
              <button
                onClick={() => onToggle(medicine._id)}
                className={`p-2 ${medicine.isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md`}
              >
                {medicine.isActive ? <FaToggleOff /> : <FaToggleOn />}
              </button>
              <button
                onClick={() => onDelete(medicine._id)}
                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                <FaTrash />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MedicineCardPratik;
