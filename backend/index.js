import  express from 'express';
import dotenv from 'dotenv';
import connectDb from './database/db.js';
import bodyParser from 'body-parser';
import path from 'path';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import axios from 'axios';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import FormData from 'form-data';
dotenv.config();
const port=process.env.PORT || 5000;

cloudinary.v2.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_Api,
    api_secret: process.env.Cloud_Secret,
  });

const app=express();

// CORS configuration - allow both local and production
const allowedOrigins = [
  'http://localhost:5173',
  'https://hm018-therestfulcoders-1.onrender.com'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(null, true); // For now, allow all origins
    }
    return callback(null, true);
  },
  credentials: true // Allow credentials (cookies)
}));
app.use(bodyParser.json()); 
app.use(express.json());
app.use(cookieParser());


import userRoutes from './routes/userRoutes.js';
import pharmaRoutes from './routes/pharmaRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import orderRoutesDhruv from './routes/orderRoutesDhruv.js';
import medicineRoutes from './routes/medicineRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';

// Pratik's routes
app.use('/api/user', userRoutes);
app.use('/api/pharma', pharmaRoutes);
app.use('/api/order', orderRoutes);

// Dhruv's routes
app.use('/api/medicines', medicineRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/orders', orderRoutesDhruv);

// Serve static files from frontend build
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/client/dist')));

// Catch-all route to serve index.html for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/client/dist/index.html'));
});

app.listen(port , ()=>{
    console.log(`Server is running on http://localhost:${port}`);
    connectDb();
})