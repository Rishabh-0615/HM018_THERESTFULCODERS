import express from "express";
import {
  uploadPrescription,
  validatePrescription,
  approvePrescription,
  getPendingPrescriptions,
  getMyPrescriptions,
  getPrescriptionById,
  deletePrescription,
} from "../controllers/prescriptionController.js";
import { isAuth } from "../middlewares/isAuth.js";
import { uploadPrescription as uploadMiddleware } from "../middlewares/multer.js";

const router = express.Router();

// Customer routes
router.post("/upload", isAuth, uploadMiddleware, uploadPrescription);
router.get("/validate/:prescriptionId", isAuth, validatePrescription);
router.get("/my-prescriptions", isAuth, getMyPrescriptions);
router.get("/:prescriptionId", isAuth, getPrescriptionById);
router.delete("/:prescriptionId", isAuth, deletePrescription);

// Pharmacist routes
router.get("/pending/all", isAuth, getPendingPrescriptions);
router.put("/approve/:prescriptionId", isAuth, approvePrescription);

export default router;
