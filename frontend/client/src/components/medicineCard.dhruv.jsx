// components/MedicineCard.jsx
import { theme } from "../theme";

export default function MedicineCard({ medicine }) {
  return (
    <div style={{
      background: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: 10,
      padding: 12
    }}>
      <img src={medicine.image?.url} alt="" height="120" />
      <h4>{medicine.name}</h4>
      <p>{medicine.notes}</p>
      <p><b>₹{medicine.price}</b></p>

      {medicine.prescriptionRequired && (
        <span style={{ color: theme.primaryDark }}>
          Prescription Required
        </span>
      )}
    </div>
  );
}
