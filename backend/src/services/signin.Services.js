import db from "../config/db.js";
import { comparePassword } from "../utils/hashpassword.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwttoken.js";

export const signinService = async (email, password) => {
  const [rows] = await db.promise().query(
    "SELECT * FROM users WHERE email = ?", [email]
  );
  if (rows.length === 0) throw new Error("User not found");

  const user = rows[0];
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Invalid password");

  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    success: true,
    message: "Login successful",
    accessToken,
    refreshToken,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    contact: user.contact,
    address: user.address,
    role: user.role,
  },  };
};
