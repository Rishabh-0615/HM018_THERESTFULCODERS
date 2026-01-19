import { DeliveryBoy } from "../models/deliveryBoyModel.js";
import generateToken from "../utils/generateToken.js";
import TryCatch from "../utils/TryCatch.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import validator from 'validator';

dotenv.config();

const TEMP_DELIVERY_BOYS = {};

// LOGIN DELIVERY BOY
export const loginDeliveryBoy = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const deliveryBoy = await DeliveryBoy.findOne({ email });
  if (!deliveryBoy) {
    return res.status(400).json({
      message: "Email or Password Incorrect.",
    });
  }

  // Check if delivery boy is active
  if (!deliveryBoy.isActive) {
    return res.status(403).json({
      message: "Your account has been deactivated. Please contact your pharmacist.",
    });
  }

  const comparePassword = await bcrypt.compare(password, deliveryBoy.password);

  if (!comparePassword) {
    return res.status(400).json({
      message: "Email or Password Incorrect.",
    });
  }

  generateToken(deliveryBoy, res);

  res.json({
    deliveryBoy,
    message: "Logged In",
    isPasswordChanged: deliveryBoy.isPasswordChanged
  });
});

// CHANGE PASSWORD (for first-time login)
export const changePassword = TryCatch(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      message: "Current password and new password are required",
    });
  }

  const deliveryBoy = await DeliveryBoy.findById(req.user._id);

  const comparePassword = await bcrypt.compare(currentPassword, deliveryBoy.password);
  if (!comparePassword) {
    return res.status(400).json({
      message: "Current password is incorrect",
    });
  }

  deliveryBoy.password = await bcrypt.hash(newPassword, 10);
  deliveryBoy.isPasswordChanged = true;
  await deliveryBoy.save();

  res.json({
    message: "Password changed successfully",
  });
});

// FORGET PASSWORD
export const forgetPassword = TryCatch(async (req, res) => {
  const { email } = req.body;

  if (Array.isArray(email) || !validator.isEmail(email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }

  const deliveryBoy = await DeliveryBoy.findOne({ email });
  if (!deliveryBoy) {
    return res.status(400).json({
      message: "No delivery boy found with this email",
    });
  }

  const otp = crypto.randomInt(100000, 999999);
  TEMP_DELIVERY_BOYS[email] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.MY_GMAIL,
      pass: process.env.MY_PASS,
    },
  });

  console.log(otp);

  try {
    await transporter.sendMail({
      from: process.env.MY_GMAIL,
      to: email,
      subject: "Your OTP Code - Password Reset",
      text: `Your OTP for password reset is: ${otp}`,
    });

    const token = jwt.sign({ email }, process.env.JWT_SEC, { expiresIn: "5m" });

    res.status(200).json({
      message: "OTP sent successfully.",
      token,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({
      message: "Failed to send OTP",
      error: error.message,
    });
  }
});

// RESET PASSWORD
export const resetPassword = TryCatch(async (req, res) => {
  const { token } = req.params;
  const { otp, password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  if (!otp || !token) {
    return res.status(400).json({ message: "OTP and token are required" });
  }

  let email;
  try {
    ({ email } = jwt.verify(token, process.env.JWT_SEC));
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const tempDeliveryBoy = TEMP_DELIVERY_BOYS[email];
  if (!tempDeliveryBoy) {
    return res.status(400).json({ message: "No OTP request found for this email" });
  }

  if (tempDeliveryBoy.expiresAt < Date.now()) {
    delete TEMP_DELIVERY_BOYS[email];
    return res.status(400).json({ message: "OTP expired" });
  }

  if (tempDeliveryBoy.otp.toString() !== otp.toString()) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const deliveryBoy = await DeliveryBoy.findOne({ email });
  if (!deliveryBoy) {
    return res.status(404).json({ message: "Delivery boy not found" });
  }

  deliveryBoy.password = await bcrypt.hash(password, 10);
  await deliveryBoy.save();

  delete TEMP_DELIVERY_BOYS[email];

  res.json({ message: "Password reset successful" });
});

// MY PROFILE
export const myProfile = TryCatch(async (req, res) => {
  const deliveryBoy = await DeliveryBoy.findById(req.user._id)
    .select("-password")
    .populate("pharmacist", "name email mobile");
  res.json(deliveryBoy);
});

// UPDATE PROFILE
export const updateProfile = TryCatch(async (req, res) => {
  const { name, mobile, location, vehicleNumber } = req.body;

  const deliveryBoy = await DeliveryBoy.findById(req.user._id);

  if (!deliveryBoy) {
    return res.status(404).json({
      message: "Delivery boy not found",
    });
  }

  if (name) deliveryBoy.name = name;
  if (mobile) deliveryBoy.mobile = mobile;
  if (location) deliveryBoy.location = location;
  if (vehicleNumber) deliveryBoy.vehicleNumber = vehicleNumber;

  await deliveryBoy.save();

  const updatedDeliveryBoy = deliveryBoy.toObject();
  delete updatedDeliveryBoy.password;

  res.json({
    deliveryBoy: updatedDeliveryBoy,
    message: "Profile updated successfully",
  });
});

// LOGOUT
export const logOutDeliveryBoy = TryCatch(async (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.json({
    message: "Logged out successfully",
  });
});