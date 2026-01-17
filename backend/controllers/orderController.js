import Prescription from "../models/prescriptionModel.js";
import Medicine from "../models/medicineModel.js";

export const placeOrder = async (req, res) => {
  const { medicines, prescriptionId } = req.body;

  const medDocs = await Medicine.find({
    _id: { $in: medicines.map((m) => m.medicineId) },
  });

  const requiresPrescription = medDocs.some((m) => m.prescriptionRequired);

  if (requiresPrescription && !prescriptionId) {
    return res.status(400).json({
      message: "Prescription required for one or more medicines",
    });
  }

  const order = await Order.create({
    customerId: req.user._id,
    medicines,
    prescriptionId,
    orderStatus: requiresPrescription ? "placed" : "approved",
  });

  res.json(order);
};
