import db from "../config/db.js";
import { sendOrderConfirmation, sendAdminOrderNotification, sendOrderStatusUpdate, sendDeliveryDateResponse } from "./emailService.js";
import { incrementCouponUsageService, validateCouponService } from "./offers.Services.js";
import { processRefundService, verifyAndLinkPaymentService } from "./payment.Services.js";

export const placeOrderService = async (userId, address, requestedDeliveryDate, paymentDetails, couponCode) => {
  const [cartItems] = await db.promise().query(
    `SELECT c.id AS cart_id, c.quantity, c.weight, p.id AS product_id,
            p.title, p.price, p.stock
     FROM cart c JOIN products p ON c.product_id = p.id
     WHERE c.user_id = ?`,
    [userId]
  );

  if (cartItems.length === 0) throw new Error("Cart is empty");

  for (const item of cartItems) {
    if (item.quantity > item.stock) throw new Error(`${item.title} has insufficient stock`);
  }

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = subtotal >= 499 ? 0 : 49;
  const coupon = couponCode ? await validateCouponService(couponCode, subtotal) : null;
  const discount = coupon ? Math.min(coupon.discount, subtotal) : 0;
  const totalAmount = Math.max(subtotal - discount + deliveryFee, 0);

  const [orderResult] = await db.promise().query(
    "INSERT INTO orders (user_id, total_amount, delivery_fee, address, requested_delivery_date) VALUES (?, ?, ?, ?, ?)",
    [userId, totalAmount, deliveryFee, address, requestedDeliveryDate || null]
  );
  const orderId = orderResult.insertId;

  // Verify and link payment if provided, else record COD
  if (paymentDetails) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentDetails;
    await verifyAndLinkPaymentService(orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature);
  } else {
    await db.promise().query(
      "INSERT INTO payments (order_id, razorpay_order_id, amount, status, method) VALUES (?, 'COD', ?, 'cod', 'cod')",
      [orderId, totalAmount]
    );
  }

  for (const item of cartItems) {
    await db.promise().query(
      "INSERT INTO order_items (order_id, product_id, title, price, quantity, weight) VALUES (?, ?, ?, ?, ?, ?)",
      [orderId, item.product_id, item.title, item.price, item.quantity, item.weight]
    );
    await db.promise().query(
      "UPDATE products SET stock = stock - ? WHERE id = ?",
      [item.quantity, item.product_id]
    );
  }

  await db.promise().query("DELETE FROM cart WHERE user_id = ?", [userId]);
  if (coupon) await incrementCouponUsageService(coupon.offerId);

  const [[user]] = await db.promise().query("SELECT name, email FROM users WHERE id = ?", [userId]);
  const [[admin]] = await db.promise().query("SELECT email FROM users WHERE role = 'admin' LIMIT 1");

  sendOrderConfirmation(user.email, user.name, orderId, cartItems, totalAmount, deliveryFee, address).catch(() => {});
  if (admin) sendAdminOrderNotification(admin.email, user.name, orderId, cartItems, totalAmount, address).catch(() => {});

  return { orderId, totalAmount, discount, couponCode: coupon?.code || null, message: "Order placed successfully" };
};

export const getUserOrdersService = async (userId) => {
  const [orders] = await db.promise().query(
    `SELECT o.*,
      (SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'id', oi.id, 'title', oi.title, 'price', oi.price,
        'quantity', oi.quantity, 'weight', oi.weight, 'product_id', oi.product_id
      )) FROM order_items oi WHERE oi.order_id = o.id) AS items
     FROM orders o WHERE o.user_id = ? ORDER BY o.created_at DESC`,
    [userId]
  );
  return orders.map(o => ({ ...o, items: o.items || [] }));
};

export const getAdminOrdersService = async () => {
  const [orders] = await db.promise().query(
    `SELECT o.*, u.name AS user_name, u.email AS user_email,
      pay.status AS payment_status, pay.method AS payment_method,
      pay.bank, pay.vpa, pay.wallet, pay.card_network, pay.card_last4,
      pay.razorpay_payment_id,
      (SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'id', oi.id, 'title', oi.title, 'price', oi.price,
        'quantity', oi.quantity, 'weight', oi.weight
      )) FROM order_items oi WHERE oi.order_id = o.id) AS items
     FROM orders o
     JOIN users u ON o.user_id = u.id
     LEFT JOIN payments pay ON pay.order_id = o.id
     WHERE MONTH(o.created_at) = MONTH(CURRENT_DATE())
       AND YEAR(o.created_at) = YEAR(CURRENT_DATE())
     ORDER BY o.created_at DESC`
  );
  return orders.map(o => ({ ...o, items: o.items || [] }));
};

export const updateOrderStatusService = async (orderId, status) => {
  const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) throw new Error("Invalid status");

  await db.promise().query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);

  // Auto-refund if admin cancels a paid order
  if (status === "cancelled") {
    await processRefundService(orderId).catch(() => {}); // silent fail if no payment
  }

  const [[order]] = await db.promise().query(
    `SELECT o.address, u.name, u.email, u.contact
     FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?`, [orderId]
  );
  if (order) sendOrderStatusUpdate(order.email, order.name, orderId, status, order.contact).catch(() => {});

  return { success: true };
};

export const cancelOrderService = async (orderId, userId) => {
  // Only allow cancel if order belongs to user and is still pending
  const [[order]] = await db.promise().query(
    "SELECT id, status FROM orders WHERE id = ? AND user_id = ?",
    [orderId, userId]
  );
  if (!order) throw new Error("Order not found");
  if (order.status !== "pending") throw new Error("Only pending orders can be cancelled");

  await db.promise().query("UPDATE orders SET status = 'cancelled' WHERE id = ?", [orderId]);

  // Restore stock
  const [items] = await db.promise().query(
    "SELECT product_id, quantity FROM order_items WHERE order_id = ?", [orderId]
  );
  for (const item of items) {
    await db.promise().query(
      "UPDATE products SET stock = stock + ? WHERE id = ?",
      [item.quantity, item.product_id]
    );
  }

  // Auto-refund if paid online
  await processRefundService(orderId).catch(() => {});

  return { success: true, message: "Order cancelled" };
};

export const repeatOrderService = async (orderId, userId) => {
  // Get items from the previous order
  const [items] = await db.promise().query(
    "SELECT product_id, quantity, weight FROM order_items WHERE order_id = ?",
    [orderId]
  );
  if (items.length === 0) throw new Error("Order not found");

  // Add each item to cart (merge if exists)
  for (const item of items) {
    const [existing] = await db.promise().query(
      "SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ? AND weight = ?",
      [userId, item.product_id, item.weight]
    );
    if (existing.length > 0) {
      await db.promise().query(
        "UPDATE cart SET quantity = quantity + ? WHERE id = ?",
        [item.quantity, existing[0].id]
      );
    } else {
      await db.promise().query(
        "INSERT INTO cart (user_id, product_id, quantity, weight) VALUES (?, ?, ?, ?)",
        [userId, item.product_id, item.quantity, item.weight]
      );
    }
  }
  return { success: true, message: "Items added to cart" };
};

export const respondDeliveryDateService = async (orderId, action, adminDate, reason) => {
  if (action === "accept") {
    await db.promise().query(
      "UPDATE orders SET delivery_response = 'accepted', admin_delivery_date = ? WHERE id = ?",
      [adminDate || null, orderId]
    );
  } else {
    await db.promise().query(
      "UPDATE orders SET delivery_response = 'rejected', rejection_reason = ?, admin_delivery_date = ? WHERE id = ?",
      [reason || null, adminDate || null, orderId]
    );
  }

  const [[order]] = await db.promise().query(
    `SELECT o.*, u.name, u.email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?`, [orderId]
  );
  if (order) sendDeliveryDateResponse(order.email, order.name, orderId, action, adminDate, reason).catch(() => {});

  return { success: true };
};
