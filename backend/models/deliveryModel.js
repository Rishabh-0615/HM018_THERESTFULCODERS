// models/Delivery.js
import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },

    deliveryAgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    currentStatus: {
      type: String,
      enum: ["assigned", "picked", "in-transit", "delivered"],
      default: "assigned"
    },

    location: {
      latitude: Number,
      longitude: Number
    },
    instructions: String
  },
  { timestamps: true }
);

export default mongoose.model("Delivery", deliverySchema);