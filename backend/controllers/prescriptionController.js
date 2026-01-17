import "dotenv/config";
import Prescription from "../models/prescriptionModel.js";
import Medicine from "../models/medicineModel.js";
import TryCatch from "../utils/TryCatch.js";
import cloudinary from "../utils/cloudinary.js";
import Tesseract from "tesseract.js";
import * as pdfParse from "pdf-parse";
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Upload Prescription with AI Extraction
export const uploadPrescription = TryCatch(async (req, res) => {
  const { doctorName, doctorRegNo, hospital } = req.body;
  const customerId = req.user._id;

  if (!req.file) {
    return res.status(400).json({ message: "Prescription file is required" });
  }

  // Extract text BEFORE deleting file
  let extractedText = "";
  const fileType = req.file.mimetype;

  if (fileType.includes("pdf")) {
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    extractedText = pdfData.text;
  } else if (fileType.includes("image")) {
    const ocrResult = await Tesseract.recognize(req.file.path, "eng");
    extractedText = ocrResult.data.text;
  }

  // Generate LLM summary for pharmacist
  let summary = "Summary not available.";
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a medical assistant. Summarize the prescription text concisely, including patient details, doctor info, medicines with dosages, and any instructions. Keep it professional and under 200 words.",
        },
        {
          role: "user",
          content: `Prescription text: ${extractedText}`,
        },
      ],
      max_tokens: 200,
    });
    summary = response.choices[0].message.content.trim();
  } catch (error) {
    console.error("LLM summarization failed:", error);
    // Fallback: basic summary from extracted data
  }

  // NOW upload to Cloudinary
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "prescriptions",
    resource_type: "auto",
  });

  // NOW delete local file
  fs.unlinkSync(req.file.path);

  // Extract structured data using regex
  const structuredData = extractMedicinesWithRegex(extractedText);

  // Create prescription record
  const prescription = await Prescription.create({
    customerId,
    files: [{ url: result.secure_url, uploadedAt: new Date() }],
    doctor: {
      name: doctorName || structuredData.doctorName || "Not provided",
      registrationNumber:
        doctorRegNo || structuredData.doctorRegNo || "Not provided",
      hospital: hospital || structuredData.hospital || "Not provided",
    },
    medicinesMentioned: structuredData.medicines,
    validation: {
      status: "pending",
    },
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days validity
    aiValidated: true,
    summary, // Add LLM summary for pharmacist
  });

  res.status(201).json({
    message: "Prescription uploaded successfully",
    prescription,
    extractedData: structuredData,
    extractedText, // For debugging
  });
});

// Enhanced Regex-based extraction
function extractMedicinesWithRegex(text) {
  const medicines = [];
  const lines = text.split("\n").filter((line) => line.trim() !== "");

  // Common medicine patterns
  const patterns = [
    // Pattern 1: Medicine Name + Dosage (e.g., "Paracetamol 500mg")
    /([A-Z][a-z]+(?:[A-Z][a-z]+)*)\s*(\d+\s*(?:mg|ml|tablet|capsule|syrup|injection))/gi,

    // Pattern 2: Tab/Cap/Syp prefix (e.g., "Tab. Crocin 500mg")
    /(?:Tab\.|Cap\.|Syp\.|Inj\.)\s*([A-Z][a-z]+(?:[A-Z][a-z]+)*)\s*(\d+\s*(?:mg|ml|tablet|capsule))/gi,

    // Pattern 3: Simple medicine names in separate lines
    /^([A-Z][a-z]{2,}(?:\s+[A-Z][a-z]+)*)\s*$/gm,
  ];

  // Try each pattern
  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const name = match[1]?.trim();
      const dosage = match[2]?.trim() || "As prescribed";

      if (
        name &&
        !medicines.some((m) => m.name.toLowerCase() === name.toLowerCase())
      ) {
        medicines.push({
          name: name,
          dosage: dosage,
          duration: extractDuration(text, name) || "As prescribed",
        });
      }
    }
  });

  // Extract doctor info
  const doctorMatch = text.match(/Dr\.?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
  const regNoMatch = text.match(
    /(?:Reg\.?|Registration|Regn\.?)\s*(?:No\.?|Number|#)?\s*[:.\s]*([A-Z0-9\-\/]+)/i,
  );
  const hospitalMatch = text.match(
    /(?:Hospital|Clinic|Medical Center)[:.\s]*([A-Za-z\s]+)/i,
  );

  return {
    doctorName: doctorMatch ? doctorMatch[1].trim() : "",
    doctorRegNo: regNoMatch ? regNoMatch[1].trim() : "",
    hospital: hospitalMatch ? hospitalMatch[1].trim() : "",
    medicines:
      medicines.length > 0
        ? medicines
        : [
            {
              name: "Unable to extract",
              dosage: "Please enter manually",
              duration: "",
            },
          ],
  };
}

// Extract duration from context
function extractDuration(text, medicineName) {
  const medicineIndex = text.toLowerCase().indexOf(medicineName.toLowerCase());
  if (medicineIndex === -1) return null;

  const contextText = text.substring(medicineIndex, medicineIndex + 200);

  const durationPatterns = [
    /(\d+)\s*(?:days?|weeks?|months?)/i,
    /for\s+(\d+)\s*(?:days?|weeks?|months?)/i,
    /x\s*(\d+)\s*(?:days?|weeks?)/i,
  ];

  for (const pattern of durationPatterns) {
    const match = contextText.match(pattern);
    if (match) return match[0];
  }

  return null;
}

// Validate Prescription & Check Stock Availability
export const validatePrescription = TryCatch(async (req, res) => {
  const { prescriptionId } = req.params;

  const prescription = await Prescription.findById(prescriptionId);
  if (!prescription) {
    return res.status(404).json({ message: "Prescription not found" });
  }

  const validationResults = [];
  let allAvailable = true;
  let requiresPharmacistApproval = false;

  // Check each medicine against stock
  for (const med of prescription.medicinesMentioned) {
    // Flexible search - partial match
    const medicine = await Medicine.findOne({
      name: { $regex: new RegExp(med.name.split(" ")[0], "i") }, // Search by first word
      isActive: true,
    });

    if (!medicine) {
      validationResults.push({
        medicine: med.name,
        available: false,
        reason: "Medicine not found in inventory",
      });
      allAvailable = false;
    } else if (medicine.stock <= 0) {
      validationResults.push({
        medicine: med.name,
        available: false,
        reason: "Out of stock",
        medicineDetails: {
          name: medicine.name,
          id: medicine._id,
        },
      });
      allAvailable = false;
    } else {
      const needsApproval =
        medicine.prescriptionRequired &&
        prescription.validation.status !== "approved";

      if (needsApproval) {
        requiresPharmacistApproval = true;
      }

      validationResults.push({
        medicine: med.name,
        available: true,
        stock: medicine.stock,
        price: medicine.price,
        medicineId: medicine._id,
        requiresApproval: needsApproval,
        matchedMedicine: medicine.name, // Show actual matched medicine name
      });
    }
  }

  res.json({
    prescriptionId,
    validationResults,
    allAvailable,
    requiresPharmacistApproval,
    prescriptionStatus: prescription.validation.status,
  });
});

// Pharmacist Approves/Rejects Prescription
export const approvePrescription = TryCatch(async (req, res) => {
  const { prescriptionId } = req.params;
  const { status, remarks } = req.body; // status: "approved" or "rejected"
  const pharmacistId = req.user._id;

  if (req.user.role !== "pharmacist" && req.user.role !== "admin") {
    return res.status(403).json({
      message: "Only pharmacists can approve prescriptions",
    });
  }

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({
      message: "Invalid status. Must be 'approved' or 'rejected'",
    });
  }

  const prescription = await Prescription.findByIdAndUpdate(
    prescriptionId,
    {
      "validation.status": status,
      "validation.verifiedBy": pharmacistId,
      "validation.verifiedAt": new Date(),
      "validation.remarks": remarks || "",
    },
    { new: true },
  ).populate("customerId", "name email mobile");

  if (!prescription) {
    return res.status(404).json({ message: "Prescription not found" });
  }

  res.json({
    message: `Prescription ${status} successfully`,
    prescription,
  });
});

// Get All Pending Prescriptions (for Pharmacist Dashboard)
export const getPendingPrescriptions = TryCatch(async (req, res) => {
  if (req.user.role !== "pharmacist" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const prescriptions = await Prescription.find({
    "validation.status": "pending",
  })
    .populate("customerId", "name email mobile")
    .sort({ createdAt: -1 });

  res.json({
    count: prescriptions.length,
    prescriptions,
  });
});

// Get Customer's Prescriptions
export const getMyPrescriptions = TryCatch(async (req, res) => {
  const prescriptions = await Prescription.find({
    customerId: req.user._id,
  })
    .populate("validation.verifiedBy", "name")
    .sort({ createdAt: -1 });

  res.json({
    count: prescriptions.length,
    prescriptions,
  });
});

// Get Single Prescription Details
export const getPrescriptionById = TryCatch(async (req, res) => {
  const { prescriptionId } = req.params;

  const prescription = await Prescription.findById(prescriptionId)
    .populate("customerId", "name email mobile")
    .populate("validation.verifiedBy", "name email");

  if (!prescription) {
    return res.status(404).json({ message: "Prescription not found" });
  }

  // Check authorization
  const isOwner =
    prescription.customerId._id.toString() === req.user._id.toString();
  const isPharmacist =
    req.user.role === "pharmacist" || req.user.role === "admin";

  if (!isOwner && !isPharmacist) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json(prescription);
});

// Delete Prescription
export const deletePrescription = TryCatch(async (req, res) => {
  const { prescriptionId } = req.params;

  const prescription = await Prescription.findById(prescriptionId);

  if (!prescription) {
    return res.status(404).json({ message: "Prescription not found" });
  }

  // Only owner can delete
  if (prescription.customerId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Delete from Cloudinary
  if (prescription.files && prescription.files.length > 0) {
    for (const file of prescription.files) {
      const publicId = file.url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`prescriptions/${publicId}`);
    }
  }

  await prescription.deleteOne();

  res.json({ message: "Prescription deleted successfully" });
});

export const uploadPrescriptionSimple = async (req, res) => {
  try {
    const prescription = await Prescription.create({
      customerId: req.user._id,
      files: req.body.files,
      doctor: req.body.doctor,
      medicinesMentioned: req.body.medicinesMentioned,
      expiryDate: req.body.expiryDate,
      validation: { status: "pending" },
    });

    res.status(201).json(prescription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyPrescriptionsSimple = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      customerId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
