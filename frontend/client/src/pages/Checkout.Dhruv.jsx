import { useEffect, useState } from "react";
import { useCart } from "../context/cardContext.dhruv";
import { useNavigate } from "react-router-dom";
import { theme } from "../theme";
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
} from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const getTokenFromCookies = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
};

export default function CheckoutDhruv() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalAmount } =
    useCart();
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
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [orderNotes, setOrderNotes] = useState("");

  const navigate = useNavigate();

  // Safety Check
  useEffect(() => {
    if (cartItems.length === 0) return;

    const token = getTokenFromCookies();

    fetch("http://localhost:5005/api/orders/safety-check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        medicines: cartItems.map((item) => ({
          medicineId: item._id,
          quantity: item.quantity,
        })),
      }),
    })
      .then((res) => res.json())
      .then((data) => setWarnings(data.warnings || []))
      .catch(() => {});
  }, [cartItems]);

  const hasRxRequired = cartItems.some((item) => item.prescriptionRequired);

  const handleQuantityChange = (id, delta) => {
    const item = cartItems.find((i) => i._id === id);
    if (item) {
      const newQty = item.quantity + delta;
      if (newQty > 0) {
        updateQuantity(id, newQty);
      }
    }
  };

  const placeOrder = async () => {
    // Validation
    if (
      !address.flatNo ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.pincode ||
      !address.phone
    ) {
      toast.error("Please fill all address fields");
      return;
    }

    if (hasRxRequired && !prescriptionFile) {
      toast.error("Prescription required for some medicines");
      return;
    }

    setLoading(true);

    try {
      const token = getTokenFromCookies();

      // Create FormData for file upload
      const formData = new FormData();

      const orderData = {
        medicines: cartItems.map((item) => ({
          medicineId: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: address,
        totalAmount,
        paymentMethod,
        notes: orderNotes,
      };

      formData.append("orderData", JSON.stringify(orderData));

      if (prescriptionFile) {
        formData.append("prescription", prescriptionFile);
      }

      const res = await fetch("http://localhost:5005/api/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        clearCart();
        toast.success("Order placed successfully!");
        setTimeout(() => {
          navigate("/dhruv/orders");
        }, 1500);
      } else {
        const error = await res.json();
        toast.error(error.message || "Order failed");
      }
    } catch (err) {
      toast.error("Something went wrong", err);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div
        style={{
          background: theme.background,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <FaShoppingCart style={{ fontSize: 64, color: theme.textSecondary }} />
        <h2 style={{ color: theme.textPrimary }}>Your cart is empty</h2>
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
          }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: theme.background, minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          background: theme.surface,
          borderBottom: `1px solid ${theme.border}`,
          padding: "20px 32px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1 style={{ color: theme.textPrimary, fontSize: 28, margin: 0 }}>
            <FaShoppingCart style={{ marginRight: 12 }} />
            Checkout
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 32 }}>
        {/* Progress Steps */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 40,
            position: "relative",
          }}
        >
          {[
            { num: 1, label: "Cart", icon: <FaShoppingCart /> },
            { num: 2, label: "Address", icon: <FaMapMarkerAlt /> },
            { num: 3, label: "Payment", icon: <FaCreditCard /> },
          ].map((s, idx) => (
            <div
              key={s.num}
              style={{ flex: 1, textAlign: "center", zIndex: 1 }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: step >= s.num ? theme.primary : theme.border,
                  color: step >= s.num ? "white" : theme.textSecondary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px",
                  fontSize: 20,
                  transition: "all 0.3s",
                }}
              >
                {step > s.num ? <FaCheckCircle /> : s.icon}
              </div>
              <div
                style={{
                  color: step >= s.num ? theme.primary : theme.textSecondary,
                  fontWeight: step === s.num ? 700 : 400,
                }}
              >
                {s.label}
              </div>
              {idx < 2 && (
                <div
                  style={{
                    position: "absolute",
                    top: 25,
                    left: `${(idx + 1) * 33.33}%`,
                    width: "33.33%",
                    height: 2,
                    background: step > s.num ? theme.primary : theme.border,
                    zIndex: 0,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 32 }}
        >
          {/* Main Content */}
          <div>
            {/* STEP 1: Cart Items */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div
                  style={{
                    background: theme.surface,
                    borderRadius: 12,
                    padding: 24,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <h2 style={{ color: theme.textPrimary, marginBottom: 20 }}>
                    <FaBox style={{ marginRight: 8 }} />
                    Your Items ({cartItems.length})
                  </h2>

                  {/* Safety Warnings */}
                  {warnings.length > 0 && (
                    <div
                      style={{
                        background: "#FFF3CD",
                        border: "1px solid #FFE69C",
                        borderRadius: 8,
                        padding: 16,
                        marginBottom: 20,
                      }}
                    >
                      <h4
                        style={{
                          color: "#856404",
                          marginBottom: 12,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <FaExclamationTriangle /> Safety Warnings
                      </h4>
                      {warnings.map((w, i) => (
                        <p
                          key={i}
                          style={{ color: "#856404", margin: "4px 0" }}
                        >
                          • {w}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Cart Items */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    {cartItems.map((item) => (
                      <div
                        key={item._id}
                        style={{
                          display: "flex",
                          gap: 16,
                          padding: 16,
                          background: theme.background,
                          borderRadius: 8,
                          border: `1px solid ${theme.border}`,
                        }}
                      >
                        <img
                          src={
                            item.image?.url || "https://via.placeholder.com/100"
                          }
                          alt={item.name}
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: "contain",
                            borderRadius: 8,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <h4
                            style={{
                              color: theme.textPrimary,
                              marginBottom: 4,
                            }}
                          >
                            {item.name}
                          </h4>
                          <p
                            style={{
                              color: theme.textSecondary,
                              fontSize: 14,
                              marginBottom: 8,
                            }}
                          >
                            {item.notes}
                          </p>
                          {item.prescriptionRequired && (
                            <span
                              style={{
                                fontSize: 11,
                                background: `${theme.primary}20`,
                                color: theme.primaryDark,
                                padding: "4px 8px",
                                borderRadius: 4,
                                display: "inline-block",
                              }}
                            >
                              Rx Required
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 20,
                              fontWeight: 700,
                              color: theme.primary,
                            }}
                          >
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <button
                              onClick={() => handleQuantityChange(item._id, -1)}
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 6,
                                border: `1px solid ${theme.border}`,
                                background: theme.surface,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <FaMinus
                                style={{
                                  fontSize: 12,
                                  color: theme.textPrimary,
                                }}
                              />
                            </button>
                            <span
                              style={{
                                minWidth: 40,
                                textAlign: "center",
                                fontSize: 16,
                                fontWeight: 600,
                                color: theme.textPrimary,
                              }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item._id, 1)}
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 6,
                                border: `1px solid ${theme.primary}`,
                                background: theme.primarySoft,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <FaPlus
                                style={{ fontSize: 12, color: theme.primary }}
                              />
                            </button>
                            <button
                              onClick={() => {
                                removeFromCart(item._id);
                                toast.info("Item removed from cart");
                              }}
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 6,
                                border: `1px solid ${theme.error}`,
                                background: `${theme.error}10`,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginLeft: 8,
                              }}
                            >
                              <FaTrash
                                style={{ fontSize: 12, color: theme.error }}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Address */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div
                  style={{
                    background: theme.surface,
                    borderRadius: 12,
                    padding: 24,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <h2 style={{ color: theme.textPrimary, marginBottom: 20 }}>
                    <FaMapMarkerAlt style={{ marginRight: 8 }} />
                    Delivery Address
                  </h2>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                    }}
                  >
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: 8,
                          color: theme.textPrimary,
                          fontWeight: 500,
                        }}
                      >
                        Flat / House No. *
                      </label>
                      <input
                        type="text"
                        value={address.flatNo}
                        onChange={(e) =>
                          setAddress({ ...address, flatNo: e.target.value })
                        }
                        placeholder="e.g., Flat 201, Building A"
                        style={{
                          width: "100%",
                          padding: 12,
                          borderRadius: 8,
                          border: `1px solid ${theme.border}`,
                          background: theme.background,
                          color: theme.textPrimary,
                          fontSize: 14,
                        }}
                      />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: 8,
                          color: theme.textPrimary,
                          fontWeight: 500,
                        }}
                      >
                        Street / Area *
                      </label>
                      <input
                        type="text"
                        value={address.street}
                        onChange={(e) =>
                          setAddress({ ...address, street: e.target.value })
                        }
                        placeholder="e.g., MG Road, Sector 5"
                        style={{
                          width: "100%",
                          padding: 12,
                          borderRadius: 8,
                          border: `1px solid ${theme.border}`,
                          background: theme.background,
                          color: theme.textPrimary,
                          fontSize: 14,
                        }}
                      />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: 8,
                          color: theme.textPrimary,
                          fontWeight: 500,
                        }}
                      >
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={address.landmark}
                        onChange={(e) =>
                          setAddress({ ...address, landmark: e.target.value })
                        }
                        placeholder="e.g., Near City Hospital"
                        style={{
                          width: "100%",
                          padding: 12,
                          borderRadius: 8,
                          border: `1px solid ${theme.border}`,
                          background: theme.background,
                          color: theme.textPrimary,
                          fontSize: 14,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: 8,
                          color: theme.textPrimary,
                          fontWeight: 500,
                        }}
                      >
                        City *
                      </label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) =>
                          setAddress({ ...address, city: e.target.value })
                        }
                        placeholder="e.g., Pune"
                        style={{
                          width: "100%",
                          padding: 12,
                          borderRadius: 8,
                          border: `1px solid ${theme.border}`,
                          background: theme.background,
                          color: theme.textPrimary,
                          fontSize: 14,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: 8,
                          color: theme.textPrimary,
                          fontWeight: 500,
                        }}
                      >
                        State *
                      </label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={(e) =>
                          setAddress({ ...address, state: e.target.value })
                        }
                        placeholder="e.g., Maharashtra"
                        style={{
                          width: "100%",
                          padding: 12,
                          borderRadius: 8,
                          border: `1px solid ${theme.border}`,
                          background: theme.background,
                          color: theme.textPrimary,
                          fontSize: 14,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: 8,
                          color: theme.textPrimary,
                          fontWeight: 500,
                        }}
                      >
                        Pincode *
                      </label>
                      <input
                        type="text"
                        value={address.pincode}
                        onChange={(e) =>
                          setAddress({ ...address, pincode: e.target.value })
                        }
                        placeholder="e.g., 411001"
                        maxLength={6}
                        style={{
                          width: "100%",
                          padding: 12,
                          borderRadius: 8,
                          border: `1px solid ${theme.border}`,
                          background: theme.background,
                          color: theme.textPrimary,
                          fontSize: 14,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: 8,
                          color: theme.textPrimary,
                          fontWeight: 500,
                        }}
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={address.phone}
                        onChange={(e) =>
                          setAddress({ ...address, phone: e.target.value })
                        }
                        placeholder="e.g., 9876543210"
                        maxLength={10}
                        style={{
                          width: "100%",
                          padding: 12,
                          borderRadius: 8,
                          border: `1px solid ${theme.border}`,
                          background: theme.background,
                          color: theme.textPrimary,
                          fontSize: 14,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Payment */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div
                  style={{
                    background: theme.surface,
                    borderRadius: 12,
                    padding: 24,
                    border: `1px solid ${theme.border}`,
                    marginBottom: 20,
                  }}
                >
                  <h2 style={{ color: theme.textPrimary, marginBottom: 20 }}>
                    <FaCreditCard style={{ marginRight: 8 }} />
                    Payment Method
                  </h2>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {["COD", "Online", "Insurance"].map((method) => (
                      <label
                        key={method}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: 16,
                          background:
                            paymentMethod === method
                              ? theme.primarySoft
                              : theme.background,
                          border: `2px solid ${paymentMethod === method ? theme.primary : theme.border}`,
                          borderRadius: 8,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          style={{ width: 20, height: 20 }}
                        />
                        <span
                          style={{
                            fontSize: 16,
                            fontWeight: 500,
                            color: theme.textPrimary,
                          }}
                        >
                          {method === "COD" ? "Cash on Delivery" : method}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Prescription Upload */}
                {hasRxRequired && (
                  <div
                    style={{
                      background: theme.surface,
                      borderRadius: 12,
                      padding: 24,
                      border: `1px solid ${theme.border}`,
                      marginBottom: 20,
                    }}
                  >
                    <h3 style={{ color: theme.textPrimary, marginBottom: 12 }}>
                      Upload Prescription *
                    </h3>
                    <p
                      style={{
                        color: theme.textSecondary,
                        fontSize: 14,
                        marginBottom: 16,
                      }}
                    >
                      Some items in your cart require a prescription. Please
                      upload a clear image.
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPrescriptionFile(e.target.files[0])}
                      style={{
                        width: "100%",
                        padding: 12,
                        borderRadius: 8,
                        border: `1px solid ${theme.border}`,
                        background: theme.background,
                        color: theme.textPrimary,
                      }}
                    />
                    {prescriptionFile && (
                      <p
                        style={{
                          color: theme.success,
                          fontSize: 14,
                          marginTop: 8,
                        }}
                      >
                        ✓ {prescriptionFile.name}
                      </p>
                    )}
                  </div>
                )}

                {/* Order Notes */}
                <div
                  style={{
                    background: theme.surface,
                    borderRadius: 12,
                    padding: 24,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <h3 style={{ color: theme.textPrimary, marginBottom: 12 }}>
                    Order Notes (Optional)
                  </h3>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Any special instructions for delivery..."
                    rows={4}
                    style={{
                      width: "100%",
                      padding: 12,
                      borderRadius: 8,
                      border: `1px solid ${theme.border}`,
                      background: theme.background,
                      color: theme.textPrimary,
                      fontSize: 14,
                      resize: "vertical",
                    }}
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div style={{ position: "sticky", top: 20, height: "fit-content" }}>
            <div
              style={{
                background: theme.surface,
                borderRadius: 12,
                padding: 24,
                border: `1px solid ${theme.border}`,
              }}
            >
              <h3 style={{ color: theme.textPrimary, marginBottom: 20 }}>
                Order Summary
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginBottom: 20,
                  paddingBottom: 20,
                  borderBottom: `1px solid ${theme.border}`,
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: theme.textSecondary }}>
                    Items ({cartItems.length})
                  </span>
                  <span style={{ color: theme.textPrimary }}>
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: theme.textSecondary }}>Delivery</span>
                  <span style={{ color: theme.success }}>FREE</span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 24,
                }}
              >
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: theme.textPrimary,
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: theme.primary,
                  }}
                >
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>

              {/* Action Buttons */}
              {step === 1 && (
                <button
                  onClick={() => setStep(2)}
                  style={{
                    width: "100%",
                    padding: 16,
                    background: theme.primary,
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  Proceed to Address
                </button>
              )}

              {step === 2 && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  <button
                    onClick={() => setStep(3)}
                    style={{
                      width: "100%",
                      padding: 16,
                      background: theme.primary,
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    Proceed to Payment
                  </button>
                  <button
                    onClick={() => setStep(1)}
                    style={{
                      width: "100%",
                      padding: 16,
                      background: theme.surface,
                      color: theme.textPrimary,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: 16,
                    }}
                  >
                    Back to Cart
                  </button>
                </div>
              )}

              {step === 3 && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  <button
                    onClick={placeOrder}
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: 16,
                      background: loading ? theme.border : theme.primary,
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      cursor: loading ? "not-allowed" : "pointer",
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    {loading ? "Placing Order..." : "Place Order"}
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: 16,
                      background: theme.surface,
                      color: theme.textPrimary,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 8,
                      cursor: loading ? "not-allowed" : "pointer",
                      fontSize: 16,
                    }}
                  >
                    Back to Address
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
