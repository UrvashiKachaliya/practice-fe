import db from "../config/db.js";
import { sendOrderConfirmation, sendAdminOrderNotification, sendOrderStatusUpdate } from "./emailService.js";

export const placeOrderService = async (userId, address) => {
  // Get cart items
  const [cartItems] = await db.promise().query(
    `SELECT c.id AS cart_id, c.quantity, c.weight, p.id AS product_id,
            p.title, p.price, p.stock
     FROM cart c JOIN products p ON c.product_id = p.id
     WHERE c.user_id = ?`,
    [userId]
  );

  if (cartItems.length === 0) throw new Error("Cart is empty");

  // Check stock
  for (const item of cartItems) {
    if (item.quantity > item.stock) throw new Error(`${item.title} has insufficient stock`);
  }

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = subtotal >= 499 ? 0 : 49;
  const totalAmount = subtotal + deliveryFee;

  // Create order
  const [orderResult] = await db.promise().query(
    "INSERT INTO orders (user_id, total_amount, delivery_fee, address) VALUES (?, ?, ?, ?)",
    [userId, totalAmount, deliveryFee, address]
  );
  const orderId = orderResult.insertId;

  // Insert order items + reduce stock
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

  // Clear cart
  await db.promise().query("DELETE FROM cart WHERE user_id = ?", [userId]);

  // Get user info for email
  const [[user]] = await db.promise().query(
    "SELECT name, email FROM users WHERE id = ?", [userId]
  );

  // Get admin email
  const [[admin]] = await db.promise().query(
    "SELECT email FROM users WHERE role = 'admin' LIMIT 1"
  );

  // Send emails (non-blocking)
  sendOrderConfirmation(user.email, user.name, orderId, cartItems, totalAmount, deliveryFee, address).catch(() => {});
  if (admin) sendAdminOrderNotification(admin.email, user.name, orderId, cartItems, totalAmount, address).catch(() => {});

  return { orderId, totalAmount, message: "Order placed successfully" };
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
      (SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'id', oi.id, 'title', oi.title, 'price', oi.price,
        'quantity', oi.quantity, 'weight', oi.weight
      )) FROM order_items oi WHERE oi.order_id = o.id) AS items
     FROM orders o JOIN users u ON o.user_id = u.id
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

  // Get user info to send notification
  const [[order]] = await db.promise().query(
    `SELECT o.address, u.name, u.email, u.contact 
     FROM orders o JOIN users u ON o.user_id = u.id 
     WHERE o.id = ?`, [orderId]
  );

  if (order) {
    sendOrderStatusUpdate(order.email, order.name, orderId, status, order.contact).catch(() => {});
  }

  return { success: true };
};
