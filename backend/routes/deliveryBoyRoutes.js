import express from "express";
import { isDeliveryBoyAuth } from "../middlewares/isDeliveryBoyAuth.js"; // ADD THIS
import {
  loginDeliveryBoy,
  changePassword,
  forgetPassword,
  resetPassword,
  myProfile,
  updateProfile,
  logOutDeliveryBoy,
} from "../controllers/DeliveryBoyController.js";

const router = express.Router();
router.post("/login", loginDeliveryBoy);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", isDeliveryBoyAuth, myProfile); 
router.put("/change-password", isDeliveryBoyAuth, changePassword); 
router.put("/update-profile", isDeliveryBoyAuth, updateProfile); 
router.get("/logout", isDeliveryBoyAuth, logOutDeliveryBoy); 

export default router;