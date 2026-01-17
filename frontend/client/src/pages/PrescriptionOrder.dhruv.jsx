import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { theme } from "../theme";
import { useCart } from "../context/cardContext.dhruv";
import { FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { toast } from "react-toastify";

const getTokenFromCookies = () => {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith("token="))
    ?.split("=")[1];
};

export default function PrescriptionOrder() {
  const { prescriptionId } = useParams();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems, updateQuantity } = useCart();
  const navigate = useNavigate();

  const getItemQuantity = (medicineId) => {
    const item = cartItems.find(i => i._id === medicineId);
    return item ? item.quantity : 0;
  };

  useEffect(() => {
    // DEMO DATA - Remove this and uncomment API call when backend is ready
    const demoData = [
      {
        _id: "med002",
        name: "Amoxicillin 250mg",
        category: "Antibiotic",
        description: "Antibiotic used to treat bacterial infections",
        image: { url: "https://via.placeholder.com/200?text=Amoxicillin" },
        contents: [
          { ingredient: "Amoxicillin Trihydrate" },
          { ingredient: "Clavulanic Acid" }
        ],
        notes: "Complete the full course as prescribed",
        price: 120,
        stock: 50,
        prescriptionRequired: true,
        manufacturer: "Sun Pharma",
        isActive: true
      },
      {
        _id: "med001",
        name: "Paracetamol 500mg",
        category: "Pain Relief",
        description: "Used to treat mild to moderate pain and fever",
        image: { url: "https://via.placeholder.com/200?text=Paracetamol" },
        contents: [
          { ingredient: "Paracetamol" },
          { ingredient: "Caffeine" }
        ],
        notes: "Take after meals, 3 times daily",
        price: 50,
        stock: 100,
        prescriptionRequired: false,
        manufacturer: "Cipla",
        isActive: true
      },
      {
        _id: "med004",
        name: "Azithromycin 500mg",
        category: "Antibiotic",
        description: "Treats various bacterial infections including respiratory",
        image: { url: "https://via.placeholder.com/200?text=Azithromycin" },
        contents: [
          { ingredient: "Azithromycin Dihydrate" }
        ],
        notes: "Take on empty stomach, once daily",
        price: 180,
        stock: 30,
        prescriptionRequired: true,
        manufacturer: "Zydus Cadila",
        isActive: true
      }
    ];

    setTimeout(() => {
      setMedicines(demoData);
      setLoading(false);
    }, 500);

    // UNCOMMENT THIS WHEN BACKEND IS READY
    /*
    const token = getTokenFromCookies();

    fetch(
      `http://localhost:5005/api/medicines/by-prescription/${prescriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
      .then(res => res.json())
      .then(data => {
        setMedicines(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
    */
  }, [prescriptionId]);

  return (
    <div style={{ background: theme.background, minHeight: "100vh", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button
          onClick={() => navigate("/dhruv/prescriptions")}
          style={{
            padding: "8px 16px",
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: 6,
            cursor: "pointer",
            color: theme.textPrimary
          }}
        >
          ← Back to Prescriptions
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
            position: "relative"
          }}
        >
          <FaShoppingCart /> View Cart
        </button>
      </div>

      <h2 style={{ color: theme.textPrimary, marginBottom: 20 }}>
        Medicines from Prescription
      </h2>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin text-4xl" style={{ color: theme.primary }}>
            Loading...
          </div>
        </div>
      ) : medicines.length === 0 ? (
        <p style={{ color: theme.textSecondary }}>
          No medicines available from this prescription.
        </p>
      ) : (
        medicines.map(med => (
          <div
            key={med._id}
            style={{
              background: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: 8,
              padding: 16,
              marginBottom: 12
            }}
          >
            <div style={{ display: "flex", gap: 16 }}>
              <img
                src={med.image?.url || "https://via.placeholder.com/100"}
                alt={med.name}
                style={{ width: 100, height: 100, objectFit: "contain", borderRadius: 8 }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ color: theme.textPrimary, marginBottom: 8 }}>{med.name}</h4>
                <p style={{ color: theme.textSecondary, fontSize: 14, marginBottom: 8 }}>
                  {med.description}
                </p>
                <p style={{ color: theme.textSecondary, fontSize: 14, marginBottom: 8 }}>
                  <b>Contents:</b>{" "}
                  {med.contents?.map(c => c.ingredient).join(", ") || "N/A"}
                </p>
                <p style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 8 }}>
                  {med.notes}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <strong style={{ color: theme.primary, fontSize: 20 }}>₹{med.price}</strong>
                  {med.prescriptionRequired && (
                    <span style={{ 
                      color: theme.primaryDark, 
                      fontSize: 11,
                      background: `${theme.primary}20`,
                      padding: "2px 8px",
                      borderRadius: 4
                    }}>
                      Prescription Required
                    </span>
                  )}
                </div>
              </div>
            </div>
            {getItemQuantity(med._id) === 0 ? (
              <button
                onClick={() => {
                  addToCart(med);
                  toast.success(`${med.name} added to cart!`);
                }}
                style={{
                  marginTop: 12,
                  width: "100%",
                  background: theme.primary,
                  color: "#fff",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontWeight: 600
                }}
              >
                <FaShoppingCart /> Add to Cart
              </button>
            ) : (
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: theme.primarySoft,
                  border: `2px solid ${theme.primary}`,
                  borderRadius: 6,
                  padding: "8px 12px"
                }}
              >
                <button
                  onClick={() => {
                    const currentQty = getItemQuantity(med._id);
                    if (currentQty > 1) {
                      updateQuantity(med._id, currentQty - 1);
                    } else {
                      updateQuantity(med._id, 0);
                      toast.info("Item removed from cart");
                    }
                  }}
                  style={{
                    width: 32,
                    height: 32,
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
                  fontSize: 18,
                  color: theme.primary,
                  minWidth: 40,
                  textAlign: "center"
                }}>
                  {getItemQuantity(med._id)}
                </span>
                <button
                  onClick={() => {
                    updateQuantity(med._id, getItemQuantity(med._id) + 1);
                    toast.success("Quantity updated!");
                  }}
                  style={{
                    width: 32,
                    height: 32,
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
          </div>
        ))
      )}
    </div>
  );
}
