import db from "../config/db.js";
import { sendOfferEmail } from "./emailService.js";

export const getActiveOffersService = async () => {
  const [rows] = await db.promise().query(
    `SELECT * FROM offers 
     WHERE is_active = true 
       AND (expires_at IS NULL OR expires_at > NOW())
     ORDER BY created_at DESC`
  );
  return rows;
};

export const getAllOffersAdminService = async () => {
  const [rows] = await db.promise().query("SELECT * FROM offers ORDER BY created_at DESC");
  return rows;
};

export const createOfferService = async (data) => {
  const { title, subtitle, badge, bg_from, bg_to, emoji, expires_at } = data;
  const [result] = await db.promise().query(
    "INSERT INTO offers (title, subtitle, badge, bg_from, bg_to, emoji, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [title, subtitle || null, badge || null, bg_from || "#f97316", bg_to || "#f59e0b", emoji || "🎁", expires_at || null]
  );

  // Send offer email to all verified users (non-blocking)
  const [users] = await db.promise().query(
    "SELECT email, name FROM users WHERE is_verified = true AND role = 'user'"
  );
  users.forEach(u => sendOfferEmail(u.email, u.name, { title, subtitle, badge, emoji, bg_from, bg_to, expires_at }).catch(() => {}));

  return { id: result.insertId, ...data };
};

export const updateOfferService = async (id, data) => {
  const { title, subtitle, badge, bg_from, bg_to, emoji, is_active, expires_at } = data;

  // If activating an existing offer, notify users
  const [[existing]] = await db.promise().query("SELECT is_active FROM offers WHERE id = ?", [id]);
  const wasInactive = existing && !existing.is_active && is_active;

  await db.promise().query(
    "UPDATE offers SET title=?, subtitle=?, badge=?, bg_from=?, bg_to=?, emoji=?, is_active=?, expires_at=? WHERE id=?",
    [title, subtitle || null, badge || null, bg_from, bg_to, emoji, is_active, expires_at || null, id]
  );

  if (wasInactive) {
    const [users] = await db.promise().query(
      "SELECT email, name FROM users WHERE is_verified = true AND role = 'user'"
    );
    users.forEach(u => sendOfferEmail(u.email, u.name, { title, subtitle, badge, emoji, bg_from, bg_to, expires_at }).catch(() => {}));
  }

  return { success: true };
};

export const deleteOfferService = async (id) => {
  await db.promise().query("DELETE FROM offers WHERE id = ?", [id]);
  return { success: true };
};
