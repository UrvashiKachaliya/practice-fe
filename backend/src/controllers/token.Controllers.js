import { verifyRefreshToken, generateAccessToken } from "../utils/jwttoken.js";

export const refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const accessToken = generateAccessToken({ id: decoded.id, email: decoded.email, role: decoded.role });
    res.status(200).json({ accessToken });
  } catch {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};
