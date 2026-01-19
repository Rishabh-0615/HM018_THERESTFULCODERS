import TryCatch from "../utils/TryCatch.js";
import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
import generateAdminToken from "../utils/generateAdminToken.js";

dotenv.config();

export const defaultAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
    
    if (existingAdmin) {
      console.log("ℹ️ Admin user already exists");
      
      // Ensure the user has admin role
      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        await existingAdmin.save();
        console.log("✅ Updated user to admin role");
      }
      return;
    }

    // Check if mobile number is already taken
    const userWithMobile = await User.findOne({ mobile: "9999999999" });
    
    if (userWithMobile) {
      console.log("⚠️ Mobile number already exists for user:", userWithMobile.email);
      
      // Delete the user with duplicate mobile and create admin
      await User.deleteOne({ mobile: "9999999999" });
      console.log("🗑️ Removed duplicate user");
    }

    // Create new admin
    const hashedPassword = await bcrypt.hash("admin", 10);
    await User.create({
      name: "Admin",
      mobile: "9999999999", 
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });
    console.log("✅ Default admin created successfully");
    console.log("📧 Email: admin@gmail.com | 🔑 Password: admin");
    
  } catch (error) {
    console.error("❌ Error in defaultAdmin:", error.message);
  }
};

export const adminLogin = TryCatch(async(req, res) => {
  const { email, password } = req.body;
  console.log("Admin login attempt:", email);

  // Find user by email
  const user = await User.findOne({ email });
  
  if (!user) {
    return res.status(404).json({ message: "Admin not found" });
  }

  // Check if user has admin role
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin privileges required." });
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    return res.status(401).json({
      message: "Incorrect username or password.",
    });
  } 

  // Generate token
  generateAdminToken(user, res);
  
  return res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    message: "Admin login successful",
  });
});

export const meadmin = TryCatch(async (req, res) => {
  const admin = await User.findById(req.user._id);
  
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  // Check if user is actually an admin
  if (admin.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin privileges required." });
  }
  
  res.status(200).json(admin);
});

export const logoutAdmin = TryCatch(async(req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Admin logged out successfully",
  });
});

export const getUnverifiedPharmacists = TryCatch(async (req, res) => {
  const unverifiedPharmacists = await User.find({
    role: "pharmacist",
    isVerifiedByAdmin: false
  }).select("-password");

  res.status(200).json({
    success: true,
    count: unverifiedPharmacists.length,
    pharmacists: unverifiedPharmacists
  });
});

export const verifyPharmacist = TryCatch(async (req, res) => {
  const { userId } = req.body;

  const pharmacist = await User.findById(userId);

  if (!pharmacist) {
    return res.status(404).json({ message: "Pharmacist not found" });
  }

  if (pharmacist.role !== "pharmacist") {
    return res.status(400).json({ message: "User is not a pharmacist" });
  }

  pharmacist.isVerifiedByAdmin = true;
  await pharmacist.save();

  res.status(200).json({
    success: true,
    message: "Pharmacist verified successfully",
    pharmacist: {
      _id: pharmacist._id,
      name: pharmacist.name,
      email: pharmacist.email,
      isVerifiedByAdmin: pharmacist.isVerifiedByAdmin
    }
  });
});

export const rejectPharmacist = TryCatch(async (req, res) => {
  const { userId } = req.body;

  const pharmacist = await User.findById(userId);

  if (!pharmacist) {
    return res.status(404).json({ message: "Pharmacist not found" });
  }

  if (pharmacist.role !== "pharmacist") {
    return res.status(400).json({ message: "User is not a pharmacist" });
  }

  await User.deleteOne({ _id: userId });

  res.status(200).json({
    success: true,
    message: "Pharmacist request rejected and removed"
  });
});