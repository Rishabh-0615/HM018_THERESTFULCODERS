import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "pharmacist"],
      required: true
    },
    location: { type: String, default: "" },
    isVerifiedByAdmin: {
      type: Boolean,
      default: false,
      required: function() {
        return this.role === 'pharmacist';
      }
    }
  },
  { timestamps: true }
);

schema.pre('save', function(next) {
  if (this.role !== 'pharmacist') { 
    this.isVerifiedByAdmin = undefined; 
  }
  next();
});

export const User = mongoose.model("User", schema);