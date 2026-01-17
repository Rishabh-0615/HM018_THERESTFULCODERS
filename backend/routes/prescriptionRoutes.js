import express from "express";
import {
  uploadPrescription,
  getMyPrescriptions
} from "../controllers/prescriptionController.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/", isAuth, uploadPrescription);
router.get("/", isAuth, getMyPrescriptions);

export default router;
