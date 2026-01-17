import Order from "../models/orderModel.js";
import Medicine from "../models/medicineModel.js";
import Prescription from "../models/prescriptionModel.js";
import Delivery from "../models/deliveryModel.js";


export const placeOrder = async (req, res) => {
  try {
    const { medicines, prescriptionId, shippingAddress, paymentMethod, notes, totalAmount } = req.body;

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.flatNo || !shippingAddress.street || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode || 
        !shippingAddress.phone) {
      return res.status(400).json({
        message: "Complete shipping address is required"
      });
    }

    // check prescription if provided
    if (prescriptionId) {
      const prescription = await Prescription.findById(prescriptionId);
      if (!prescription || prescription.validation.status !== "approved") {
        return res.status(400).json({
          message: "Valid approved prescription required"
        });
      }
    }

    let calculatedTotal = 0;
    const orderMedicines = [];

    for (let item of medicines) {
      const med = await Medicine.findById(item.medicineId);

      if (!med) {
        return res.status(404).json({ message: "Medicine not found" });
      }

      if (med.prescriptionRequired && !prescriptionId) {
        return res.status(400).json({
          message: `${med.name} requires a prescription`
        });
      }

      calculatedTotal += med.price * item.quantity;
      orderMedicines.push({
        medicineId: item.medicineId,
        quantity: item.quantity,
        price: med.price
      });
    }

    const order = await Order.create({
      customerId: req.user._id,
      medicines: orderMedicines,
      prescriptionId,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      notes: notes || "",
      totalAmount: calculatedTotal,
      paymentStatus: paymentMethod === "COD" ? "pending" : "pending"
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customerId: req.user._id
    })
      .populate("medicines.medicineId")
      .populate("prescriptionId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getRefillSuggestions = async (req, res) => {
  try {
    const userId = req.user._id;

    // get latest delivered orders
    const orders = await Order.find({
      customerId: userId,
      orderStatus: "delivered"
    })
      .populate("prescriptionId")
      .sort({ createdAt: -1 })
      .limit(5);

    const suggestions = [];

    for (let order of orders) {
      if (!order.prescriptionId) continue;

      const prescription = order.prescriptionId;
      if (prescription.validation.status !== "approved") continue;

      prescription.medicinesMentioned.forEach(med => {
        // simple heuristic: duration in days
        const durationDays = parseInt(med.duration);
        if (!durationDays) return;

        const daysPassed =
          (Date.now() - new Date(order.createdAt)) /
          (1000 * 60 * 60 * 24);

        if (daysPassed >= durationDays - 2) {
          suggestions.push({
            medicineName: med.name,
            message: `You may need a refill for ${med.name}`
          });
        }
      });
    }

    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const checkOrderSafety = async (req, res) => {
  try {
    const { medicines } = req.body; 
    // medicines = [{ medicineId, quantity }]

    const userId = req.user._id;
    const warnings = [];

    // 🔹 Fetch recent orders (last 30 days)
    const recentOrders = await Order.find({
      customerId: userId,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).populate("medicines.medicineId");

    // 🔹 Check duplicate medicine
    for (let order of recentOrders) {
      for (let oldItem of order.medicines) {
        for (let newItem of medicines) {
          if (
            oldItem.medicineId._id.toString() === newItem.medicineId
          ) {
            warnings.push(
              `You have ordered ${oldItem.medicineId.name} recently. Please confirm if needed again.`
            );
          }
        }
      }
    }

    // 🔹 Check ingredient overlap
    const newMeds = await Medicine.find({
      _id: { $in: medicines.map(m => m.medicineId) }
    });

    for (let i = 0; i < newMeds.length; i++) {
      for (let j = i + 1; j < newMeds.length; j++) {
        const a = newMeds[i];
        const b = newMeds[j];

        const ingredientsA = a.contents?.map(c => c.ingredient.toLowerCase()) || [];
        const ingredientsB = b.contents?.map(c => c.ingredient.toLowerCase()) || [];

        const overlap = ingredientsA.some(ing =>
          ingredientsB.includes(ing)
        );

        if (overlap) {
          warnings.push(
            `Medicines "${a.name}" and "${b.name}" have similar ingredients. Please verify before ordering.`
          );
        }
      }
    }

    res.json({ warnings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getMyOrdersWithDelivery = async (req, res) => {
  try {
    const orders = await Order.find({
      customerId: req.user._id
    })
      .populate("medicines.medicineId")
      .populate("prescriptionId")
      .sort({ createdAt: -1 });

    const ordersWithDelivery = await Promise.all(
      orders.map(async (order) => {
        const delivery = await Delivery.findOne({ orderId: order._id });
        return {
          ...order.toObject(),
          deliveryStatus: delivery?.currentStatus || "pending",
          deliveryLocation: delivery?.location || null
        };
      })
    );

    res.json(ordersWithDelivery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
