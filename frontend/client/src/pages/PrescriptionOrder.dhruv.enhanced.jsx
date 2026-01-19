import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/cardContext.dhruv";
import { 
  FaFileMedical, 
  FaPills,
  FaShoppingCart,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaUserMd,
  FaHospital,
  FaCalendarAlt,
  FaPlus,
  FaMinus,
  FaTrash
} from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function PrescriptionOrderDhruvEnhanced() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, updateQuantity, cartItems } = useCart();
  
  const prescription = location.state?.prescription;
  
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!prescription) {
      navigate("/dhruv/prescriptions");
      return;
    }

    // Fetch available medicines
    fetch("http://localhost:5005/api/medicines")
      .then(res => res.json())
      .then(data => {
        // Filter medicines that match prescription
        const matchedMedicines = data.filter(med => 
          prescription.medicines?.some(pm => 
            med.name.toLowerCase().includes(pm.toLowerCase().split(' ')[0])
          )
        );
        
        setMedicines(matchedMedicines);
        
        // Auto-select matched medicines with quantity 1
        setSelectedMedicines(
          matchedMedicines.map(med => ({
            ...med,
            quantity: 1,
            prescribedName: prescription.medicines.find(pm => 
              med.name.toLowerCase().includes(pm.toLowerCase().split(' ')[0])
            )
          }))
        );
        
        setLoading(false);
      })
      .catch(() => {
        // Demo medicines matching prescription
        const demoMedicines = [
          {
            _id: "demo1",
            name: "Paracetamol 500mg",
            price: 45,
            notes: "Pain relief and fever reducer",
            image: { url: "https://via.placeholder.com/100/e3f2fd/1976d2?text=Med" },
            prescriptionRequired: false
          },
          {
            _id: "demo2",
            name: "Azithromycin 250mg",
            price: 120,
            notes: "Antibiotic for bacterial infections",
            image: { url: "https://via.placeholder.com/100/f3e5f5/7b1fa2?text=Med" },
            prescriptionRequired: true
          },
          {
            _id: "demo3",
            name: "Vitamin D3 60000 IU",
            price: 85,
            notes: "Bone health supplement",
            image: { url: "https://via.placeholder.com/100/fff3e0/f57c00?text=Med" },
            prescriptionRequired: false
          }
        ];
        
        setMedicines(demoMedicines);
        setSelectedMedicines(
          demoMedicines.map(med => ({
            ...med,
            quantity: 1,
            prescribedName: med.name
          }))
        );
        setLoading(false);
      });
  }, [prescription, navigate]);

  const updateSelectedQuantity = (id, delta) => {
    setSelectedMedicines(prev => 
      prev.map(item => 
        item._id === id 
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const addAllToCart = () => {
    if (selectedMedicines.length === 0) {
      toast.warning("No medicines selected");
      return;
    }

    selectedMedicines.forEach(med => {
      addToCart(med, med.quantity);
    });
    
    toast.success(`${selectedMedicines.length} medicines added to cart!`, {
      position: "top-center"
    });
    
    setTimeout(() => {
      navigate("/dhruv/checkout");
    }, 1000);
  };

  const calculateTotal = () => {
    return selectedMedicines.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  if (!prescription) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaPills className="text-6xl text-blue-600" />
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
                <span>Order from Prescription</span>
              </h1>
              <p className="text-gray-600 mt-1">Review and order prescribed medicines</p>
            </div>
            <button
              onClick={() => navigate("/dhruv/prescriptions")}
              className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg shadow hover:shadow-lg transition-all font-semibold"
            >
              <FaArrowLeft />
              <span>Back to Prescriptions</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prescription Details Card */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <FaFileMedical className="text-blue-600" />
                <span>Prescription Details</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <FaUserMd className="text-blue-600 text-2xl" />
                  <div>
                    <p className="text-xs text-gray-600">Doctor</p>
                    <p className="font-semibold text-gray-800">{prescription.doctorName}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <FaHospital className="text-purple-600 text-2xl" />
                  <div>
                    <p className="text-xs text-gray-600">Hospital</p>
                    <p className="font-semibold text-gray-800">{prescription.hospitalName}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-green-50 rounded-lg p-3 border border-green-200">
                  <FaCalendarAlt className="text-green-600 text-2xl" />
                  <div>
                    <p className="text-xs text-gray-600">Date Issued</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(prescription.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <FaPills className="text-orange-600 text-2xl" />
                  <div>
                    <p className="text-xs text-gray-600">Diagnosis</p>
                    <p className="font-semibold text-gray-800">{prescription.diagnosis}</p>
                  </div>
                </div>
              </div>

              {prescription.medicines?.length > 0 && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="font-semibold text-gray-800 mb-2">Prescribed Medicines:</p>
                  <div className="space-y-1">
                    {prescription.medicines.map((med, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>{med}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Available Medicines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <FaPills className="text-green-600" />
                <span>Available Medicines ({selectedMedicines.length})</span>
              </h2>

              {medicines.length === 0 ? (
                <div className="text-center py-8">
                  <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />
                  <p className="text-gray-600">No matching medicines found in our inventory</p>
                  <button
                    onClick={() => navigate("/dhruv/home")}
                    className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                  >
                    Browse All Medicines
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {medicines.map((med) => {
                    const selected = selectedMedicines.find(s => s._id === med._id);
                    const quantity = selected?.quantity || 0;

                    return (
                      <motion.div
                        key={med._id}
                        layout
                        className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all ${
                          quantity > 0 
                            ? "bg-blue-50 border-blue-300" 
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <img
                          src={med.image?.url}
                          alt={med.name}
                          className="w-20 h-20 object-contain bg-white rounded p-2"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800">{med.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{med.notes}</p>
                          {selected?.prescribedName && (
                            <p className="text-xs text-blue-600 mt-1 flex items-center space-x-1">
                              <FaCheckCircle />
                              <span>Matches: {selected.prescribedName}</span>
                            </p>
                          )}
                          <div className="flex items-center space-x-3 mt-2">
                            <span className="text-xl font-bold text-blue-600">₹{med.price}</span>
                            {med.prescriptionRequired && (
                              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold">
                                Rx Required
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {quantity === 0 ? (
                            <button
                              onClick={() => {
                                setSelectedMedicines(prev => [...prev, { ...med, quantity: 1, prescribedName: med.name }]);
                                toast.success("Added to selection");
                              }}
                              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all font-semibold flex items-center space-x-2"
                            >
                              <FaPlus />
                              <span>Add</span>
                            </button>
                          ) : (
                            <div className="flex items-center space-x-2 bg-white border-2 border-blue-500 rounded-lg p-1">
                              <button
                                onClick={() => updateSelectedQuantity(med._id, -1)}
                                className="w-10 h-10 flex items-center justify-center rounded text-blue-600 hover:bg-blue-50"
                              >
                                <FaMinus />
                              </button>
                              <span className="font-bold text-lg px-3">{quantity}</span>
                              <button
                                onClick={() => updateSelectedQuantity(med._id, 1)}
                                className="w-10 h-10 flex items-center justify-center rounded bg-blue-500 text-white hover:bg-blue-600"
                              >
                                <FaPlus />
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 sticky top-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
              
              {selectedMedicines.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaShoppingCart className="text-5xl mx-auto mb-4 text-gray-300" />
                  <p>No medicines selected</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {selectedMedicines.map((item) => (
                      <div key={item._id} className="flex justify-between items-start text-sm border-b border-gray-200 pb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-600">₹{item.price} × {item.quantity}</p>
                        </div>
                        <span className="font-bold text-blue-600">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">₹{calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg font-bold text-gray-800">
                        <span>Total</span>
                        <span className="text-blue-600">₹{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addAllToCart}
                    className="w-full mt-6 py-4 bg-green-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-green-700 transition-all font-bold flex items-center justify-center space-x-2 text-lg"
                  >
                    <FaShoppingCart />
                    <span>Add to Cart & Checkout</span>
                  </motion.button>

                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800 font-medium">
                      ✓ Prescription will be verified before dispatch
                    </p>
                  </div>
                </>
              )}

              <div className="mt-4 text-xs text-gray-500 space-y-1">
                <p>✓ 100% Genuine Medicines</p>
                <p>✓ Free Home Delivery</p>
                <p>✓ Easy Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
