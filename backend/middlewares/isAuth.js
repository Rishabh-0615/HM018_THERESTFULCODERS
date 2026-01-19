import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(403).json({
        message: "Please Login",
      });

    const decodedData = jwt.verify(token, process.env.JWT_SEC);

    if (!decodedData)
      return res.status(403).json({
        message: "token expired",
      });

    req.user = await User.findById(decodedData.id);

    if (!req.user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if pharmacist user is verified
    if (req.user.role === 'pharmacist' && !req.user.isVerifiedByAdmin) {
      return res.status(403).json({
        message: "Your account is pending admin verification",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: "Please Login",
    });
  }
};

export const isPharmacist = async (req, res, next) => {
  try {
    if (req.user.role !== 'pharmacist') {
      return res.status(403).json({
        message: "Access denied. Pharmacist only.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      message: "Authorization error",
    });
  }
};

export const isCustomer = async (req, res, next) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({
        message: "Access denied. Customer only.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      message: "Authorization error",
    });
  }
};