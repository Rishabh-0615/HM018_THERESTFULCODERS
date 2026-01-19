import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAuthAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Please login to access this resource",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC);

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if user has admin role
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired. Please login again.",
      });
    }

    res.status(500).json({
      message: "Internal server error",
    });
  }
};