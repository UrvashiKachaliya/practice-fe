import db from "../config/db.js";

export const getStatsService = async () => {
  const [[{ totalUsers }]] = await db.promise().query("SELECT COUNT(*) AS totalUsers FROM users");
  const [[{ totalProducts }]] = await db.promise().query("SELECT COUNT(*) AS totalProducts FROM products");
  const [[{ totalSellers }]] = await db.promise().query("SELECT COUNT(*) AS totalSellers FROM users WHERE role = 'seller'");
  const [[{ totalOrders }]] = await db.promise().query("SELECT COUNT(*) AS totalOrders FROM orders WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())");
  const [[{ revenue }]] = await db.promise().query("SELECT COALESCE(SUM(total_amount),0) AS revenue FROM orders WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE()) AND status != 'cancelled'");
  return { totalUsers, totalProducts, totalSellers, totalOrders, revenue };
};

export const getAllUsersService = async () => {
  const [rows] = await db.promise().query(
    "SELECT id, name, email, contact, address, role, is_verified, created_at FROM users ORDER BY created_at DESC"
  );
  return rows;
};

export const updateUserRoleService = async (id, role) => {
  const validRoles = ["user", "seller", "admin"];
  if (!validRoles.includes(role)) throw new Error("Invalid role");
  await db.promise().query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
  return { success: true };
};

export const deleteUserService = async (id) => {
  await db.promise().query("DELETE FROM users WHERE id = ?", [id]);
  return { success: true };
};

export const getAllProductsAdminService = async () => {
  const [rows] = await db.promise().query(
    "SELECT p.*, u.name AS seller_name FROM products p JOIN users u ON p.seller_id = u.id ORDER BY p.created_at DESC"
  );
  return rows;
};

export const deleteProductService = async (id) => {
  await db.promise().query("DELETE FROM products WHERE id = ?", [id]);
  return { success: true };
};

// get all admin orders
export const getAllAdminOrdersService = async () => {
  const [orders] = await db.promise().query(
    `SELECT o.*, u.name AS user_name, u.email AS user_email,
      pay.status AS payment_status,
      pay.method AS payment_method,
      pay.bank,
      pay.vpa,
      pay.wallet,
      pay.card_network,
      pay.card_last4,
      pay.razorpay_payment_id,
      (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', oi.id,
            'title', oi.title,
            'price', oi.price,
            'quantity', oi.quantity,
            'weight', oi.weight
          )
        )
        FROM order_items oi
        WHERE oi.order_id = o.id
      ) AS items
     FROM orders o
     JOIN users u ON o.user_id = u.id
     LEFT JOIN payments pay ON pay.order_id = o.id
     ORDER BY o.created_at DESC`
  );

  return orders.map(order => ({
    ...order,
    items: order.items || [],
  }));
};
