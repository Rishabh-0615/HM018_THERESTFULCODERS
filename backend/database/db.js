import mongoose from "mongoose";
import { defaultAdmin } from "../controllers/adminController.js";
const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{
            dbName : "PCCOE",
        });
        console.log("URI:", process.env.MONGO_URL);

        console.log("connected")
        await defaultAdmin();

    }catch(error){
        console.log(error)
    }
};

export default connectDb;