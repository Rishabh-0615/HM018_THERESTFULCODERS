import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contents : [{
        ingredient: String, 
    }],
    category: String,
    description: String,
    image: { id: String, url: String },
    notes: String,

    price: { type: Number, required: true },
    stock: { type: Number, required: true },

    prescriptionRequired: { type: Boolean, default: false },

    expiryDate: Date,
    manufacturer: String,

   
    alerts: {
      lowStock: Number,
      nearExpiryDays: Number
    },
isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Medicine", medicineSchema);