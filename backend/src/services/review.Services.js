import db from "../config/db.js";

export const addReviewService = async (userId, productId, orderId, rating, comment) => {
  const [[order]] = await db.promise().query(
    "SELECT id FROM orders WHERE id = ? AND user_id = ? AND status = 'delivered'",
    [orderId, userId]
  );
  if (!order) throw new Error("You can only review products from delivered orders");

  const [[item]] = await db.promise().query(
    "SELECT id FROM order_items WHERE order_id = ? AND product_id = ?",
    [orderId, productId]
  );
  if (!item) throw new Error("Product not found in this order");

  await db.promise().query(
    `INSERT INTO reviews (user_id, product_id, order_id, rating, comment, is_approved)
     VALUES (?, ?, ?, ?, ?, TRUE)
     ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment)`,
    [userId, productId, orderId, rating, comment || null]
  );

  return { success: true, message: "Review submitted!" };
};

export const getProductReviewsService = async (productId, userId = null) => {
  const [rows] = await db.promise().query(
    `SELECT r.id, r.rating, r.comment, r.created_at, r.likes,
            COALESCE(r.reviewer_name, u.name) AS user_name
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.product_id = ?
     ORDER BY r.likes DESC, r.created_at DESC`,
    [productId]
  );

  // If user is logged in, check which reviews they liked
  if (userId && rows.length > 0) {
    const ids = rows.map(r => r.id);
    const [liked] = await db.promise().query(
      `SELECT review_id FROM review_likes WHERE user_id = ? AND review_id IN (?)`,
      [userId, ids]
    );
    const likedSet = new Set(liked.map(l => l.review_id));
    return rows.map(r => ({ ...r, liked: likedSet.has(r.id) }));
  }

  return rows.map(r => ({ ...r, liked: false }));
};

export const toggleReviewLikeService = async (userId, reviewId) => {
  const [[existing]] = await db.promise().query(
    "SELECT 1 FROM review_likes WHERE user_id = ? AND review_id = ?",
    [userId, reviewId]
  );

  if (existing) {
    await db.promise().query(
      "DELETE FROM review_likes WHERE user_id = ? AND review_id = ?",
      [userId, reviewId]
    );
    await db.promise().query(
      "UPDATE reviews SET likes = GREATEST(likes - 1, 0) WHERE id = ?",
      [reviewId]
    );
    return { liked: false };
  }

  await db.promise().query(
    "INSERT INTO review_likes (user_id, review_id) VALUES (?, ?)",
    [userId, reviewId]
  );
  await db.promise().query(
    "UPDATE reviews SET likes = likes + 1 WHERE id = ?",
    [reviewId]
  );
  return { liked: true };
};

// ── Admin services
export const getAllReviewsAdminService = async () => {
  const [rows] = await db.promise().query(
    `SELECT r.*, COALESCE(r.reviewer_name, u.name) AS user_name, p.title AS product_title
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     JOIN products p ON r.product_id = p.id
     ORDER BY r.created_at DESC`
  );
  return rows;
};

export const deleteReviewService = async (id) => {
  await db.promise().query("DELETE FROM reviews WHERE id = ?", [id]);
  return { success: true };
};

export const addManualReviewService = async (productId, reviewerName, rating, comment) => {
  const [[admin]] = await db.promise().query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
  if (!admin) throw new Error("No admin found");

  await db.promise().query(
    `INSERT INTO reviews (user_id, product_id, order_id, rating, comment, is_approved, is_manual, reviewer_name)
     VALUES (?, ?, 0, ?, ?, TRUE, TRUE, ?)`,
    [admin.id, productId, rating, comment || null, reviewerName]
  );

  return { success: true };
};
