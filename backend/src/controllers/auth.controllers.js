import { signupService, verifyEmailService, resendOTPService } from "../services/signup.Services.js";
import logger from "../utils/logger.js";

export const signup = async (req, res) => {
  const { name, email, password, contact, address } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });
  try {
    const data = await signupService(name, email, password, contact, address);
    logger.info({ message: "New user registered", email });
    res.status(201).json(data);
  } catch (error) {
    logger.warn({ message: "Signup failed", email, reason: error.message });
    const status = error.message === "Email already registered" ? 409 : 400;
    res.status(status).json({ message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });
  try {
    const data = await verifyEmailService(email, otp);
    logger.info({ message: "Email verified", email });
    res.status(200).json(data);
  } catch (error) {
    logger.warn({ message: "Email verification failed", email, reason: error.message });
    res.status(400).json({ message: error.message });
  }
};

export const resendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  try {
    const data = await resendOTPService(email);
    logger.info({ message: "OTP resent", email });
    res.status(200).json(data);
  } catch (error) {
    logger.warn({ message: "Resend OTP failed", email, reason: error.message });
    res.status(400).json({ message: error.message });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });
  try {
    const data = await signinService(email, password);
    logger.info({ message: "User signed in", email });
    res.status(200).json(data);
  } catch (error) {
    logger.warn({ message: "Signin failed", email, reason: error.message });
    const status = error.message === "User not found" ? 404 : 401;
    res.status(status).json({ message: error.message });
  }
};
