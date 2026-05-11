import db from "../config/db.js";
import { hashPassword } from "../utils/hashpassword.js";
import { sendOTP } from "./emailService.js";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const signupService = async (name, email, password, contact, address) => {
  const [existing] = await db.promise().query(
    "SELECT id FROM users WHERE email = ?", [email]
  );
  if (existing.length > 0) throw new Error("Email already registered");

  const hashedPassword = await hashPassword(password);
  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await db.promise().query(
    "INSERT INTO users (name, email, password, contact, address, role, is_verified, otp, otp_expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [name, email, hashedPassword, contact, address, "user", false, otp, otpExpiresAt]
  );

  await sendOTP(email, otp);

  return {
    success: true,
    message: "Verification email sent",
    requiresVerification: true,
    email,
  };
};

export const verifyEmailService = async (email, otp) => {
  const [users] = await db.promise().query(
    "SELECT id, name, role, otp, otp_expires_at, is_verified FROM users WHERE email = ?",
    [email]
  );

  if (users.length === 0) throw new Error("User not found");
  const user = users[0];

  if (user.is_verified) throw new Error("Email already verified");
  if (user.otp !== otp) throw new Error("Invalid OTP");
  if (new Date() > new Date(user.otp_expires_at)) throw new Error("OTP expired");

  await db.promise().query(
    "UPDATE users SET is_verified = ?, otp = NULL, otp_expires_at = NULL WHERE id = ?",
    [true, user.id]
  );

  return { success: true, message: "Email verified successfully" };
};

export const resendOTPService = async (email) => {
  const [users] = await db.promise().query(
    "SELECT id, is_verified FROM users WHERE email = ?",
    [email]
  );

  if (users.length === 0) throw new Error("User not found");
  if (users[0].is_verified) throw new Error("Email already verified");

  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await db.promise().query(
    "UPDATE users SET otp = ?, otp_expires_at = ? WHERE id = ?",
    [otp, otpExpiresAt, users[0].id]
  );

  await sendOTP(email, otp);

  return { success: true, message: "OTP resent successfully" };
};
