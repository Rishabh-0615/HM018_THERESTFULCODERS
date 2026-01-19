import jwt from "jsonwebtoken";
import { DeliveryBoy } from "../models/deliveryBoyModel.js";

export const isDeliveryBoyAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(403).json({
        message: "Please login first",
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SEC);

    // CHANGED: Use 'id' instead of '_id' to match generateToken
    req.user = await DeliveryBoy.findById(decodedData.id);

    if (!req.user) {
      return res.status(404).json({
        message: "Delivery boy not found",
      });
    }

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({
      message: "Please login",
    });
  }
};