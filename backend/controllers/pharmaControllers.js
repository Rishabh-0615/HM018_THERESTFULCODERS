import Medicine from "../models/medicineModel.js";
import { User } from "../models/userModel.js";
import TryCatch from "../utils/TryCatch.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";


// Pharmacist - Add new medicine
export const addMedicinePratik = TryCatch(async (req, res) => {
  const {
    name,
    contents,
    category,
    description,
    notes,
    price,
    stock,
    prescriptionRequired,
    expiryDate,
    manufacturer,
    alerts
  } = req.body;

  const file = req.file;
  let imageData = {};

  if (file) {
    const fileUrl = getDataUrl(file);
    const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);
    imageData = {
      id: cloud.public_id,
      url: cloud.secure_url
    };
  }

  const medicine = await Medicine.create({
    name,
    contents: contents || [],
    category,
    description,
    image: imageData,
    notes,
    price,
    stock,
    prescriptionRequired: prescriptionRequired || false,
    expiryDate,
    manufacturer,
    alerts: alerts || { lowStock: 10, nearExpiryDays: 30 }
  });

  res.status(201).json({
    medicine,
    message: "Medicine added successfully"
  });
});

// Pharmacist - Update medicine
export const updateMedicinePratik = TryCatch(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const medicine = await Medicine.findById(id);

  if (!medicine) {
    return res.status(404).json({
      message: "Medicine not found"
    });
  }

  const file = req.file;
  if (file) {
    // Delete old image if exists
    if (medicine.image && medicine.image.id) {
      await cloudinary.v2.uploader.destroy(medicine.image.id);
    }

    const fileUrl = getDataUrl(file);
    const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);
    updateData.image = {
      id: cloud.public_id,
      url: cloud.secure_url
    };
  }

  const updatedMedicine = await Medicine.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  res.json({
    medicine: updatedMedicine,
    message: "Medicine updated successfully"
  });
});

// Pharmacist - Delete medicine
export const deleteMedicinePratik = TryCatch(async (req, res) => {
  const { id } = req.params;

  const medicine = await Medicine.findById(id);

  if (!medicine) {
    return res.status(404).json({
      message: "Medicine not found"
    });
  }

  // Delete image from cloudinary if exists
  if (medicine.image && medicine.image.id) {
    await cloudinary.v2.uploader.destroy(medicine.image.id);
  }

  await Medicine.findByIdAndDelete(id);

  res.json({
    message: "Medicine deleted successfully"
  });
});

// Pharmacist - Toggle medicine active status
export const toggleMedicineStatusPratik = TryCatch(async (req, res) => {
  const { id } = req.params;

  const medicine = await Medicine.findById(id);

  if (!medicine) {
    return res.status(404).json({
      message: "Medicine not found"
    });
  }

  medicine.isActive = !medicine.isActive;
  await medicine.save();

  res.json({
    medicine,
    message: `Medicine ${medicine.isActive ? 'activated' : 'deactivated'} successfully`
  });
});

// Pharmacist - Update stock
export const updateStockPratik = TryCatch(async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  if (stock === undefined || stock < 0) {
    return res.status(400).json({
      message: "Valid stock quantity is required"
    });
  }

  const medicine = await Medicine.findByIdAndUpdate(
    id,
    { stock },
    { new: true }
  );

  if (!medicine) {
    return res.status(404).json({
      message: "Medicine not found"
    });
  }

  res.json({
    medicine,
    message: "Stock updated successfully"
  });
});

// Get all medicines (public/customer)
export const getAllMedicinesPratik = TryCatch(async (req, res) => {
  const { 
    search, 
    category, 
    prescriptionRequired, 
    minPrice, 
    maxPrice,
    inStock,
    page = 1,
    limit = 20
  } = req.query;

  const query = { isActive: true };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { manufacturer: { $regex: search, $options: 'i' } }
    ];
  }

  if (category) {
    query.category = category;
  }

  if (prescriptionRequired !== undefined) {
    query.prescriptionRequired = prescriptionRequired === 'true';
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (inStock === 'true') {
    query.stock = { $gt: 0 };
  }

  const skip = (page - 1) * limit;

  const medicines = await Medicine.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Medicine.countDocuments(query);

  res.json({
    medicines,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
    total,
    message: "Medicines fetched successfully"
  });
});

// Get single medicine details
export const getMedicineByIdPratik = TryCatch(async (req, res) => {
  const { id } = req.params;

  const medicine = await Medicine.findById(id);

  if (!medicine) {
    return res.status(404).json({
      message: "Medicine not found"
    });
  }

  res.json({
    medicine,
    message: "Medicine fetched successfully"
  });
});

// Pharmacist - Get low stock medicines
export const getLowStockMedicinesPratik = TryCatch(async (req, res) => {
  const medicines = await Medicine.find({
    isActive: true,
    $expr: { $lte: ["$stock", "$alerts.lowStock"] }
  }).sort({ stock: 1 });

  res.json({
    medicines,
    count: medicines.length,
    message: "Low stock medicines fetched successfully"
  });
});

// Pharmacist - Get medicines near expiry
export const getNearExpiryMedicinesPratik = TryCatch(async (req, res) => {
  const currentDate = new Date();
  
  const medicines = await Medicine.find({
    isActive: true,
    expiryDate: { $exists: true }
  });

  const nearExpiry = medicines.filter(medicine => {
    const daysUntilExpiry = Math.floor(
      (new Date(medicine.expiryDate) - currentDate) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= (medicine.alerts?.nearExpiryDays || 30) && daysUntilExpiry >= 0;
  });

  res.json({
    medicines: nearExpiry,
    count: nearExpiry.length,
    message: "Near expiry medicines fetched successfully"
  });
});

// Pharmacist - Get expired medicines
export const getExpiredMedicinesPratik = TryCatch(async (req, res) => {
  const currentDate = new Date();
  
  const medicines = await Medicine.find({
    expiryDate: { $lt: currentDate }
  });

  res.json({
    medicines,
    count: medicines.length,
    message: "Expired medicines fetched successfully"
  });
});

// Pharmacist - Get dashboard stats
export const getPharmacistStatsPratik = TryCatch(async (req, res) => {
  const totalMedicines = await Medicine.countDocuments({ isActive: true });
  const inactiveMedicines = await Medicine.countDocuments({ isActive: false });
  const outOfStock = await Medicine.countDocuments({ stock: 0, isActive: true });
  
  const lowStock = await Medicine.find({
    isActive: true,
    $expr: { $lte: ["$stock", "$alerts.lowStock"] }
  });

  const currentDate = new Date();
  const medicines = await Medicine.find({
    isActive: true,
    expiryDate: { $exists: true }
  });

  const nearExpiry = medicines.filter(medicine => {
    const daysUntilExpiry = Math.floor(
      (new Date(medicine.expiryDate) - currentDate) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= (medicine.alerts?.nearExpiryDays || 30) && daysUntilExpiry >= 0;
  });

  const totalValue = await Medicine.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: null, total: { $sum: { $multiply: ["$price", "$stock"] } } } }
  ]);

  res.json({
    stats: {
      totalMedicines,
      inactiveMedicines,
      outOfStock,
      lowStockCount: lowStock.length,
      nearExpiryCount: nearExpiry.length,
      totalInventoryValue: totalValue[0]?.total || 0
    },
    message: "Stats fetched successfully"
  });
});

// Get all categories
export const getCategoriesPratik = TryCatch(async (req, res) => {
  const categories = await Medicine.distinct("category", { isActive: true });
  
  res.json({
    categories: categories.filter(cat => cat),
    message: "Categories fetched successfully"
  });
});
