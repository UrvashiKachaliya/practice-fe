import crypto from "crypto";
import db from "../config/db.js";
import getRazorpay from "../config/razorpay.js";

export const createPaymentOrderService = async (amount) => {
  const razorpay = getRazorpay();
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(amount * 100), // convert to paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  await db.promise().query(
    "INSERT INTO payments (razorpay_order_id, amount, status) VALUES (?, ?, 'pending')",
    [razorpayOrder.id, amount]
  );

  return {
    razorpay_order_id: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key: process.env.RAZORPAY_KEY_ID,
  };
};  

export const verifyAndLinkPaymentService = async (orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
  // Verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new Error("Payment verification failed");
  }

  // Fetch payment details from Razorpay to get method info
  const razorpay = getRazorpay();
  const payment = await razorpay.payments.fetch(razorpay_payment_id);

  // Extract method-specific details
  const methodDetails = {
    method: payment.method,                          // card, upi, netbanking, wallet
    bank: payment.bank || null,                      // HDFC, SBI (netbanking)
    wallet: payment.wallet || null,                  // paytm, phonepe
    vpa: payment.vpa || null,                        // UPI id
    card_network: payment.card?.network || null,     // Visa, Mastercard
    card_last4: payment.card?.last4 || null,         // 1234
  };

  // Link payment to order with method details
  await db.promise().query(
    `UPDATE payments 
     SET order_id = ?, razorpay_payment_id = ?, status = 'paid',
         method = ?, bank = ?, wallet = ?, vpa = ?, card_network = ?, card_last4 = ?
     WHERE razorpay_order_id = ?`,
    [orderId, razorpay_payment_id, methodDetails.method, methodDetails.bank,
     methodDetails.wallet, methodDetails.vpa, methodDetails.card_network,
     methodDetails.card_last4, razorpay_order_id]
  );

  return { success: true };
};

export const processRefundService = async (orderId) => {
  const razorpay = getRazorpay();
  const [[payment]] = await db.promise().query(
    "SELECT * FROM payments WHERE order_id = ? AND status = 'paid'",
    [orderId]
  );

  if (!payment) return { success: false, message: "No paid payment found" };

  const refund = await razorpay.payments.refund(payment.razorpay_payment_id, {
    amount: Math.round(payment.amount * 100), // paise
  });

  await db.promise().query(
    "UPDATE payments SET razorpay_refund_id = ?, status = 'refunded' WHERE order_id = ?",
    [refund.id, orderId]
  );

  return { success: true, refund_id: refund.id };
};
