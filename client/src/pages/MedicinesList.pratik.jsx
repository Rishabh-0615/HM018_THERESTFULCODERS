import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import NavbarPratik from '../components/Navbar.pratik';
import MedicineCardPratik from '../components/MedicineCard.pratik';
import { UserData } from '../context/UserContext';

const MedicinesListPratik = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const { user } = UserData();

  useEffect(() => {
    fetchMedicines();
    fetchCategories();
  }, [searchTerm, category]);

  const fetchMedicines = async () => {
    try {
      const { data } = await axios.get('/api/pharma/medicines.pratik', {
        params: { search: searchTerm, category }
      });
      setMedicines(data.medicines);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch medicines');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/pharma/categories.pratik');
      setCategories(data.categories);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await axios.delete(`/api/pharma/medicine.pratik/${id}`);
        toast.success('Medicine deleted successfully');
        fetchMedicines();
      } catch (error) {
        toast.error('Failed to delete medicine');
      }
    }
  };

  const handleToggle = async (id) => {
    try {
      await axios.patch(`/api/pharma/medicine.pratik/${id}/toggle-status.pratik`);
      toast.success('Medicine status updated');
      fetchMedicines();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F3FB]">
      <NavbarPratik />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#343838] mb-6">Medicines</h1>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-4 border border-[#C7C9CE] bg-[#FCFCFE] rounded-md text-[#343838] focus:outline-none focus:ring-2 focus:ring-[#055AF9]"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-3 px-4 border border-[#C7C9CE] bg-[#FCFCFE] rounded-md text-[#343838] focus:outline-none focus:ring-2 focus:ring-[#055AF9]"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#055AF9]"></div>
          </div>
        ) : medicines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#7F7E85] text-lg">No medicines found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {medicines.map((medicine) => (
              <MedicineCardPratik
                key={medicine._id}
                medicine={medicine}
                onDelete={handleDelete}
                onToggle={handleToggle}
                isPharmacist={user?.role === 'pharmacist'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicinesListPratik;
