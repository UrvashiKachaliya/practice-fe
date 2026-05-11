import db from "../config/db.js";

export const getCartService = async (userId) => {
  const [rows] = await db.promise().query(
    `SELECT c.id, c.quantity, c.weight, p.id AS product_id, p.title, p.price, p.image, p.stock
     FROM cart c
     JOIN products p ON c.product_id = p.id
     WHERE c.user_id = ?
     ORDER BY c.created_at DESC`,
    [userId]
  );
  return rows;
};

export const addToCartService = async (userId, productId, quantity = 1, weight = "500g") => {
  const [existing] = await db.promise().query(
    "SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ? AND weight = ?",
    [userId, productId, weight]
  );

  if (existing.length > 0) {
    const newQty = existing[0].quantity + quantity;
    await db.promise().query("UPDATE cart SET quantity = ? WHERE id = ?", [newQty, existing[0].id]);
    return { message: "Cart updated" };
  }

  await db.promise().query(
    "INSERT INTO cart (user_id, product_id, quantity, weight) VALUES (?, ?, ?, ?)",
    [userId, productId, quantity, weight]
  );
  return { message: "Added to cart" };
};

export const updateCartService = async (cartId, userId, quantity) => {
  if (quantity < 1) throw new Error("Quantity must be at least 1");
  await db.promise().query(
    "UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?",
    [quantity, cartId, userId]
  );
  return { message: "Cart updated" };
};

export const removeFromCartService = async (cartId, userId) => {
  await db.promise().query("DELETE FROM cart WHERE id = ? AND user_id = ?", [cartId, userId]);
  return { message: "Item removed" };
};

export const clearCartService = async (userId) => {
  await db.promise().query("DELETE FROM cart WHERE user_id = ?", [userId]);
  return { message: "Cart cleared" };
};
