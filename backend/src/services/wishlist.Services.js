import db from "../config/db.js";

export const getWishlistService = async (userId) => {
  const [rows] = await db.promise().query(
    `SELECT w.id, p.id AS product_id, p.title, p.price, p.image, p.category, p.stock, u.name AS seller_name
     FROM wishlist w JOIN products p ON w.product_id = p.id JOIN users u ON p.seller_id = u.id
     WHERE w.user_id = ? ORDER BY w.created_at DESC`,
    [userId]
  );
  return rows;
};

export const toggleWishlistService = async (userId, productId) => {
  const [existing] = await db.promise().query(
    "SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?", [userId, productId]
  );
  if (existing.length > 0) {
    await db.promise().query("DELETE FROM wishlist WHERE id = ?", [existing[0].id]);
    return { wishlisted: false };
  }
  await db.promise().query("INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)", [userId, productId]);
  return { wishlisted: true };
};

export const checkWishlistService = async (userId, productId) => {
  const [rows] = await db.promise().query(
    "SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?", [userId, productId]
  );
  return { wishlisted: rows.length > 0 };
};
