import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loading } from "../components/Loading";

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

const PharmacistDashboard = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    fetchPendingPrescriptions();
  }, []);

  const fetchPendingPrescriptions = async () => {
    try {
      const { data } = await axios.get("/api/prescriptions/pending/all");
      setPrescriptions(data.prescriptions);
      setLoading(false);
    } catch {
      console.error("Error fetching prescriptions:");
      setLoading(false);
    }
  };

  const handleApprove = async (prescriptionId, status) => {
    try {
      await axios.put(`/api/prescriptions/approve/${prescriptionId}`, {
        status,
        remarks: remarks[prescriptionId] || "",
      });
      alert(`Prescription ${status} successfully`);
      fetchPendingPrescriptions();
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div
      style={{
        backgroundColor: theme.background,
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h2 style={{ color: theme.primaryDark, marginBottom: "1.5rem" }}>
        Pending Prescription Approvals
      </h2>

      {prescriptions.length === 0 ? (
        <div
          style={{
            backgroundColor: theme.surface,
            padding: "3rem",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <p style={{ color: theme.textSecondary }}>No pending prescriptions</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1.5rem" }}>
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
              <h3 style={{ color: theme.textPrimary, margin: "0 0 0.5rem 0" }}>
                Patient: {prescription.customerId.name}
              </h3>
              <p style={{ color: theme.textSecondary, margin: "0.25rem 0" }}>
                Email: {prescription.customerId.email}
              </p>
              <p style={{ color: theme.textSecondary, margin: "0.25rem 0" }}>
                Phone: {prescription.customerId.mobile}
              </p>

              <div
                style={{
                  backgroundColor: theme.background,
                  padding: "1rem",
                  borderRadius: "8px",
                  margin: "1rem 0",
                }}
              >
                <h4
                  style={{ color: theme.textPrimary, margin: "0 0 0.5rem 0" }}
                >
                  Medicines:
                </h4>
                {prescription.medicinesMentioned.map((med, idx) => (
                  <p
                    key={idx}
                    style={{ color: theme.textPrimary, margin: "0.25rem 0" }}
                  >
                    • {med.name} - {med.dosage} ({med.duration})
                  </p>
                ))}
              </div>

              {prescription.files[0] && (
                <a
                  href={prescription.files[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginBottom: "1rem",
                    color: theme.primary,
                    textDecoration: "none",
                  }}
                >
                  View Prescription →
                </a>
              )}

              <textarea
                placeholder="Remarks (optional)"
                value={remarks[prescription._id] || ""}
                onChange={(e) =>
                  setRemarks({ ...remarks, [prescription._id]: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: `1px solid ${theme.border}`,
                  borderRadius: "8px",
                  marginBottom: "0.5rem",
                }}
              />

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => handleApprove(prescription._id, "approved")}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    backgroundColor: theme.primarySoft,
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApprove(prescription._id, "rejected")}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    backgroundColor: "#FF6B6B",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PharmacistDashboard;
