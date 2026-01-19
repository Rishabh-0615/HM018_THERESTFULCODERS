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

dotenv.config();
const port = process.env.PORT || 5000;

cloudinary.v2.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Cloud_Api,
  api_secret: process.env.Cloud_Secret,
});

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());


import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import pharmaRoutes from './routes/pharmaRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import deliveryBoyRoutes from "./routes/deliveryBoyRoutes.js";
import medicineRoutes from  "./routes/medicineRoutes.js";
// import prescriptionRoutes from  "./routes/prescriptionRoutes.js";


app.use("/api/delivery-boy", deliveryBoyRoutes);

app.use("/api/user", userRoutes);
app.use("/api/pharma", pharmaRoutes);
app.use("/api/order", orderRoutes);
//import orderRoutes from "./routes/orderRoutes.js";
app.use("/api/medicines", medicineRoutes);
// app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/orders", orderRoutes);
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname,"client", "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});
