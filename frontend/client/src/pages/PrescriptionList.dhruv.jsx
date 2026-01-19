import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../theme";
import { FaFileMedical, FaCalendarAlt, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

const getTokenFromCookies = () => {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith("token="))
    ?.split("=")[1];
};

export default function PrescriptionListDhruv() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // DEMO DATA - Remove this and uncomment API call when backend is ready
    const demoData = [
      {
        _id: "prescription001",
        customerId: "user123",
        files: [{ url: "https://via.placeholder.com/100", uploadedAt: new Date() }],
        doctor: {
          name: "Dr. Rajesh Kumar",
          registrationNumber: "MH12345",
          hospital: "City Hospital"
        },
        medicinesMentioned: [
          { name: "Paracetamol", dosage: "500mg", duration: "5 days" },
          { name: "Amoxicillin", dosage: "250mg", duration: "7 days" }
        ],
        validation: {
          status: "approved",
          verifiedAt: new Date(),
          remarks: "Valid prescription"
        },
        status: "approved",
        notes: "For fever and infection",
        imageUrl: "https://via.placeholder.com/100",
        createdAt: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: "prescription002",
        customerId: "user123",
        files: [{ url: "https://via.placeholder.com/100", uploadedAt: new Date() }],
        doctor: {
          name: "Dr. Priya Sharma",
          registrationNumber: "MH67890",
          hospital: "Apollo Clinic"
        },
        medicinesMentioned: [
          { name: "Crocin", dosage: "650mg", duration: "3 days" },
          { name: "Vitamin C", dosage: "500mg", duration: "30 days" }
        ],
        validation: {
          status: "pending",
          remarks: "Under review"
        },
        status: "pending",
        notes: "Wellness check-up",
        imageUrl: "https://via.placeholder.com/100",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: "prescription003",
        customerId: "user123",
        files: [{ url: "https://via.placeholder.com/100", uploadedAt: new Date() }],
        doctor: {
          name: "Dr. Amit Patel",
          registrationNumber: "MH11223",
          hospital: "Fortis Hospital"
        },
        medicinesMentioned: [
          { name: "Azithromycin", dosage: "500mg", duration: "5 days" },
          { name: "Cetirizine", dosage: "10mg", duration: "10 days" }
        ],
        validation: {
          status: "approved",
          verifiedAt: new Date(),
          remarks: "Verified"
        },
        status: "approved",
        notes: "For respiratory infection",
        imageUrl: "https://via.placeholder.com/100",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    setTimeout(() => {
      setPrescriptions(demoData);
      setLoading(false);
    }, 500);

    // UNCOMMENT THIS WHEN BACKEND IS READY
    /*
    const token = getTokenFromCookies();

    fetch("http://localhost:5005/api/prescriptions", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        setPrescriptions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
    */
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: theme.background, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <FaSpinner className="animate-spin text-4xl" style={{ color: theme.primary }} />
      </div>
    );
  }

  return (
    <div style={{ background: theme.background, minHeight: "100vh", padding: 24 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h2 
          className="text-3xl font-bold mb-6" 
          style={{ color: theme.textPrimary }}
          variants={itemVariants}
        >
          <FaFileMedical className="inline mr-3" style={{ color: theme.primary }} />
          My Prescriptions
        </motion.h2>

        {prescriptions.length === 0 ? (
          <motion.div 
            className="text-center p-8 rounded-lg"
            style={{ 
              background: theme.surface, 
              border: `1px solid ${theme.border}` 
            }}
            variants={itemVariants}
          >
            <FaFileMedical className="text-6xl mx-auto mb-4" style={{ color: theme.textSecondary }} />
            <p style={{ color: theme.textSecondary }}>No prescriptions uploaded yet.</p>
            <button
              onClick={() => navigate("/dhruv/home")}
              className="mt-4 px-6 py-2 rounded-md text-white"
              style={{ background: theme.primary }}
            >
              Go to Home
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {prescriptions.map(prescription => (
              <motion.div
                key={prescription._id}
                className="p-4 rounded-lg cursor-pointer hover:shadow-lg transition-all"
                style={{
                  background: theme.surface,
                  border: `1px solid ${theme.border}`
                }}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate(`/dhruv/prescription/${prescription._id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2" style={{ color: theme.textPrimary }}>
                      Prescription #{prescription._id.slice(-6)}
                    </h3>
                    
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt style={{ color: theme.textSecondary }} />
                        <span style={{ color: theme.textSecondary, fontSize: 14 }}>
                          {new Date(prescription.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {prescription.status && (
                        <div className="flex items-center gap-2">
                          <FaCheckCircle style={{ color: theme.success }} />
                          <span style={{ color: theme.success, fontSize: 14 }}>
                            {prescription.status}
                          </span>
                        </div>
                      )}
                    </div>

                    {prescription.notes && (
                      <p style={{ color: theme.textSecondary, fontSize: 14 }}>
                        {prescription.notes}
                      </p>
                    )}
                  </div>

                  {prescription.imageUrl && (
                    <img
                      src={prescription.imageUrl}
                      alt="Prescription"
                      className="rounded-md ml-4"
                      style={{ 
                        width: 100, 
                        height: 100, 
                        objectFit: "cover",
                        border: `1px solid ${theme.border}`
                      }}
                    />
                  )}
                </div>

                <button
                  className="mt-3 px-4 py-2 rounded-md text-white text-sm"
                  style={{ background: theme.primary }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dhruv/prescription/${prescription._id}`);
                  }}
                >
                  View Medicines
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
