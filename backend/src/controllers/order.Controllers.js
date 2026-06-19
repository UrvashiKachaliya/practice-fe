import { placeOrderService, getUserOrdersService, getAdminOrdersService, updateOrderStatusService, respondDeliveryDateService, repeatOrderService, cancelOrderService } from "../services/order.Services.js";
import logger from "../utils/logger.js";

export const cancelOrder = async (req, res) => {
  try {
    const data = await cancelOrderService(req.params.id, req.user.id);
    res.json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const repeatOrder = async (req, res) => {
  try {
    const data = await repeatOrderService(req.params.id, req.user.id);
    res.json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const placeOrder = async (req, res) => {
  const { address, requestedDeliveryDate, paymentDetails, couponCode } = req.body;
  if (!address) return res.status(400).json({ message: "Delivery address is required" });
  try {
    const data = await placeOrderService(req.user.id, address, requestedDeliveryDate, paymentDetails, couponCode);
    logger.info({ message: "Order placed", userId: req.user.id, orderId: data.orderId });
    res.status(201).json(data);
  } catch (e) {
    logger.error({ message: "placeOrder failed", userId: req.user.id, error: e.message });
    res.status(400).json({ message: e.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    res.json(await getUserOrdersService(req.user.id));
  } catch (e) {
    logger.error({ message: "getUserOrders failed", userId: req.user.id, error: e.message });
    res.status(500).json({ message: e.message });
  }
};

export const getAdminOrders = async (req, res) => {
  try {
    res.json(await getAdminOrdersService());
  } catch (e) {
    logger.error({ message: "getAdminOrders failed", error: e.message });
    res.status(500).json({ message: e.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const data = await updateOrderStatusService(req.params.id, req.body.status);
    logger.info({ message: "Order status updated", orderId: req.params.id, status: req.body.status, adminId: req.user.id });
    res.json(data);
  } catch (e) {
    logger.error({ message: "updateOrderStatus failed", orderId: req.params.id, error: e.message });
    res.status(400).json({ message: e.message });
  }
};

export const respondDeliveryDate = async (req, res) => {
  const { action, adminDate, reason } = req.body;
  if (!action || !["accept", "reject"].includes(action))
    return res.status(400).json({ message: "action must be accept or reject" });
  try {
    const data = await respondDeliveryDateService(req.params.id, action, adminDate, reason);
    logger.info({ message: "Delivery date response sent", orderId: req.params.id, action, adminId: req.user.id });
    res.json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

