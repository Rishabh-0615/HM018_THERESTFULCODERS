import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

const UploadPrescription = () => {
  const [file, setFile] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const [doctorRegNo, setDoctorRegNo] = useState("");
  const [hospital, setHospital] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationResults, setValidationResults] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("prescription", file);
    formData.append("doctorName", doctorName);
    formData.append("doctorRegNo", doctorRegNo);
    formData.append("hospital", hospital);

    try {
      const { data } = await axios.post("/api/prescriptions/upload", formData);
      const validationRes = await axios.get(
        `/api/prescriptions/validate/${data.prescription._id}`,
      );
      setValidationResults(validationRes.data);
      setLoading(false);
    } catch (error) {
      alert(error.response?.data?.message || "Upload failed");
      setLoading(false);
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
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ color: theme.primaryDark, marginBottom: "1.5rem" }}>
          Upload Prescription
        </h2>

        <div
          style={{
            backgroundColor: theme.surface,
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {!validationResults ? (
            <form onSubmit={handleUpload}>
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    color: theme.textPrimary,
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                  }}
                >
                  Prescription File *
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `2px solid ${theme.border}`,
                    borderRadius: "8px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <input
                  type="text"
                  placeholder="Doctor Name (Optional)"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "8px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <input
                  type="text"
                  placeholder="Registration No (Optional)"
                  value={doctorRegNo}
                  onChange={(e) => setDoctorRegNo(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "8px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <input
                  type="text"
                  placeholder="Hospital (Optional)"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "8px",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "1rem",
                  backgroundColor: theme.primary,
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Upload & Validate
              </button>
            </form>
          ) : (
            <div>
              <h3 style={{ color: theme.primaryDark, marginBottom: "1rem" }}>
                Validation Results
              </h3>

              {validationResults.validationResults.map((result, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "1rem",
                    border: `2px solid ${result.available ? theme.primarySoft : "#FF6B6B"}`,
                    borderRadius: "8px",
                    marginBottom: "0.75rem",
                  }}
                >
                  <h4
                    style={{ color: theme.textPrimary, margin: "0 0 0.5rem 0" }}
                  >
                    {result.medicine}
                  </h4>
                  {result.available ? (
                    <>
                      <p
                        style={{
                          color: theme.textSecondary,
                          margin: "0.25rem 0",
                        }}
                      >
                        Stock: {result.stock}
                      </p>
                      <p
                        style={{
                          color: theme.textSecondary,
                          margin: "0.25rem 0",
                        }}
                      >
                        Price: ₹{result.price}
                      </p>
                      {result.requiresApproval && (
                        <p style={{ color: "#FFA500", margin: "0.5rem 0" }}>
                          ⚠️ Requires approval
                        </p>
                      )}
                    </>
                  ) : (
                    <p style={{ color: "#FF6B6B", margin: "0.5rem 0" }}>
                      {result.reason}
                    </p>
                  )}
                </div>
              ))}

              {validationResults.allAvailable && (
                <button
                  onClick={() =>
                    navigate("/cart", {
                      state: {
                        prescriptionMedicines:
                          validationResults.validationResults.filter(
                            (m) => m.available,
                          ),
                      },
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "1rem",
                    backgroundColor: theme.primary,
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    marginTop: "1rem",
                  }}
                >
                  Proceed to Order
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPrescription;
