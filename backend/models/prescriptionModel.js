// models/Prescription.js
import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },

    files: [
      {
        url: String,
        uploadedAt: Date
      }
    ],

    doctor: {
      name: String,
      registrationNumber: String,
      hospital: String
    },

    medicinesMentioned: [
      {
        name: String,
        dosage: String,
        duration: String
      }
    ],

    validation: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected", "expired"]
      },
      verifiedBy: mongoose.Schema.Types.ObjectId,
      verifiedAt: Date,
      remarks: String
    },

    expiryDate: Date,
    aiValidated: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Prescription", prescriptionSchema);