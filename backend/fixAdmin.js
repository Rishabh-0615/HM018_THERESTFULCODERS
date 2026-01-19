import mongoose from "mongoose";
import { User } from "./models/userModel.js";
import bcrypt from 'bcrypt';
import dotenv from "dotenv";

dotenv.config();

const fixAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "PCCOE",
    });
    console.log("✅ Connected to MongoDB");

    // Find the user with the duplicate mobile
    const existingUser = await User.findOne({ mobile: "9999999999" });

    if (existingUser) {
      console.log("📌 Found existing user:", existingUser.email);

      // Option 1: Update existing user to admin
      if (existingUser.email === "admin@gmail.com") {
        existingUser.role = "admin";
        const hashedPassword = await bcrypt.hash("admin", 10);
        existingUser.password = hashedPassword;
        await existingUser.save();
        console.log("✅ Updated existing user to admin role");
      } else {
        // Option 2: Delete the duplicate and create new admin
        await User.deleteOne({ mobile: "9999999999" });
        console.log("🗑️ Deleted duplicate user");

        const hashedPassword = await bcrypt.hash("admin", 10);
        await User.create({
          name: "Admin",
          mobile: "9999999999",
          email: "admin@gmail.com",
          password: hashedPassword,
          role: "admin",
        });
        console.log("✅ Created new admin user");
      }
    } else {
      // No existing user, create admin
      const hashedPassword = await bcrypt.hash("admin", 10);
      await User.create({
        name: "Admin",
        mobile: "9999999999",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
      });
      console.log("✅ Created new admin user");
    }

    // Verify admin exists
    const admin = await User.findOne({ email: "admin@gmail.com" });
    console.log("✅ Admin user verified:", {
      name: admin.name,
      email: admin.email,
      role: admin.role,
      mobile: admin.mobile
    });

    console.log("\n🎉 Admin setup complete!");
    console.log("📧 Email: admin@gmail.com");
    console.log("🔑 Password: admin");

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\n👋 Database connection closed");
    process.exit(0);
  }
};

// Run the script
fixAdminUser();