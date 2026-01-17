import theme from "../theme";

const statusColor = {
  pending: theme.primarySoft,
  approved: "green",
  rejected: "red",
  expired: "gray",
};

const PrescriptionCard = ({ p }) => {
  return (
    <div
      style={{
        background: theme.surface,
        padding: 15,
        marginBottom: 10,
        borderLeft: `5px solid ${statusColor[p.validation.status]}`,
      }}
    >
      <p>
        Status: <b>{p.validation.status}</b>
      </p>
      <p>Doctor: {p.doctor?.name}</p>
      <p>Uploaded: {new Date(p.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default PrescriptionCard;
