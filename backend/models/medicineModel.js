import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contents : [{
        ingredient: String, 
    }],
    category: { 
      type: String,
      enum: [
        "Antibiotics",
        "Painkillers",
        "Vitamins & Supplements",
        "Antiseptics",
        "Cardiovascular",
        "Diabetes Care",
        "Respiratory",
        "Gastrointestinal",
        "Dermatology",
        "Neurology",
        "Orthopedic",
        "Eye Care",
        "Ear Care",
        "Gynecology",
        "Pediatrics",
        "First Aid",
        "Herbal & Ayurvedic",
        "Homeopathy",
        "Other"
      ],
      required: true
    },
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