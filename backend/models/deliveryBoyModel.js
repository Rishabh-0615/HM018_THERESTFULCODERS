import mongoose from "mongoose";

const deliveryBoySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pharmacist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: async function(pharmacistId) {
          const user = await mongoose.model("User").findById(pharmacistId);
          return user && user.role === "pharmacist";
        },
        message: "Referenced user must be a pharmacist"
      }
    },
    location: { type: String, default: "" },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    vehicleType: {
      type: String,
      enum: ["bike", "scooter", "bicycle", "car"],
      required: true
    },
    vehicleNumber: { 
      type: String, 
      default: "" 
    },
    isPasswordChanged: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Index for faster queries
deliveryBoySchema.index({ pharmacist: 1 });
deliveryBoySchema.index({ email: 1 });

export const DeliveryBoy = mongoose.model("DeliveryBoy", deliveryBoySchema);