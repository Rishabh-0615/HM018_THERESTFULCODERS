import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaBox, 
  FaShoppingCart, 
  FaClock, 
  FaTruck, 
  FaCheckCircle, 
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaReceipt,
  FaPhone,
  FaEnvelope,
  FaPills,
  FaTimesCircle,
  FaHome,
  FaMoneyBillWave
} from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function OrdersDhruvEnhanced() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/orders/my-orders`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load orders");
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Processing":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Shipped":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <FaClock />;
      case "Processing":
        return <FaBox />;
      case "Shipped":
        return <FaTruck />;
      case "Delivered":
        return <FaCheckCircle />;
      case "Cancelled":
        return <FaTimesCircle />;
      default:
        return <FaClock />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <FaBox className="text-6xl text-blue-600" />
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
                <FaReceipt className="text-blue-600" />
                <span>My Orders</span>
              </h1>
              <p className="text-gray-600 mt-1">Track and manage your medicine orders</p>
            </div>
            <button
              onClick={() => navigate("/dhruv/home")}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all font-semibold"
            >
              <FaHome />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{orders.length}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <FaShoppingCart className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {orders.filter(o => o.status === "Pending").length}
                </p>
              </div>
              <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
                <FaClock className="text-2xl text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">In Transit</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">
                  {orders.filter(o => o.status === "Shipped" || o.status === "Processing").length}
                </p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                <FaTruck className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Delivered</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {orders.filter(o => o.status === "Delivered").length}
                </p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-2xl text-green-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <FaShoppingCart className="text-gray-300 text-8xl mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">Start shopping to place your first order</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dhruv/home")}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all font-semibold"
            >
              Browse Medicines
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {orders.map((order) => (
              <motion.div
                key={order._id}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Order Header */}
                <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white p-3 rounded-lg shadow">
                        <FaReceipt className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center space-x-2 mt-1">
                          <FaCalendarAlt className="text-xs" />
                          <span>Placed on {formatDate(order.createdAt)}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </span>
                      <p className="text-2xl font-bold text-blue-600 mt-2">₹{order.totalAmount?.toFixed(2) || "0.00"}</p>
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Delivery Address */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                        <FaMapMarkerAlt className="text-green-600" />
                        <span>Delivery Address</span>
                      </h4>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p className="font-medium">{order.customerDetails?.name || "Customer"}</p>
                        <p>{order.shippingAddress?.flatNo}, {order.shippingAddress?.street}</p>
                        {order.shippingAddress?.landmark && <p>Landmark: {order.shippingAddress.landmark}</p>}
                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                        <p className="flex items-center space-x-2 pt-2 border-t border-gray-300 mt-2">
                          <FaPhone className="text-blue-600" />
                          <span>{order.shippingAddress?.phone}</span>
                        </p>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                        <FaBox className="text-purple-600" />
                        <span>Order Details</span>
                      </h4>
                      <div className="text-sm text-gray-700 space-y-2">
                        <div className="flex justify-between">
                          <span>Items:</span>
                          <span className="font-semibold">{order.items?.length || 0} items</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment:</span>
                          <span className="font-semibold flex items-center space-x-1">
                            <FaMoneyBillWave className="text-green-600" />
                            <span>{order.paymentMethod || "COD"}</span>
                          </span>
                        </div>
                        {order.notes && (
                          <div className="pt-2 border-t border-gray-300 mt-2">
                            <p className="text-gray-600 italic">"{order.notes}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                      <FaPills className="text-blue-600" />
                      <span>Ordered Items</span>
                    </h4>
                    <div className="space-y-3">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center space-x-3">
                            {item.medicine?.image?.url && (
                              <img
                                src={item.medicine.image.url}
                                alt={item.medicine.name}
                                className="w-16 h-16 object-contain bg-gray-50 rounded p-1"
                              />
                            )}
                            <div>
                              <h5 className="font-semibold text-gray-800">{item.medicine?.name || "Medicine"}</h5>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                            <p className="font-bold text-blue-600">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mt-6 bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                      <FaTruck className="text-blue-600" />
                      <span>Order Timeline</span>
                    </h4>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                      <div className="space-y-4">
                        <TimelineItem
                          icon={<FaCheckCircle />}
                          title="Order Placed"
                          time={formatDate(order.createdAt)}
                          color="green"
                          active={true}
                        />
                        <TimelineItem
                          icon={<FaBox />}
                          title="Processing"
                          time={order.status === "Pending" ? "Pending..." : "In progress"}
                          color="blue"
                          active={order.status !== "Pending"}
                        />
                        <TimelineItem
                          icon={<FaTruck />}
                          title="Shipped"
                          time={order.status === "Shipped" || order.status === "Delivered" ? "On the way" : "Waiting..."}
                          color="purple"
                          active={order.status === "Shipped" || order.status === "Delivered"}
                        />
                        <TimelineItem
                          icon={<FaCheckCircle />}
                          title="Delivered"
                          time={order.status === "Delivered" ? "Completed" : "Pending..."}
                          color="green"
                          active={order.status === "Delivered"}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/dhruv/home")}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all font-semibold"
                    >
                      Order Again
                    </motion.button>
                    <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
                      Download Invoice
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Timeline Item Component
function TimelineItem({ icon, title, time, color, active }) {
  const colorClasses = {
    green: active ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600",
    blue: active ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600",
    purple: active ? "bg-purple-500 text-white" : "bg-gray-300 text-gray-600",
    yellow: active ? "bg-yellow-500 text-white" : "bg-gray-300 text-gray-600"
  };

  return (
    <div className="relative flex items-start space-x-4 pl-2">
      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${colorClasses[color]} shadow-lg`}>
        {icon}
      </div>
      <div className="flex-1 pb-2">
        <h5 className={`font-semibold ${active ? "text-gray-800" : "text-gray-500"}`}>{title}</h5>
        <p className="text-sm text-gray-600">{time}</p>
      </div>
    </div>
  );
}
