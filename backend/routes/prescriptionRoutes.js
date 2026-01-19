import express from "express";
import {
  uploadPrescription,
  validatePrescription,
  approvePrescription,
  getPendingPrescriptions,
  getMyPrescriptions,
  getPrescriptionById,
  deletePrescription,
  uploadPrescriptionSimple,
  getMyPrescriptionsSimple,
} from "../controllers/prescriptionController.js";
import { isAuth } from "../middlewares/isAuth.js";
import { uploadPrescription as multerUpload } from "../middlewares/multer.js";

const router = express.Router();

// Upload prescription with AI extraction (expects file upload)
router.post("/upload", isAuth, multerUpload, uploadPrescription);

// Validate prescription stock
router.get("/validate/:prescriptionId", isAuth, validatePrescription);

// Approve/reject prescription (pharmacist only)
router.put("/approve/:prescriptionId", isAuth, approvePrescription);

// Get pending prescriptions (pharmacist dashboard)
router.get("/pending", isAuth, getPendingPrescriptions);

// Get customer's prescriptions
router.get("/my", isAuth, getMyPrescriptions);

// Get single prescription details
router.get("/:prescriptionId", isAuth, getPrescriptionById);

// Delete prescription (customer only)
router.delete("/:prescriptionId", isAuth, deletePrescription);

// Alternative simple upload (if needed, e.g., for manual entry)
router.post("/upload-simple", isAuth, uploadPrescriptionSimple);

// Alternative simple get prescriptions (if needed)
router.get("/my-simple", isAuth, getMyPrescriptionsSimple);

export default router;
