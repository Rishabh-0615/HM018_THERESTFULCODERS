import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataDhruv } from "../context/UserContext.dhruv";
import { useCart } from "../context/cardContext.dhruv";
import {
  FaPills,
  FaFileMedical,
  FaSignOutAlt,
  FaUser,
  FaSearch,
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaReceipt,
  FaChartLine,
  FaBoxOpen,
  FaStar,
  FaTag,
  FaHeartbeat,
  FaShieldAlt,
  FaTruck,
  FaClock,
  FaCheckCircle,
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaBell,
  FaCalendarAlt
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

export default function HomeDhruvEnhanced() {
  const [medicines, setMedicines] = useState([]);
  const [refillSuggestions, setRefillSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("medicines");
  
  // AI Assistant States
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  
  // Reminder States
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedMedicineForReminder, setSelectedMedicineForReminder] = useState(null);
  const [reminderTimes, setReminderTimes] = useState(["08:00", "14:00", "20:00"]);

  const navigate = useNavigate();
  const { user, logoutUser } = UserDataDhruv();
  const { cartItems, addToCart, updateQuantity, totalAmount, totalItems } = useCart();

  const getItemQuantity = (medicineId) => {
    const item = cartItems.find(i => i._id === medicineId);
    return item ? item.quantity : 0;
  };

  useEffect(() => {
    /* FETCH MEDICINES */
    fetch("http://localhost:5005/api/medicines")
      .then(res => res.json())
      .then(data => {
        setMedicines(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    /* FETCH REFILL SUGGESTIONS */
    fetch("http://localhost:5005/api/orders/refill-suggestions", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setRefillSuggestions(data))
      .catch(() => {});
  }, []);

  // Categories extracted from medicines
  const categories = ["all", ...new Set(medicines.map(m => m.category || "general"))];

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || med.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Stats for customer dashboard (real + dummy for demo)
  const statsCards = [
    {
      title: "Items in Cart",
      value: totalItems,
      icon: <FaShoppingCart />,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50"
    },
    {
      title: "Cart Value",
      value: `₹${totalAmount.toFixed(0)}`,
      icon: <FaTag />,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgLight: "bg-green-50"
    },
    {
      title: "Total Orders",
      value: "12", // Dummy for demo
      icon: <FaReceipt />,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50"
    },
    {
      title: "Prescriptions",
      value: "3", // Dummy for demo
      icon: <FaFileMedical />,
      color: "bg-orange-500",
      textColor: "text-orange-600",
      bgLight: "bg-orange-50"
    }
  ];

  // Featured benefits
  const benefits = [
    { icon: <FaTruck />, title: "Free Delivery", desc: "On orders above ₹499" },
    { icon: <FaShieldAlt />, title: "100% Genuine", desc: "Verified medicines" },
    { icon: <FaClock />, title: "24/7 Support", desc: "Always here to help" },
    { icon: <FaCheckCircle />, title: "Easy Returns", desc: "7-day return policy" }
  ];

  // AI Assistant - Predefined Questions and Answers
  const aiQuestions = [
    {
      id: 1,
      question: "How do I upload a prescription?",
      answer: "Click on 'Prescriptions' in the top menu, then click 'Upload New' button. You can upload images or PDF files of your prescription. Our team will verify and approve it within 2 hours."
    },
    {
      id: 2,
      question: "What is the delivery time?",
      answer: "We offer free delivery within 24-48 hours for orders above ₹499. For urgent orders, we have express delivery available in 4-6 hours at ₹50 extra charge."
    },
    {
      id: 3,
      question: "How do I track my order?",
      answer: "Go to 'My Orders' from the top menu. Click on any order to see real-time tracking with delivery timeline. You'll also receive SMS and email notifications."
    },
    {
      id: 4,
      question: "What is your return policy?",
      answer: "We offer 7-day easy returns for unopened medicines. If you receive a damaged product, we'll replace it immediately at no cost. Contact support to initiate a return."
    },
    {
      id: 5,
      question: "Are medicines genuine?",
      answer: "Yes! We source 100% genuine medicines directly from licensed distributors. All products have proper batch numbers and expiry dates. We're licensed by FDA."
    },
    {
      id: 6,
      question: "Do you offer discounts?",
      answer: "Yes! Get 20% OFF on your first order. We also have ongoing deals, seasonal offers, and loyalty rewards. Check the homepage for current promotions."
    }
  ];

  const handleAIQuestion = (question) => {
    const q = aiQuestions.find(item => item.question === question);
    setChatMessages(prev => [
      ...prev,
      { type: 'user', text: question },
      { type: 'bot', text: q.answer }
    ]);
  };

  // Reminder Functions
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Notifications enabled!');
      }
    }
  };

  const setMedicineReminder = (medicine) => {
    setSelectedMedicineForReminder(medicine);
    setShowReminderModal(true);
  };

  const saveReminder = () => {
    if (!selectedMedicineForReminder) return;

    // Request notification permission
    requestNotificationPermission();

    // Save to localStorage
    const reminders = JSON.parse(localStorage.getItem('medicineReminders') || '[]');
    const newReminder = {
      medicineId: selectedMedicineForReminder._id,
      medicineName: selectedMedicineForReminder.name,
      times: reminderTimes,
      createdAt: new Date().toISOString()
    };
    
    reminders.push(newReminder);
    localStorage.setItem('medicineReminders', JSON.stringify(reminders));

    toast.success(`Reminder set for ${selectedMedicineForReminder.name}! You'll be notified at ${reminderTimes.join(', ')}`);
    setShowReminderModal(false);
    setSelectedMedicineForReminder(null);
  };

  const addReminderTime = () => {
    setReminderTimes([...reminderTimes, "12:00"]);
  };

  const updateReminderTime = (index, value) => {
    const newTimes = [...reminderTimes];
    newTimes[index] = value;
    setReminderTimes(newTimes);
  };

  const removeReminderTime = (index) => {
    setReminderTimes(reminderTimes.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* ENHANCED NAVBAR */}
      <nav className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="bg-blue-600 p-2 rounded-lg"
              >
                <FaPills className="text-white text-2xl" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">NexPharma</h1>
                <p className="text-xs text-gray-500">Your Health Partner</p>
              </div>
            </div>

            {/* Nav Actions */}
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/dhruv/prescriptions")}
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors"
              >
                <FaFileMedical className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Prescriptions</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/dhruv/orders")}
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors"
              >
                <FaReceipt className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">My Orders</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/dhruv/checkout")}
                className="relative flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all"
              >
                <FaShoppingCart />
                <span className="font-semibold">₹{totalAmount.toFixed(0)}</span>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.button>

              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <FaUser className="text-white text-sm" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name || "User"}</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => logoutUser(navigate)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FaSignOutAlt className="text-xl" />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name || "Guest"}! 👋
          </h1>
          <p className="text-gray-600">Find the best medicines at your fingertips</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} text-white p-3 rounded-lg shadow-md`}>
                  {card.icon}
                </div>
              </div>
              <h3 className="text-gray-500 text-sm mb-1">{card.title}</h3>
              <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Benefits Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-4 text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-blue-600 text-2xl mb-2 flex justify-center">{benefit.icon}</div>
              <h4 className="font-semibold text-gray-800 text-sm">{benefit.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{benefit.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Refill Suggestions Alert */}
        <AnimatePresence>
          {refillSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-lg p-6 shadow-md"
            >
              <div className="flex items-center space-x-3 mb-3">
                <FaHeartbeat className="text-orange-600 text-2xl" />
                <h4 className="font-bold text-orange-800 text-lg">Refill Reminders</h4>
              </div>
              <div className="space-y-2">
                {refillSuggestions.map((s, i) => (
                  <p key={i} className="text-orange-700 flex items-start space-x-2">
                    <span>•</span>
                    <span>{s.message}</span>
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Categories */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search medicines, vitamins, supplements..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-lg"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Medicines Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-blue-500 text-6xl mb-4"
            >
              <FaPills />
            </motion.div>
            <p className="text-gray-600 text-lg">Loading medicines...</p>
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div className="text-center py-20">
            <FaBoxOpen className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No medicines found</h3>
            <p className="text-gray-600">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedicines.map((med, index) => (
              <motion.div
                key={med._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, shadow: "2xl" }}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
              >
                {/* Medicine Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 p-4">
                  <img
                    src={med.image?.url}
                    alt={med.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                  {med.prescriptionRequired && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                      <FaFileMedical />
                      <span>Rx</span>
                    </span>
                  )}
                  <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                    <FaStar />
                    <span>4.5</span>
                  </div>
                </div>

                {/* Medicine Details */}
                <div className="p-4">
                  <h4 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">{med.name}</h4>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{med.notes}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">₹{med.price}</span>
                      <span className="text-gray-400 text-sm line-through ml-2">₹{(med.price * 1.2).toFixed(0)}</span>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">20% OFF</span>
                  </div>

                  {/* Add to Cart Controls */}
                  {getItemQuantity(med._id) === 0 ? (
                    <div className="space-y-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(med);
                          toast.success(`${med.name} added to cart!`, {
                            position: "bottom-right",
                            autoClose: 2000
                          });
                        }}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
                      >
                        <FaShoppingCart />
                        <span>Add to Cart</span>
                      </motion.button>
                      
                      {/* Set Reminder Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMedicineReminder(med);
                        }}
                        className="w-full py-2 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center space-x-2"
                      >
                        <FaBell />
                        <span>Set Reminder</span>
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-blue-50 border-2 border-blue-500 rounded-lg p-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const currentQty = getItemQuantity(med._id);
                          if (currentQty > 1) {
                            updateQuantity(med._id, currentQty - 1);
                          } else {
                            updateQuantity(med._id, 0);
                            toast.info("Item removed from cart");
                          }
                        }}
                        className="w-10 h-10 bg-white border-2 border-blue-500 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <FaMinus />
                      </motion.button>
                      <span className="text-2xl font-bold text-blue-600 mx-4">
                        {getItemQuantity(med._id)}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(med._id, getItemQuantity(med._id) + 1);
                          toast.success("Quantity updated!");
                        }}
                        className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all"
                      >
                        <FaPlus />
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* AI Assistant Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAIChat(!showAIChat)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:bg-blue-700 transition-all"
      >
        {showAIChat ? <FaTimes className="text-2xl" /> : <FaRobot className="text-2xl" />}
      </motion.button>

      {/* AI Chat Modal */}
      <AnimatePresence>
        {showAIChat && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <FaRobot className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-bold">NexPharma Assistant</h3>
                  <p className="text-xs text-blue-100">Always here to help</p>
                </div>
              </div>
              <button onClick={() => setShowAIChat(false)} className="hover:bg-blue-700 p-2 rounded-lg">
                <FaTimes />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {chatMessages.length === 0 ? (
                <div className="text-center py-8">
                  <FaRobot className="text-blue-600 text-5xl mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Hi! I'm your pharmacy assistant. How can I help you today?</p>
                  <p className="text-sm text-gray-500">Choose a question below or type your own</p>
                </div>
              ) : (
                chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-lg ${
                      msg.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border border-gray-200'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Questions */}
            <div className="border-t border-gray-200 p-4 bg-white max-h-64 overflow-y-auto">
              <p className="text-sm font-semibold text-gray-700 mb-3">Quick Questions:</p>
              <div className="space-y-2">
                {aiQuestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleAIQuestion(item.question)}
                    className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm text-gray-700 transition-colors border border-blue-200"
                  >
                    {item.question}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Medicine Reminder Modal */}
      <AnimatePresence>
        {showReminderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowReminderModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-blue-600 text-white p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold flex items-center space-x-2">
                    <FaBell />
                    <span>Set Medicine Reminder</span>
                  </h3>
                  <button 
                    onClick={() => setShowReminderModal(false)}
                    className="hover:bg-blue-700 p-2 rounded-lg transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
                <p className="text-blue-100 text-sm">{selectedMedicineForReminder?.name}</p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-blue-800 mb-2">
                    <FaCalendarAlt />
                    <span className="font-semibold">Reminder Schedule</span>
                  </div>
                  <p className="text-sm text-gray-600">Set times when you want to be reminded to take this medicine</p>
                </div>

                {/* Time Slots */}
                <div className="space-y-3">
                  {reminderTimes.map((time, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <FaClock className="text-blue-600" />
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => updateReminderTime(index, e.target.value)}
                        className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      />
                      {reminderTimes.length > 1 && (
                        <button
                          onClick={() => removeReminderTime(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={addReminderTime}
                  className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2 font-semibold"
                >
                  <FaPlus />
                  <span>Add Another Time</span>
                </button>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowReminderModal(false)}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveReminder}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                  >
                    <FaBell />
                    <span>Set Reminder</span>
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  * You'll receive browser notifications at selected times
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
