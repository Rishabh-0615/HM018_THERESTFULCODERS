import { useEffect, useState } from "react";
import { useCart } from "../context/cardContext.dhruv";
import { useNavigate } from "react-router-dom";
import { 
  FaShoppingCart, 
  FaTrash, 
  FaMinus, 
  FaPlus, 
  FaBox,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaArrowRight,
  FaHome,
  FaPhone,
  FaCity,
  FaMapPin,
  FaMoneyBillWave,
  FaUniversity,
  FaWallet,
  FaFileUpload
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

export default function CheckoutDhruvEnhanced() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Cart, 2: Address, 3: Payment
  const [prescriptionFile, setPrescriptionFile] = useState(null);

  const [address, setAddress] = useState({
    flatNo: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    phone: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [orderNotes, setOrderNotes] = useState("");

  const navigate = useNavigate();

  // Debug: Log cart items on mount
  useEffect(() => {
    console.log("Checkout - Cart items:", cartItems);
    console.log("Checkout - Total amount:", totalAmount);
  }, [cartItems, totalAmount]);

  // Safety Check
  useEffect(() => {
    if (cartItems.length === 0) return;

    fetch(`${API_BASE_URL}/api/orders/check-safety`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        medicines: cartItems.map(item => ({
          medicineId: item._id,
          quantity: item.quantity
        }))
      })
    })
      .then(res => res.json())
      .then(data => setWarnings(data.warnings || []))
      .catch(() => {});
  }, [cartItems]);

  const hasRxRequired = cartItems.some(item => item.prescriptionRequired);

  const handleQuantityChange = (id, delta) => {
    const item = cartItems.find(i => i._id === id);
    if (item) {
      const newQty = item.quantity + delta;
      if (newQty > 0) {
        updateQuantity(id, newQty);
      }
    }
  };

  const placeOrder = async () => {
    // Validation
    if (!address.flatNo || !address.street || !address.city || !address.state || !address.pincode || !address.phone) {
      toast.error("Please fill all address fields");
      return;
    }

    if (hasRxRequired && !prescriptionFile) {
      toast.error("Prescription required for some medicines");
      return;
    }

    setLoading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      const orderData = {
        medicines: cartItems.map(item => ({
          medicineId: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: address,
        totalAmount,
        paymentMethod,
        notes: orderNotes
      };

      formData.append("orderData", JSON.stringify(orderData));
      
      if (prescriptionFile) {
        formData.append("prescription", prescriptionFile);
      }

      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        credentials: "include",
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        clearCart();
        toast.success("Order placed successfully! 🎉", {
          position: "top-center",
          autoClose: 3000
        });
        setTimeout(() => {
          navigate("/dhruv/orders");
        }, 1500);
      } else {
        const error = await res.json();
        toast.error(error.message || "Order failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <FaShoppingCart className="text-gray-300 text-8xl mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some medicines to get started</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dhruv/home")}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all font-semibold"
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const steps = [
    { num: 1, title: "Cart Review", icon: <FaShoppingCart /> },
    { num: 2, title: "Delivery Address", icon: <FaMapMarkerAlt /> },
    { num: 3, title: "Payment", icon: <FaCreditCard /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
                <FaShoppingCart className="text-blue-600" />
                <span>Secure Checkout</span>
              </h1>
              <p className="text-gray-600 mt-1">Complete your order in just {4 - step} simple steps</p>
            </div>
            <button
              onClick={() => navigate("/dhruv/home")}
              className="text-gray-600 hover:text-gray-800 flex items-center space-x-2"
            >
              <FaArrowLeft />
              <span>Back to Shop</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div key={s.num} className="flex-1 flex items-center">
                <div className="flex flex-col items-center w-full">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-2 ${
                      step >= s.num
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > s.num ? <FaCheckCircle /> : s.icon}
                  </motion.div>
                  <span className={`text-sm font-medium ${step >= s.num ? "text-gray-800" : "text-gray-500"}`}>
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded ${
                    step > s.num ? "bg-blue-600" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {/* STEP 1: Cart Review */}
              {step === 1 && (
                <motion.div
                  key="cart"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                    <FaBox className="text-blue-600" />
                    <span>Review Your Cart ({cartItems.length} items)</span>
                  </h2>

                  {/* Safety Warnings */}
                  {warnings.length > 0 && (
                    <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                      <div className="flex items-start space-x-3">
                        <FaExclamationTriangle className="text-yellow-600 text-xl mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-yellow-800 mb-2">Safety Alerts</h4>
                          {warnings.map((w, i) => (
                            <p key={i} className="text-yellow-700 text-sm mb-1">• {w}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item._id}
                        layout
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <img
                          src={item.image?.url}
                          alt={item.name}
                          className="w-20 h-20 object-contain rounded bg-white p-2"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
                          <div className="flex items-center space-x-3 mt-2">
                            <span className="text-xl font-bold text-blue-600">₹{item.price}</span>
                            {item.prescriptionRequired && (
                              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold">
                                Rx Required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2 bg-white border-2 border-blue-500 rounded-lg p-1">
                            <button
                              onClick={() => handleQuantityChange(item._id, -1)}
                              className="w-8 h-8 flex items-center justify-center rounded text-blue-600 hover:bg-blue-50"
                            >
                              <FaMinus />
                            </button>
                            <span className="font-bold text-lg px-2">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item._id, 1)}
                              className="w-8 h-8 flex items-center justify-center rounded bg-blue-500 text-white hover:bg-blue-600"
                            >
                              <FaPlus />
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              removeFromCart(item._id);
                              toast.info("Item removed from cart");
                            }}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(2)}
                    className="w-full mt-6 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Proceed to Address</span>
                    <FaArrowRight />
                  </motion.button>
                </motion.div>
              )}

              {/* STEP 2: Delivery Address */}
              {step === 2 && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-green-600" />
                    <span>Delivery Address</span>
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                        <FaHome />
                        <span>Flat / House No. *</span>
                      </label>
                      <input
                        type="text"
                        value={address.flatNo}
                        onChange={(e) => setAddress({...address, flatNo: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="Flat 101, Building A"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                        <FaMapMarkerAlt />
                        <span>Street / Area *</span>
                      </label>
                      <input
                        type="text"
                        value={address.street}
                        onChange={(e) => setAddress({...address, street: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="MG Road"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={address.landmark}
                        onChange={(e) => setAddress({...address, landmark: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="Near City Mall"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                        <FaCity />
                        <span>City *</span>
                      </label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({...address, city: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="Mumbai"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={(e) => setAddress({...address, state: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="Maharashtra"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                        <FaMapPin />
                        <span>Pincode *</span>
                      </label>
                      <input
                        type="text"
                        value={address.pincode}
                        onChange={(e) => setAddress({...address, pincode: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="400001"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                        <FaPhone />
                        <span>Phone Number *</span>
                      </label>
                      <input
                        type="tel"
                        value={address.phone}
                        onChange={(e) => setAddress({...address, phone: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 mt-6">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
                    >
                      <FaArrowLeft />
                      <span>Back to Cart</span>
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(3)}
                      className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
                    >
                      <span>Proceed to Payment</span>
                      <FaArrowRight />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Payment */}
              {step === 3 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                      <FaCreditCard className="text-purple-600" />
                      <span>Payment Method</span>
                    </h2>

                    <div className="space-y-4">
                      <label className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === "COD" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-300"
                      }`}>
                        <input
                          type="radio"
                          name="payment"
                          value="COD"
                          checked={paymentMethod === "COD"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-5 h-5"
                        />
                        <FaMoneyBillWave className="text-2xl text-green-600" />
                        <div>
                          <div className="font-semibold text-gray-800">Cash on Delivery</div>
                          <div className="text-sm text-gray-600">Pay when you receive</div>
                        </div>
                      </label>

                      <label className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === "Online" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-300"
                      }`}>
                        <input
                          type="radio"
                          name="payment"
                          value="Online"
                          checked={paymentMethod === "Online"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-5 h-5"
                        />
                        <FaWallet className="text-2xl text-blue-600" />
                        <div>
                          <div className="font-semibold text-gray-800">UPI / Cards / Net Banking</div>
                          <div className="text-sm text-gray-600">Secure online payment</div>
                        </div>
                      </label>

                      <label className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === "Insurance" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-300"
                      }`}>
                        <input
                          type="radio"
                          name="payment"
                          value="Insurance"
                          checked={paymentMethod === "Insurance"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-5 h-5"
                        />
                        <FaUniversity className="text-2xl text-purple-600" />
                        <div>
                          <div className="font-semibold text-gray-800">Insurance Claim</div>
                          <div className="text-sm text-gray-600">Use your health insurance</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Prescription Upload */}
                  {hasRxRequired && (
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                        <FaFileUpload className="text-red-600" />
                        <span>Upload Prescription (Required)</span>
                      </h3>
                      <input
                        type="file"
                        onChange={(e) => setPrescriptionFile(e.target.files[0])}
                        accept="image/*,.pdf"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        Upload a valid prescription for medicines marked as "Rx Required"
                      </p>
                    </div>
                  )}

                  {/* Order Notes */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Order Notes (Optional)
                    </h3>
                    <textarea
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Any special instructions for delivery..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      rows="3"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setStep(2)}
                      disabled={loading}
                      className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
                    >
                      <FaArrowLeft />
                      <span>Back to Address</span>
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={placeOrder}
                      disabled={loading}
                      className="flex-1 py-4 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 text-lg"
                    >
                      {loading ? (
                        <>
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                            <FaCheckCircle />
                          </motion.div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <FaCheckCircle />
                          <span>Place Order - ₹{totalAmount.toFixed(2)}</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 sticky top-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total Amount</span>
                    <span className="text-blue-600">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800 font-medium">
                  🎉 You're saving ₹{(totalAmount * 0.2).toFixed(0)} on this order!
                </p>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>✓ 100% Genuine Medicines</p>
                <p>✓ Easy Returns & Refunds</p>
                <p>✓ Secure Payments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
