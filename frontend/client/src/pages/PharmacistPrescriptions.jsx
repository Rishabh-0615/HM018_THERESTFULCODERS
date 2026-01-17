import { useEffect, useState } from "react";
import api from "../utils/api";
import theme from "../theme";

const PharmacistPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await api.get("/prescriptions?status=pending");
        setPrescriptions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const approve = async (id) => {
    await api.put(`/prescriptions/${id}/approve`);
    setPrescriptions((prev) => prev.filter((p) => p._id !== id));
  };

  const reject = async (id) => {
    await api.put(`/prescriptions/${id}/reject`, {
      remarks: "Invalid or unclear prescription",
    });
    setPrescriptions((prev) => prev.filter((p) => p._id !== id));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 30, background: theme.background }}>
      <h2 style={{ color: theme.primaryDark }}>Pending Prescriptions</h2>

      {prescriptions.length === 0 && <p>No pending prescriptions</p>}

      {prescriptions.map((p) => (
        <div
          key={p._id}
          style={{
            background: theme.surface,
            padding: 15,
            marginBottom: 15,
            borderRadius: 8,
            border: `1px solid ${theme.border}`,
          }}
        >
          <p>
            <b>Customer:</b> {p.customerId?.name}
          </p>
          <p>
            <b>Doctor:</b> {p.doctor?.name}
          </p>

          <div style={{ marginTop: 10 }}>
            <button
              onClick={() => approve(p._id)}
              style={{
                background: theme.primary,
                color: "white",
                padding: "8px 12px",
                marginRight: 10,
                border: "none",
                borderRadius: 5,
              }}
            >
              Approve
            </button>

            <button
              onClick={() => reject(p._id)}
              style={{
                background: "#dc3545",
                color: "white",
                padding: "8px 12px",
                border: "none",
                borderRadius: 5,
              }}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PharmacistPrescriptions;
