import express from 'express';
import { isAuthAdmin } from '../middlewares/isAdminAuth.js';
import { isAuth } from '../middlewares/isAuth.js';
import {
  adminLogin,
  logoutAdmin,
  meadmin,
  getUnverifiedPharmacists,
  verifyPharmacist,
  rejectPharmacist
} from '../controllers/adminController.js';

const router = express.Router();

router.post("/admin-login", adminLogin);
router.get("/meadmin", isAuthAdmin, meadmin);
router.post("/logoutAdmin", isAuthAdmin, logoutAdmin);
router.get("/unverified-pharmacists", isAuthAdmin, getUnverifiedPharmacists);
router.put("/verify-pharmacist", isAuthAdmin, verifyPharmacist);
router.delete("/reject-pharmacist", isAuthAdmin, rejectPharmacist);

export default router;
