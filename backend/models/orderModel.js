// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    medicines: [
      {
        medicineId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine"
        },
        quantity: Number,
        price: Number
      }
    ],

    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription"
    },

    totalAmount: Number,

    orderStatus: {
      type: String,
      enum: [
        "placed",
        "approved",
        "packed",
        "shipped",
        "delivered",
        "cancelled"
      ],
      default: "placed"
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);