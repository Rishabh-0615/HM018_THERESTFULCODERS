import express from "express";
import { isAuth, isPharmacist, isCustomer } from "../middlewares/isAuth.js";
import {
  createOrderPratik,
  getAllOrdersPratik,
  getOrderByIdPratik,
  updateOrderStatusPratik,
  updatePaymentStatusPratik,
  getMyOrdersPratik,
  getOrderStatsPratik,
  cancelOrderPratik
} from "../controllers/orderControllers.js";

const router = express.Router();

// Customer routes
router.post("/order.pratik", isAuth, isCustomer, createOrderPratik);
router.get("/my-orders.pratik", isAuth, isCustomer, getMyOrdersPratik);
router.patch("/order.pratik/:id/cancel", isAuth, isCustomer, cancelOrderPratik);

// Pharmacist routes
router.get("/orders.pratik", isAuth, isPharmacist, getAllOrdersPratik);
router.get("/order-stats.pratik", isAuth, isPharmacist, getOrderStatsPratik);
router.patch("/order.pratik/:id/status", isAuth, isPharmacist, updateOrderStatusPratik);
router.patch("/order.pratik/:id/payment", isAuth, isPharmacist, updatePaymentStatusPratik);

// Shared routes
router.get("/order.pratik/:id", isAuth, getOrderByIdPratik);

export default router;
