import Medicine from "../models/medicineModel.js";

export const validatePrescriptionForOrder = async (order, prescription) => {
  if (!prescription) return false;

  if (prescription.validation.status !== "approved") return false;

  if (prescription.expiryDate && prescription.expiryDate < new Date()) {
    return false;
  }

  const medicines = await Medicine.find({
    _id: { $in: order.medicines.map((m) => m.medicineId) },
  });

  for (const med of medicines) {
    if (med.prescriptionRequired) {
      const found = prescription.medicinesMentioned.some(
        (pm) => pm.name.toLowerCase() === med.name.toLowerCase(),
      );
      if (!found) return false;
    }
  }

  return true;
};
