import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loading } from "../components/Loading";
import { useNavigate } from "react-router-dom";

const theme = {
  primary: "#055AF9",
  primaryDark: "#013188",
  primarySoft: "#5B8ADC",
  background: "#F0F3FB",
  surface: "#FCFCFE",
  textPrimary: "#343838",
  textSecondary: "#7F7E85",
  border: "#C7C9CE",
};

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyPrescriptions();
  }, []);

  const fetchMyPrescriptions = async () => {
    try {
      const { data } = await axios.get("/api/prescriptions/my-prescriptions");
      setPrescriptions(data.prescriptions);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this prescription?")) return;
    try {
      await axios.delete(`/api/prescriptions/${id}`);
      fetchMyPrescriptions();
    } catch (error) {
      alert("Delete failed");
    }
  };

  const getStatusColor = (status) =>
    ({
      approved: theme.primarySoft,
      rejected: "#FF6B6B",
      pending: "#FFA500",
      expired: theme.textSecondary,
    })[status] || theme.textPrimary;

  if (loading) return <Loading />;

  return (
    <div
      style={{
        backgroundColor: theme.background,
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h2 style={{ color: theme.primaryDark, margin: 0 }}>
            My Prescriptions
          </h2>
          <button
            onClick={() => navigate("/upload-prescription")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: theme.primary,
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            + Upload New
          </button>
        </div>

        {prescriptions.length === 0 ? (
          <div
            style={{
              backgroundColor: theme.surface,
              padding: "3rem",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <p style={{ color: theme.textSecondary, marginBottom: "1rem" }}>
              No prescriptions yet
            </p>
            <button
              onClick={() => navigate("/upload-prescription")}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: theme.primary,
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Upload Your First Prescription
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {prescriptions.map((prescription) => (
              <div
                key={prescription._id}
                style={{
                  backgroundColor: theme.surface,
                  padding: "1.5rem",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "0.4rem 1rem",
                    backgroundColor: getStatusColor(
                      prescription.validation.status,
                    ),
                    color: "white",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                  }}
                >
                  {prescription.validation.status.toUpperCase()}
                </div>

                <p
                  style={{
                    color: theme.textSecondary,
                    fontSize: "0.9rem",
                    marginBottom: "1rem",
                  }}
                >
                  {new Date(prescription.createdAt).toLocaleDateString("en-IN")}
                </p>

                {prescription.doctor.name && (
                  <div
                    style={{
                      backgroundColor: theme.background,
                      padding: "1rem",
                      borderRadius: "8px",
                      marginBottom: "1rem",
                    }}
                  >
                    <p
                      style={{
                        color: theme.textPrimary,
                        fontWeight: "600",
                        margin: "0 0 0.25rem 0",
                      }}
                    >
                      Dr. {prescription.doctor.name}
                    </p>
                    {prescription.doctor.hospital && (
                      <p
                        style={{
                          color: theme.textSecondary,
                          fontSize: "0.9rem",
                          margin: 0,
                        }}
                      >
                        {prescription.doctor.hospital}
                      </p>
                    )}
                  </div>
                )}

                <p
                  style={{
                    color: theme.textPrimary,
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                  }}
                >
                  Medicines: {prescription.medicinesMentioned.length}
                </p>

                {prescription.validation.remarks && (
                  <div
                    style={{
                      backgroundColor: "#FFF3CD",
                      padding: "0.75rem",
                      borderRadius: "6px",
                      marginBottom: "1rem",
                    }}
                  >
                    <p
                      style={{
                        color: "#856404",
                        fontSize: "0.85rem",
                        margin: 0,
                      }}
                    >
                      <strong>Note:</strong> {prescription.validation.remarks}
                    </p>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {prescription.files[0] && (
                    <a
                      href={prescription.files[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "0.75rem",
                        backgroundColor: theme.primarySoft,
                        color: "white",
                        textAlign: "center",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontWeight: "600",
                      }}
                    >
                      View Details
                    </a>
                  )}
                  {prescription.validation.status === "approved" && (
                    <button
                      onClick={() => navigate("/cart")}
                      style={{
                        padding: "0.75rem",
                        backgroundColor: theme.primary,
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Order Medicines
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(prescription._id)}
                    style={{
                      padding: "0.75rem",
                      backgroundColor: "transparent",
                      color: "#FF6B6B",
                      border: "2px solid #FF6B6B",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPrescriptions;
