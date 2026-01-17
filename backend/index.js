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
import { connectDb } from "./database/db.js";
import userRoutes from "./routes/userRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5005;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// Routes
app.use("/api/user", userRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDb();
});
