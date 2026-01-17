import Medicine from "../models/medicineModel.js";
import Prescription from "../models/prescriptionModel.js";


export const getAllMedicines = async (req, res) => {
  try {
    const { search } = req.query;

    const query = {
      isActive: true,
      stock: { $gt: 0 }
    };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const medicines = await Medicine.find(query);
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    res.json(medicine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/medicine.controller.js

export const getMedicinesByPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.prescriptionId);

    if (!prescription || prescription.validation.status !== "approved") {
      return res.status(400).json({ message: "Prescription not approved" });
    }

    const medicineNames = prescription.medicinesMentioned.map(
      m => new RegExp(`^${m.name}$`, "i")
    );

    const medicines = await Medicine.find({
      name: { $in: medicineNames },
      stock: { $gt: 0 },
      isActive: true
    });

    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
