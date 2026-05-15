import { createPaymentOrderService, verifyAndLinkPaymentService } from "../services/payment.Services.js";

export const createPaymentOrder = async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ message: "Valid amount required" });

  try {
    const data = await createPaymentOrderService(amount);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ message: "All payment fields required" });
  }

  try {
    const data = await verifyAndLinkPaymentService(orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
