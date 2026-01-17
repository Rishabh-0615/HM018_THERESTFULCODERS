import Prescription from "../models/prescriptionModel.js";

export const uploadPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.create({
      customerId: req.user._id,
      files: req.body.files,
      doctor: req.body.doctor,
      medicinesMentioned: req.body.medicinesMentioned,
      expiryDate: req.body.expiryDate,
      validation: { status: "pending" }
    });

    res.status(201).json(prescription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      customerId: req.user._id
    }).sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
