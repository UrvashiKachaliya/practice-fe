import { placeOrderService, getUserOrdersService, getAdminOrdersService, updateOrderStatusService } from "../services/order.Services.js";

export const placeOrder = async (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ message: "Delivery address is required" });
  try {
    res.status(201).json(await placeOrderService(req.user.id, address));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    res.json(await getUserOrdersService(req.user.id));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getAdminOrders = async (req, res) => {
  try {
    res.json(await getAdminOrdersService());
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    res.json(await updateOrderStatusService(req.params.id, req.body.status));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
