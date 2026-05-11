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
