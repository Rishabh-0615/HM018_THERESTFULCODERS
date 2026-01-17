import express from "express";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import bodyParser from "body-parser";
import path from "path";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import axios from "axios";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import FormData from "form-data";
import userRoutes from "./routes/userRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5005;

// Middlewares
app.use(express.json());
app.use(cookieParser());

import userRoutes from "./routes/userRoutes.js";
import pharmaRoutes from "./routes/pharmaRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

app.use("/api/user", userRoutes);
app.use("/api/pharma", pharmaRoutes);
app.use("/api/order", orderRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});
