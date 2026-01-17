import express from "express";
import { isAuth, isPharmacist } from "../middlewares/isAuth.js";
import {
  addMedicinePratik,
  updateMedicinePratik,
  deleteMedicinePratik,
  toggleMedicineStatusPratik,
  updateStockPratik,
  getAllMedicinesPratik,
  getMedicineByIdPratik,
  getLowStockMedicinesPratik,
  getNearExpiryMedicinesPratik,
  getExpiredMedicinesPratik,
  getPharmacistStatsPratik,
  getCategoriesPratik,
} from "../controllers/pharmaControllers.js";
import uploadFile from "../middlewares/multer.js";

const router = express.Router();



// Pharmacist routes - Medicine management
router.post("/medicine.pratik", isAuth, isPharmacist, uploadFile, addMedicinePratik);
router.put("/medicine.pratik/:id", isAuth, isPharmacist, uploadFile, updateMedicinePratik);
router.delete("/medicine.pratik/:id", isAuth, isPharmacist, deleteMedicinePratik);
router.patch("/medicine.pratik/:id/toggle-status.pratik", isAuth, isPharmacist, toggleMedicineStatusPratik);
router.patch("/medicine.pratik/:id/stock.pratik", isAuth, isPharmacist, updateStockPratik);

// Pharmacist routes - Inventory management
router.get("/low-stock.pratik", isAuth, isPharmacist, getLowStockMedicinesPratik);
router.get("/near-expiry.pratik", isAuth, isPharmacist, getNearExpiryMedicinesPratik);
router.get("/expired.pratik", isAuth, isPharmacist, getExpiredMedicinesPratik);
router.get("/stats.pratik", isAuth, isPharmacist, getPharmacistStatsPratik);

// Public/Customer routes
router.get("/medicines.pratik", getAllMedicinesPratik);
router.get("/medicine.pratik/:id", getMedicineByIdPratik);
router.get("/categories.pratik", getCategoriesPratik);

export default router;
