import db from "../config/db.js";

export const updateProfileService = async (id, { name, contact, address }) => {
  await db.promise().query(
    "UPDATE users SET name = ?, contact = ?, address = ? WHERE id = ?",
    [name, contact, address, id]
  );

  const [rows] = await db.promise().query(
    "SELECT id, name, email, contact, address, role FROM users WHERE id = ?",
    [id]
  );

  return rows[0];
};
