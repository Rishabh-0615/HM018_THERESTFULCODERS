import { useState } from "react";
import api from "../utils/api";
import theme from "../theme";

const UploadPrescription = () => {
  const [file, setFile] = useState(null);
  const [doctor, setDoctor] = useState({
    name: "",
    registrationNumber: "",
    hospital: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a prescription file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("doctor", JSON.stringify(doctor));

    try {
      await api.post("/prescriptions/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Prescription uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div
      style={{ padding: 30, background: theme.background, minHeight: "100vh" }}
    >
      <h2 style={{ color: theme.primaryDark }}>Upload Prescription</h2>

      <form
        onSubmit={submitHandler}
        style={{
          background: theme.surface,
          padding: 20,
          borderRadius: 8,
          maxWidth: 400,
        }}
      >
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Doctor Name"
          value={doctor.name}
          onChange={(e) => setDoctor({ ...doctor, name: e.target.value })}
          required
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Registration Number"
          value={doctor.registrationNumber}
          onChange={(e) =>
            setDoctor({ ...doctor, registrationNumber: e.target.value })
          }
          required
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Hospital"
          value={doctor.hospital}
          onChange={(e) => setDoctor({ ...doctor, hospital: e.target.value })}
        />

        <br />
        <br />

        {/* 🔴 THIS WAS THE ISSUE */}
        <button
          type="submit"
          style={{
            background: theme.primary,
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Upload Prescription
        </button>
      </form>
    </div>
  );
};

export default UploadPrescription;
