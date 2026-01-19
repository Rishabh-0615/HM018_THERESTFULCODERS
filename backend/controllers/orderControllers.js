import Order from "../models/orderModel.js";
import Medicine from "../models/medicineModel.js";
import TryCatch from "../utils/TryCatch.js";

// Customer - Create new order
export const createOrderPratik = TryCatch(async (req, res) => {
  const { items, customerDetails, paymentMethod, notes, prescriptionRequired } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({
      message: "Order must contain at least one item"
    });
  }

  // Calculate total and validate stock
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const medicine = await Medicine.findById(item.medicine);
    
    if (!medicine) {
      return res.status(404).json({
        message: `Medicine not found: ${item.medicine}`
      });
    }

    if (medicine.stock < item.quantity) {
      return res.status(400).json({
        message: `Insufficient stock for ${medicine.name}. Available: ${medicine.stock}`
      });
    }

    totalAmount += medicine.price * item.quantity;
    
    orderItems.push({
      medicine: medicine._id,
      name: medicine.name,
      quantity: item.quantity,
      price: medicine.price,
      image: medicine.image
    });
  }

  // Generate order number
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const order = await Order.create({
    orderNumber,
    customer: req.user._id,
    customerDetails: {
      name: customerDetails.name || req.user.name,
      email: customerDetails.email || req.user.email,
      mobile: customerDetails.mobile || req.user.mobile,
      address: customerDetails.address
    },
    items: orderItems,
    totalAmount,
    paymentMethod,
    notes,
    prescriptionRequired: prescriptionRequired || false
  });

  // Update medicine stock
  for (const item of items) {
    await Medicine.findByIdAndUpdate(
      item.medicine,
      { $inc: { stock: -item.quantity } }
    );
  }

  res.status(201).json({
    order,
    message: "Order created successfully"
  });
});

// Pharmacist - Get all orders
export const getAllOrdersPratik = TryCatch(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;

  const query = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'customerDetails.name': { $regex: search, $options: 'i' } },
      { 'customerDetails.mobile': { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('customer', 'name email mobile');

  const total = await Order.countDocuments(query);

  res.json({
    orders,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
    total,
    message: "Orders fetched successfully"
  });
});

// Get single order
export const getOrderByIdPratik = TryCatch(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id)
    .populate('customer', 'name email mobile')
    .populate('items.medicine');

  if (!order) {
    return res.status(404).json({
      message: "Order not found"
    });
  }

  // Check if user is customer and owns the order
  if (req.user.role === 'customer' && order.customer._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "Not authorized to view this order"
    });
  }

  res.json({
    order,
    message: "Order fetched successfully"
  });
});

// Pharmacist - Update order status
export const updateOrderStatusPratik = TryCatch(async (req, res) => {
  const { id } = req.params;
  const { status, pharmacistNotes } = req.body;

  const validStatuses = ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid status"
    });
  }

  const order = await Order.findByIdAndUpdate(
    id,
    { 
      status,
      ...(pharmacistNotes && { pharmacistNotes }),
      ...(status === 'delivered' && { deliveryDate: new Date() })
    },
    { new: true }
  );

  if (!order) {
    return res.status(404).json({
      message: "Order not found"
    });
  }

  res.json({
    order,
    message: "Order status updated successfully"
  });
});

// Pharmacist - Update payment status
export const updatePaymentStatusPratik = TryCatch(async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  const validStatuses = ["pending", "paid", "failed"];
  
  if (!validStatuses.includes(paymentStatus)) {
    return res.status(400).json({
      message: "Invalid payment status"
    });
  }

  const order = await Order.findByIdAndUpdate(
    id,
    { paymentStatus },
    { new: true }
  );

  if (!order) {
    return res.status(404).json({
      message: "Order not found"
    });
  }

  res.json({
    order,
    message: "Payment status updated successfully"
  });
});

// Customer - Get my orders
export const getMyOrdersPratik = TryCatch(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const query = { customer: req.user._id };

  if (status && status !== 'all') {
    query.status = status;
  }

  const skip = (page - 1) * limit;

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Order.countDocuments(query);

  res.json({
    orders,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
    total,
    message: "Orders fetched successfully"
  });
});

// Pharmacist - Get order statistics
export const getOrderStatsPratik = TryCatch(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: 'pending' });
  const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
  const preparingOrders = await Order.countDocuments({ status: 'preparing' });
  const readyOrders = await Order.countDocuments({ status: 'ready' });
  const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
  const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

  const totalRevenue = await Order.aggregate([
    { $match: { status: 'delivered', paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);

  const pendingPayments = await Order.aggregate([
    { $match: { paymentStatus: 'pending' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);

  res.json({
    stats: {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      preparingOrders,
      readyOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingPayments: pendingPayments[0]?.total || 0
    },
    message: "Order stats fetched successfully"
  });
});

// Customer - Cancel order
export const cancelOrderPratik = TryCatch(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({
      message: "Order not found"
    });
  }

  if (order.customer.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "Not authorized to cancel this order"
    });
  }

  if (['delivered', 'cancelled'].includes(order.status)) {
    return res.status(400).json({
      message: `Cannot cancel ${order.status} order`
    });
  }

  // Restore medicine stock
  for (const item of order.items) {
    await Medicine.findByIdAndUpdate(
      item.medicine,
      { $inc: { stock: item.quantity } }
    );
  }

  order.status = 'cancelled';
  await order.save();

  res.json({
    order,
    message: "Order cancelled successfully"
  });
});
