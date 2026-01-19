// models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: mongoose.Schema.Types.ObjectId,

    provider: String, // Razorpay, Stripe
    transactionId: String,

    amount: Number,
    currency: String,

    status: {
      type: String,
      enum: ["initiated", "success", "failed", "refunded"]
    },

    meta: Object
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);