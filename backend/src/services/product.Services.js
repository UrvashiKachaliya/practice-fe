import db from "../config/db.js";

export const addProductService = async (productData, sellerId) => {
  const { title, description, price, category, stock, image } = productData;
  const [result] = await db.promise().query(
    "INSERT INTO products (title, description, price, category, stock, image, seller_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [title, description, price, category, stock, image, sellerId]
  );
  return { id: result.insertId, ...productData, seller_id: sellerId };
};

export const updateProductService = async (id, productData) => {
  const { title, description, price, category, stock, image, status } = productData;
  await db.promise().query(
    "UPDATE products SET title=?, description=?, price=?, category=?, stock=?, image=?, status=? WHERE id=?",
    [title, description, price, category, stock, image, status || "active", id]
  );
  return { success: true };
};

// Public — only active products
export const getAllProductsService = async () => {
  const [rows] = await db.promise().query(
    "SELECT p.*, u.name AS seller_name FROM products p JOIN users u ON p.seller_id = u.id WHERE p.status = 'active' ORDER BY p.created_at DESC"
  );
  return rows;
};

// Public single — only active
export const getSingleProductService = async (id) => {
  const [rows] = await db.promise().query(
    "SELECT p.*, u.name AS seller_name FROM products p JOIN users u ON p.seller_id = u.id WHERE p.id = ? AND p.status = 'active'",
    [id]
  );
  if (rows.length === 0) throw new Error("Product not found");
  return rows[0];
};

// Admin — all products regardless of status
export const getAllProductsAdminService = async () => {
  const [rows] = await db.promise().query(
    "SELECT p.*, u.name AS seller_name FROM products p JOIN users u ON p.seller_id = u.id ORDER BY p.created_at DESC"
  );
  return rows;
};
