import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import uploadFile from "../middlewares/multer.js";
import {
  placeOrder,
  getMyOrders,
  getRefillSuggestions,
  checkOrderSafety,
  getMyOrdersWithDelivery
} from "../controllers/orderController.js";

const router = express.Router();

// Customer order routes
router.post("/", isAuth, uploadFile, placeOrder); // Place order with file upload support
router.get("/my-orders", isAuth, getMyOrders); // Get my orders
router.get("/refill-suggestions", isAuth, getRefillSuggestions); // Get refill suggestions
router.post("/check-safety", isAuth, checkOrderSafety); // Check order safety
router.get("/my-orders-with-delivery", isAuth, getMyOrdersWithDelivery); // Get orders with delivery info

export default router;
