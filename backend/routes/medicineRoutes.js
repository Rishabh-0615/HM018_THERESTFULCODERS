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

// 3️⃣ Prescription-based suggestions (MUST be before /:id)
router.get(
  "/by-prescription/:prescriptionId",
  isAuth,
  getMedicinesByPrescription
);

// 2️⃣ Medicine details (generic route at end)
router.get("/:id", getMedicineById);

export default router;
