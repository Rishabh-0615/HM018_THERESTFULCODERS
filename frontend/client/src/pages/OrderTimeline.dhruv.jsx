import { theme } from "../theme";
import { 
  FaCheckCircle, 
  FaCircle, 
  FaShoppingCart,
  FaClipboardCheck,
  FaBox,
  FaShippingFast,
  FaHome
} from "react-icons/fa";

const timelineSteps = [
  { key: "placed", label: "Placed", icon: <FaShoppingCart /> },
  { key: "approved", label: "Approved", icon: <FaClipboardCheck /> },
  { key: "packed", label: "Packed", icon: <FaBox /> },
  { key: "shipped", label: "Shipped", icon: <FaShippingFast /> },
  { key: "delivered", label: "Delivered", icon: <FaHome /> }
];

export default function OrderTimeline({ orderStatus, deliveryStatus }) {
  const currentStatus = deliveryStatus === "delivered" ? "delivered" : orderStatus;
  const currentIndex = timelineSteps.findIndex(step => step.key === currentStatus);

  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",
      padding: "20px 0"
    }}>
      {/* Progress Line */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: 0,
        right: 0,
        height: 3,
        background: theme.border,
        transform: "translateY(-50%)",
        zIndex: 0
      }}>
        <div style={{
          height: "100%",
          background: theme.primary,
          width: `${(currentIndex / (timelineSteps.length - 1)) * 100}%`,
          transition: "width 0.5s ease"
        }} />
      </div>

      {/* Timeline Steps */}
      {timelineSteps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div 
            key={step.key} 
            style={{ 
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              zIndex: 1,
              flex: 1
            }}
          >
            {/* Icon Circle */}
            <div
              style={{
                width: isCurrent ? 56 : 48,
                height: isCurrent ? 56 : 48,
                borderRadius: "50%",
                background: isCompleted ? theme.primary : theme.surface,
                border: `3px solid ${isCompleted ? theme.primary : theme.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isCurrent ? 22 : 18,
                color: isCompleted ? "white" : theme.textSecondary,
                transition: "all 0.3s ease",
                boxShadow: isCurrent ? `0 4px 12px ${theme.primary}40` : "none",
                marginBottom: 12
              }}
            >
              {isCompleted ? <FaCheckCircle /> : step.icon}
            </div>

            {/* Label */}
            <div style={{
              fontSize: isCurrent ? 14 : 13,
              fontWeight: isCurrent ? 700 : 500,
              color: isCompleted ? theme.primary : theme.textSecondary,
              textAlign: "center",
              transition: "all 0.3s ease"
            }}>
              {step.label}
            </div>

            {/* Current Status Indicator */}
            {isCurrent && (
              <div style={{
                fontSize: 11,
                color: theme.primary,
                marginTop: 4,
                fontWeight: 600
              }}>
                Current
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
