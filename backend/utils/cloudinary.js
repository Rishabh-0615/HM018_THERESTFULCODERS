import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.Cloud_Name, // dpjcnhspa
  api_key: process.env.Cloud_Api, // 174235114343372
  api_secret: process.env.Cloud_Secret, // rBwk-mbLQsmW89aYiX-mbkOdKf4
});

export default cloudinary;
