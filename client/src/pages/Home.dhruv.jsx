import { useEffect, useState } from "react";
import { theme } from "../theme";
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
  FaReceipt
} from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

/* 🍪 TOKEN FROM COOKIES */
const getTokenFromCookies = () => {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith("token="))
    ?.split("=")[1];
};

export default function HomeDhruv() {
  const [medicines, setMedicines] = useState([]);
  const [refillSuggestions, setRefillSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user, logoutUser } = UserDataDhruv();
  const { cartItems, addToCart, updateQuantity, totalAmount } = useCart();

  const getItemQuantity = (medicineId) => {
    const item = cartItems.find(i => i._id === medicineId);
    return item ? item.quantity : 0;
  };

  useEffect(() => {
    const token = getTokenFromCookies();

    /* 🔹 FETCH MEDICINES */
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

    /* 🔹 FETCH REFILL SUGGESTIONS */
    if (token) {
      fetch("http://localhost:5005/api/orders/refill-suggestions", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => setRefillSuggestions(data))
        .catch(() => {});
    }

    /* 🧪 DEMO DATA (COMMENTED – KEEP FOR FALLBACK)
    const demoData = [...];
    setMedicines(demoData);
    setLoading(false);
    */
  }, []);

  const filteredMedicines = medicines.filter(med =>
    med.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div style={{ background: theme.background, minHeight: "100vh" }}>
      {/* HEADER */}
      <div
        style={{
          background: theme.surface,
          borderBottom: `1px solid ${theme.border}`,
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <FaPills style={{ color: theme.primary, fontSize: 22 }} />
          <h1 style={{ color: theme.textPrimary, fontSize: 20, fontWeight: 700 }}>
            Digital Pharmacy
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => navigate("/dhruv/prescriptions")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              background: theme.surface,
              color: theme.textPrimary,
              border: `1px solid ${theme.border}`,
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            <FaFileMedical /> Prescriptions
          </button>

          <button
            onClick={() => navigate("/dhruv/orders")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              background: theme.surface,
              color: theme.textPrimary,
              border: `1px solid ${theme.border}`,
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            <FaReceipt /> My Orders
          </button>

          <button
            onClick={() => navigate("/dhruv/checkout")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              background: theme.primary,
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              position: "relative",
              fontWeight: 600
            }}
          >
            <FaShoppingCart /> 
            Cart: ₹{totalAmount.toFixed(0)}
            {cartItems.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  background: "#fff",
                  color: theme.primary,
                  borderRadius: "50%",
                  width: 22,
                  height: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  border: `2px solid ${theme.primary}`
                }}
              >
                {cartItems.length}
              </span>
            )}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FaUser style={{ color: theme.textSecondary }} />
            <span style={{ fontSize: 14 }}>{user?.name || "User"}</span>
          </div>

          <button
            onClick={() => logoutUser(navigate)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              background: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: 24 }}>
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          {/* 🔔 REFILL SUGGESTIONS */}
          {refillSuggestions.length > 0 && (
            <motion.div
              variants={itemVariants}
              style={{
                background: theme.primarySoft,
                padding: 16,
                borderRadius: 10,
                marginBottom: 20
              }}
            >
              <h4 style={{ color: theme.primaryDark, marginBottom: 8 }}>
                Refill Suggestions
              </h4>
              {refillSuggestions.map((s, i) => (
                <p key={i} style={{ margin: 0 }}>
                  🔔 {s.message}
                </p>
              ))}
            </motion.div>
          )}

          {/* TITLE */}
          <motion.h2
            variants={itemVariants}
            style={{ color: theme.textPrimary, fontSize: 28, marginBottom: 16 }}
          >
            Available Medicines
          </motion.h2>

          {/* SEARCH */}
          <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
            <div style={{ position: "relative", maxWidth: 400 }}>
              <FaSearch
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: theme.textSecondary
                }}
              />
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 36px",
                  borderRadius: 8,
                  border: `1px solid ${theme.border}`,
                  background: theme.surface
                }}
              />
            </div>
          </motion.div>

          {/* GRID */}
          {loading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <FaPills
                style={{
                  fontSize: 36,
                  color: theme.primary,
                  animation: "spin 1s linear infinite"
                }}
              />
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
                gap: 16
              }}
            >
              {filteredMedicines.map(med => (
                <motion.div
                  key={med._id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 10,
                    padding: 12,
                    cursor: "pointer"
                  }}
                >
                  <img
                    src={med.image?.url}
                    alt={med.name}
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "contain",
                      marginBottom: 8
                    }}
                  />
                  <h4 style={{ color: theme.textPrimary }}>{med.name}</h4>
                  <p style={{ color: theme.textSecondary, fontSize: 13 }}>
                    {med.notes}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8
                    }}
                  >
                    <strong style={{ color: theme.primary }}>
                      ₹{med.price}
                    </strong>

                    {med.prescriptionRequired && (
                      <span
                        style={{
                          fontSize: 11,
                          background: `${theme.primary}20`,
                          color: theme.primaryDark,
                          padding: "2px 8px",
                          borderRadius: 4
                        }}
                      >
                        Rx Required
                      </span>
                    )}
                  </div>

                  {getItemQuantity(med._id) === 0 ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(med);
                        toast.success(`${med.name} added to cart!`);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px",
                        background: theme.primary,
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        fontWeight: 600,
                        fontSize: 14
                      }}
                    >
                      <FaShoppingCart /> Add to Cart
                    </button>
                  ) : (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: theme.primarySoft,
                        border: `2px solid ${theme.primary}`,
                        borderRadius: 6,
                        padding: "6px 8px"
                      }}
                    >
                      <button
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
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 4,
                          border: "none",
                          background: "white",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <FaMinus style={{ fontSize: 12, color: theme.primary }} />
                      </button>
                      <span style={{ 
                        fontWeight: 700, 
                        fontSize: 16,
                        color: theme.primary,
                        minWidth: 30,
                        textAlign: "center"
                      }}>
                        {getItemQuantity(med._id)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(med._id, getItemQuantity(med._id) + 1);
                          toast.success("Quantity updated!");
                        }}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 4,
                          border: "none",
                          background: theme.primary,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <FaPlus style={{ fontSize: 12, color: "white" }} />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
