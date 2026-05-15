import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
import db from "../config/db.js";
import { hashPassword } from "../utils/hashpassword.js";
import { sendResetLink } from "./emailService.js";
export const forgotPasswordService = async (email) => {
  const [rows] = await db.promise().query(
    "SELECT id FROM users WHERE email = ?", [email]
  );
  if (rows.length === 0) throw new Error("No account found with that email");

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db.promise().query(
    "UPDATE users SET reset_token = ?, reset_token_expires_at = ? WHERE id = ?",
    [token, expiresAt, rows[0].id]
  );

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await sendResetLink(email, resetLink);

  return { success: true, message: "Password reset link sent to your email" };
};

export const resetPasswordService = async (token, newPassword) => {
  const [rows] = await db.promise().query(
    "SELECT id, reset_token_expires_at FROM users WHERE reset_token = ?", [token]
  );
  if (rows.length === 0) throw new Error("Invalid or expired reset link");

  const user = rows[0];
  if (new Date() > new Date(user.reset_token_expires_at))
    throw new Error("Reset link has expired");

  const hashed = await hashPassword(newPassword);
  await db.promise().query(
    "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires_at = NULL WHERE id = ?",
    [hashed, user.id]
  );

  return { success: true, message: "Password reset successfully" };
};
