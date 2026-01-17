// models/Order.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  image: { id: String, url: String }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      mobile: { type: String, required: true },
      address: { type: String, required: true }
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"],
      default: "pending"
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "online"],
      default: "cash"
    },
    prescriptionRequired: {
      type: Boolean,
      default: false
    },
    prescriptionImage: {
      id: String,
      url: String
    },
    notes: String,
    pharmacistNotes: String,
    deliveryDate: Date
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);