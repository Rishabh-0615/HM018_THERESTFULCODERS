import React, { useState, useEffect } from 'react';
import { AdminData } from '../context/AdminContext';
import { motion } from 'framer-motion';
import { 
  FaUserCheck, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCalendar,
  FaSync,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import { LoadingAnimation } from './Loading';

const UnverifiedPharmacists = () => {
  const [pharmacists, setPharmacists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  
  const { fetchUnverifiedPharmacists, verifyPharmacist, rejectPharmacist } = AdminData();

  const loadPharmacists = async () => {
    setLoading(true);
    const data = await fetchUnverifiedPharmacists();
    setPharmacists(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPharmacists();
  }, []);

  const handleVerify = async (userId) => {
    setActionLoading(userId);
    const success = await verifyPharmacist(userId);
    if (success) {
      setPharmacists(pharmacists.filter(p => p._id !== userId));
    }
    setActionLoading(null);
  };

  const handleReject = async (userId) => {
    if (!window.confirm('Are you sure you want to reject this pharmacist?')) {
      return;
    }
    setActionLoading(userId);
    const success = await rejectPharmacist(userId);
    if (success) {
      setPharmacists(pharmacists.filter(p => p._id !== userId));
    }
    setActionLoading(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#343838]">Unverified Pharmacists</h1>
          <p className="text-[#7F7E85] mt-1">Pending requests: {pharmacists.length}</p>
        </div>
        <button 
          onClick={loadPharmacists}
          className="bg-[#055AF9] hover:bg-[#013188] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaSync size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="bg-[#FCFCFE] p-6 rounded-lg shadow-md border border-[#C7C9CE]">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingAnimation />
          </div>
        ) : pharmacists.length > 0 ? (
          <div className="space-y-4">
            {pharmacists.map((pharmacist) => (
              <div 
                key={pharmacist._id} 
                className="border border-[#C7C9CE] rounded-lg p-5 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#343838] mb-1">{pharmacist.name}</h3>
                    <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                      Pending
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <FaEnvelope className="text-[#7F7E85]" size={14} />
                    <span className="text-[#343838]">{pharmacist.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <FaPhone className="text-[#7F7E85]" size={14} />
                    <span className="text-[#343838]">{pharmacist.mobile}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <FaMapMarkerAlt className="text-[#7F7E85]" size={14} />
                    <span className="text-[#343838]">{pharmacist.location || 'Not provided'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <FaCalendar className="text-[#7F7E85]" size={14} />
                    <span className="text-[#343838]">{formatDate(pharmacist.createdAt)}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleVerify(pharmacist._id)}
                    disabled={actionLoading === pharmacist._id}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === pharmacist._id ? (
                      <LoadingAnimation />
                    ) : (
                      <>
                        <FaCheckCircle size={16} />
                        Approve
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleReject(pharmacist._id)}
                    disabled={actionLoading === pharmacist._id}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === pharmacist._id ? (
                      <LoadingAnimation />
                    ) : (
                      <>
                        <FaTimesCircle size={16} />
                        Reject
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaUserCheck size={48} className="mx-auto text-[#C7C9CE] mb-3" />
            <p className="text-[#7F7E85]">No pending pharmacist requests</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnverifiedPharmacists;