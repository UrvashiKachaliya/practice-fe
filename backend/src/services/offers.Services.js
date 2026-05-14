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

export const validateCouponService = async (code, subtotal) => {
  const [[offer]] = await db.promise().query(
    `SELECT * FROM offers
     WHERE code = ? AND is_active = TRUE
       AND (expires_at IS NULL OR expires_at > NOW())
       AND (max_uses IS NULL OR used_count < max_uses)`,
    [code.toUpperCase()]
  );

  if (!offer) throw new Error("Invalid or expired coupon code");
  if (subtotal < offer.min_order_amount)
    throw new Error(`Minimum order amount ₹${offer.min_order_amount} required for this coupon`);

  let discount = 0;
  let description = "";

  if (offer.discount_type === "percentage") {
    discount = Math.round((subtotal * offer.discount_value) / 100);
    description = `${offer.discount_value}% off`;
  } else if (offer.discount_type === "flat") {
    discount = Math.min(offer.discount_value, subtotal);
    description = `₹${offer.discount_value} off`;
  } else if (offer.discount_type === "bogo") {
    // Buy 1 Get 1 = 50% off
    discount = Math.round(subtotal * 0.5);
    description = "Buy 1 Get 1 Free (50% off)";
  }

  return {
    valid: true,
    offerId: offer.id,
    code: offer.code,
    title: offer.title,
    discount,
    description,
    discount_type: offer.discount_type,
  };
};

export const incrementCouponUsageService = async (offerId) => {
  await db.promise().query(
    "UPDATE offers SET used_count = used_count + 1 WHERE id = ?",
    [offerId]
  );
};

export const createOfferService = async (data) => {
  const { title, subtitle, badge, bg_from, bg_to, emoji, expires_at, code, discount_type, discount_value, min_order_amount, max_uses } = data;
  const [result] = await db.promise().query(
    "INSERT INTO offers (title, subtitle, badge, bg_from, bg_to, emoji, expires_at, code, discount_type, discount_value, min_order_amount, max_uses) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [title, subtitle || null, badge || null, bg_from || "#f97316", bg_to || "#f59e0b", emoji || "🎁", expires_at || null,
     code ? code.toUpperCase() : null, discount_type || "percentage", discount_value || 0, min_order_amount || 0, max_uses || null]
  );

  const [users] = await db.promise().query(
    "SELECT email, name FROM users WHERE is_verified = true AND role = 'user'"
  );
  users.forEach(u => sendOfferEmail(u.email, u.name, { title, subtitle, badge, emoji, bg_from, bg_to, expires_at }).catch(() => {}));

  return { id: result.insertId, ...data };
};

export const updateOfferService = async (id, data) => {
  const { title, subtitle, badge, bg_from, bg_to, emoji, is_active, expires_at, code, discount_type, discount_value, min_order_amount, max_uses } = data;

  const [[existing]] = await db.promise().query("SELECT is_active FROM offers WHERE id = ?", [id]);
  const wasInactive = existing && !existing.is_active && is_active;

  await db.promise().query(
    "UPDATE offers SET title=?, subtitle=?, badge=?, bg_from=?, bg_to=?, emoji=?, is_active=?, expires_at=?, code=?, discount_type=?, discount_value=?, min_order_amount=?, max_uses=? WHERE id=?",
    [title, subtitle || null, badge || null, bg_from, bg_to, emoji, is_active, expires_at || null,
     code ? code.toUpperCase() : null, discount_type || "percentage", discount_value || 0, min_order_amount || 0, max_uses || null, id]
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
