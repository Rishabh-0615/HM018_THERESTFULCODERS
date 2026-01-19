import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../theme";
import { motion } from "framer-motion";
import { 
  FaBox, 
  FaShoppingCart, 
  FaMapMarkerAlt, 
  FaCreditCard,
  FaCalendar,
  FaHome,
  FaReceipt
} from "react-icons/fa";
import OrderTimeline from "./OrderTimeline.dhruv";

const getTokenFromCookies = () => {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith("token="))
    ?.split("=")[1];
};

export default function OrdersDhruv() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5005/api/orders/my-orders", {
      credentials: "include" // Send cookies with request
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ 
        background: theme.background, 
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ textAlign: "center" }}>
          <FaBox style={{ fontSize: 48, color: theme.primary, marginBottom: 16 }} />
          <p style={{ color: theme.textPrimary }}>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: theme.background, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        background: theme.surface,
        borderBottom: `1px solid ${theme.border}`,
        padding: "20px 32px"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ color: theme.textPrimary, fontSize: 28, margin: 0 }}>
            <FaReceipt style={{ marginRight: 12 }} />
            My Orders
          </h1>
          <button
            onClick={() => navigate("/dhruv/home")}
            style={{
              padding: "10px 20px",
              background: theme.primary,
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              fontWeight: 600
            }}
          >
            <FaHome /> Back to Home
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 32 }}>
        {orders.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: 60,
            background: theme.surface,
            borderRadius: 12,
            border: `1px solid ${theme.border}`
          }}>
            <FaShoppingCart style={{ fontSize: 64, color: theme.textSecondary, marginBottom: 16 }} />
            <h3 style={{ color: theme.textPrimary, marginBottom: 8 }}>No orders yet</h3>
            <p style={{ color: theme.textSecondary, marginBottom: 24 }}>
              Start shopping to see your orders here
            </p>
            <button
              onClick={() => navigate("/dhruv/home")}
              style={{
                padding: "12px 24px",
                background: theme.primary,
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 600
              }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 12,
                  padding: 24,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                }}
              >
                {/* Order Header */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "flex-start",
                  marginBottom: 20,
                  paddingBottom: 16,
                  borderBottom: `1px solid ${theme.border}`
                }}>
                  <div>
                    <h3 style={{ color: theme.textPrimary, marginBottom: 8 }}>
                      Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: theme.textSecondary, fontSize: 14 }}>
                      <FaCalendar />
                      <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 4 }}>
                      Total Amount
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: theme.primary }}>
                      ₹{order.totalAmount?.toFixed(2) || "0.00"}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ 
                    color: theme.textPrimary, 
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}>
                    <FaBox /> Items ({order.items?.length || 0})
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: 12,
                          background: theme.background,
                          borderRadius: 8,
                          border: `1px solid ${theme.border}`
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{
                            width: 50,
                            height: 50,
                            background: theme.primarySoft,
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}>
                            <FaBox style={{ color: theme.primary, fontSize: 20 }} />
                          </div>
                          <div>
                            <div style={{ color: theme.textPrimary, fontWeight: 600 }}>
                              {item.name || "Medicine"}
                            </div>
                            <div style={{ color: theme.textSecondary, fontSize: 13 }}>
                              Quantity: {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontWeight: 600, color: theme.textPrimary }}>
                          ₹{((item.price || 0) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div style={{ marginBottom: 20 }}>
                    <h4 style={{ 
                      color: theme.textPrimary, 
                      marginBottom: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 8
                    }}>
                      <FaMapMarkerAlt /> Delivery Address
                    </h4>
                    <div style={{
                      padding: 16,
                      background: theme.background,
                      borderRadius: 8,
                      border: `1px solid ${theme.border}`,
                      color: theme.textSecondary,
                      lineHeight: 1.6
                    }}>
                      <div>{order.shippingAddress.flatNo}</div>
                      <div>{order.shippingAddress.street}</div>
                      {order.shippingAddress.landmark && (
                        <div>Near {order.shippingAddress.landmark}</div>
                      )}
                      <div>
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </div>
                      <div style={{ marginTop: 8, fontWeight: 600, color: theme.textPrimary }}>
                        📞 {order.shippingAddress.phone}
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Info */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", gap: 24 }}>
                    <div style={{
                      flex: 1,
                      padding: 12,
                      background: theme.background,
                      borderRadius: 8,
                      border: `1px solid ${theme.border}`
                    }}>
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 8,
                        color: theme.textSecondary,
                        fontSize: 12,
                        marginBottom: 4
                      }}>
                        <FaCreditCard />
                        Payment Method
                      </div>
                      <div style={{ color: theme.textPrimary, fontWeight: 600 }}>
                        {order.paymentMethod || "COD"}
                      </div>
                    </div>
                    <div style={{
                      flex: 1,
                      padding: 12,
                      background: theme.background,
                      borderRadius: 8,
                      border: `1px solid ${theme.border}`
                    }}>
                      <div style={{ 
                        color: theme.textSecondary,
                        fontSize: 12,
                        marginBottom: 4
                      }}>
                        Payment Status
                      </div>
                      <div style={{ 
                        color: order.paymentStatus === "paid" ? theme.success : theme.warning,
                        fontWeight: 600,
                        textTransform: "capitalize"
                      }}>
                        {order.paymentStatus || "Pending"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Status Timeline */}
                <div>
                  <h4 style={{ 
                    color: theme.textPrimary, 
                    marginBottom: 12
                  }}>
                    Order Status
                  </h4>
                  <OrderTimeline
                    orderStatus={order.orderStatus}
                    deliveryStatus={order.deliveryStatus}
                  />
                </div>

                {/* Order Notes */}
                {order.notes && (
                  <div style={{
                    marginTop: 20,
                    padding: 12,
                    background: theme.primarySoft,
                    borderRadius: 8,
                    border: `1px solid ${theme.primary}20`,
                    fontSize: 14,
                    color: theme.textSecondary
                  }}>
                    <strong style={{ color: theme.textPrimary }}>Note:</strong> {order.notes}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
