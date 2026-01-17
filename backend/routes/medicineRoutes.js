import express from "express";
import {
  getAllMedicines,
  getMedicineById,
  getMedicinesByPrescription
} from "../controllers/medicineController.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

// 1️⃣ Normal browsing (HOME / SEARCH)
router.get("/", getAllMedicines);

// 2️⃣ Medicine details
router.get("/:id", getMedicineById);

// 3️⃣ Prescription-based suggestions (NEW)
router.get(
  "/by-prescription/:prescriptionId",
  isAuth,
  getMedicinesByPrescription
);

export default router;
