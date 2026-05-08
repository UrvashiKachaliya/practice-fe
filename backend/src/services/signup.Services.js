import db from "../config/db.js";
import { hashPassword } from "../utils/hashpassword.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwttoken.js";

export const signupService = async (name, email, password, contact, address) => {
  const [existing] = await db.promise().query(
    "SELECT id FROM users WHERE email = ?", [email]
  );
  if (existing.length > 0) throw new Error("Email already registered");

  const hashedPassword = await hashPassword(password);

  const [result] = await db.promise().query(
    "INSERT INTO users (name, email, password, contact, address, role) VALUES (?, ?, ?, ?, ?, ?)",
    [name, email, hashedPassword, contact, address, "user"]
  );

  const payload = { id: result.insertId, email, role: "user" };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    success: true,
    message: "Signup successful",
    accessToken,
    refreshToken,
    user: { id: result.insertId, name, email, role: "user" },
  };
};


