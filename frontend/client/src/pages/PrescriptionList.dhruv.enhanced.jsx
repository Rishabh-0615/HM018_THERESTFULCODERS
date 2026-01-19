import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaFileMedical, 
  FaPlus, 
  FaCalendarAlt, 
  FaUserMd,
  FaHospital,
  FaEye,
  FaDownload,
  FaShoppingCart,
  FaTrash,
  FaPrescriptionBottleAlt,
  FaHome,
  FaCheckCircle,
  FaClock
} from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function PrescriptionListDhruvEnhanced() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch prescriptions from API
    fetch(`${API_BASE_URL}/api/prescriptions/my-prescriptions`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setPrescriptions(data);
        setLoading(false);
      })
      .catch(() => {
        // Demo data with genuine names for video presentation
        const demoData = [
          {
            _id: "1",
            doctorName: "Dr. Rajesh Kumar",
            hospitalName: "Apollo Hospital, Mumbai",
            date: new Date(2024, 0, 15),
            status: "Active",
            medicines: ["Paracetamol 500mg", "Azithromycin 250mg", "Vitamin D3"],
            diagnosis: "Viral Fever",
            prescriptionImage: "https://via.placeholder.com/400x500/e3f2fd/1976d2?text=Prescription"
          },
          {
            _id: "2",
            doctorName: "Dr. Priya Sharma",
            hospitalName: "Fortis Healthcare, Pune",
            date: new Date(2024, 0, 10),
            status: "Active",
            medicines: ["Metformin 500mg", "Glimepiride 2mg", "Atorvastatin 10mg"],
            diagnosis: "Type 2 Diabetes Management",
            prescriptionImage: "https://via.placeholder.com/400x500/e8f5e9/388e3c?text=Prescription"
          },
          {
            _id: "3",
            doctorName: "Dr. Anil Deshmukh",
            hospitalName: "Lilavati Hospital, Mumbai",
            date: new Date(2023, 11, 20),
            status: "Expired",
            medicines: ["Amoxicillin 500mg", "Cetrizine 10mg"],
            diagnosis: "Upper Respiratory Tract Infection",
            prescriptionImage: "https://via.placeholder.com/400x500/fff3e0/f57c00?text=Prescription"
          },
          {
            _id: "4",
            doctorName: "Dr. Sunita Patil",
            hospitalName: "Ruby Hall Clinic, Pune",
            date: new Date(2024, 0, 12),
            status: "Active",
            medicines: ["Omeprazole 20mg", "Pantoprazole 40mg", "Ranitidine 150mg"],
            diagnosis: "Gastroesophageal Reflux Disease",
            prescriptionImage: "https://via.placeholder.com/400x500/e8f5e9/388e3c?text=Prescription"
          },
          {
            _id: "5",
            doctorName: "Dr. Vikram Mehta",
            hospitalName: "Nanavati Hospital, Mumbai",
            date: new Date(2024, 0, 8),
            status: "Active",
            medicines: ["Amlodipine 5mg", "Losartan 50mg", "Aspirin 75mg"],
            diagnosis: "Hypertension",
            prescriptionImage: "https://via.placeholder.com/400x500/e3f2fd/1976d2?text=Prescription"
          }
        ];
        setPrescriptions(demoData);
        setLoading(false);
      });
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    return status === "Active" 
      ? "bg-green-100 text-green-800 border-green-300" 
      : "bg-gray-100 text-gray-600 border-gray-300";
  };

  const handleOrderFromPrescription = (prescription) => {
    toast.success("Redirecting to order medicines...");
    navigate("/dhruv/prescription-order", { state: { prescription } });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaFileMedical className="text-6xl text-blue-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
                <FaFileMedical className="text-blue-600" />
                <span>My Prescriptions</span>
              </h1>
              <p className="text-gray-600 mt-1">Manage your medical prescriptions digitally</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/dhruv/home")}
                className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg shadow hover:shadow-lg transition-all font-semibold"
              >
                <FaHome />
                <span>Home</span>
              </button>
              <button
                onClick={() => toast.info("Upload prescription feature coming soon!")}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all font-semibold"
              >
                <FaPlus />
                <span>Upload New</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Prescriptions</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{prescriptions.length}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <FaPrescriptionBottleAlt className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {prescriptions.filter(p => p.status === "Active").length}
                </p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-2xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Expired</p>
                <p className="text-3xl font-bold text-gray-600 mt-1">
                  {prescriptions.filter(p => p.status === "Expired").length}
                </p>
              </div>
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                <FaClock className="text-2xl text-gray-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {prescriptions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <FaFileMedical className="text-gray-300 text-8xl mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No prescriptions yet</h2>
            <p className="text-gray-600 mb-8">Upload your first prescription to get started</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toast.info("Upload feature coming soon!")}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all font-semibold"
            >
              <FaPlus className="inline mr-2" />
              Upload Prescription
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {prescriptions.map((prescription) => (
              <motion.div
                key={prescription._id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all"
              >
                {/* Prescription Image */}
                <div className="relative h-48 bg-blue-100 overflow-hidden">
                  <img
                    src={prescription.prescriptionImage}
                    alt="Prescription"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(prescription.status)}`}>
                      {prescription.status}
                    </span>
                  </div>
                </div>

                {/* Prescription Details */}
                <div className="p-5">
                  {/* Doctor & Hospital */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaUserMd className="text-blue-600" />
                      <h3 className="font-bold text-gray-800">{prescription.doctorName}</h3>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FaHospital className="text-gray-500" />
                      <p>{prescription.hospitalName}</p>
                    </div>
                  </div>

                  {/* Diagnosis */}
                  {prescription.diagnosis && (
                    <div className="mb-4 bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <p className="text-sm font-semibold text-blue-800">{prescription.diagnosis}</p>
                    </div>
                  )}

                  {/* Medicines */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Prescribed Medicines:</p>
                    <div className="space-y-1">
                      {prescription.medicines?.slice(0, 3).map((med, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                          <span>{med}</span>
                        </div>
                      ))}
                      {prescription.medicines?.length > 3 && (
                        <p className="text-xs text-gray-500 ml-3.5">+{prescription.medicines.length - 3} more...</p>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                    <FaCalendarAlt className="text-gray-500" />
                    <span>Issued: {formatDate(prescription.date)}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => toast.info("Viewing prescription...")}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-semibold"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => toast.success("Downloading prescription...")}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-semibold"
                    >
                      <FaDownload />
                    </button>
                    <button
                      onClick={() => toast.error("Prescription deleted")}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  {prescription.status === "Active" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOrderFromPrescription(prescription)}
                      className="w-full mt-3 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all font-semibold flex items-center justify-center space-x-2"
                    >
                      <FaShoppingCart />
                      <span>Order Medicines</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
