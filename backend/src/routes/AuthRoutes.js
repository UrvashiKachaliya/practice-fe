import express from "express";
import { signup, verifyEmail, resendOTP } from "../controllers/auth.controllers.js";
import { signin } from "../controllers/signin.Controllers.js";
import { refreshToken } from "../controllers/token.Controllers.js";
import { updateProfile } from "../controllers/updateProfile.Controllers.js";
import { forgotPassword, resetPassword } from "../controllers/passwordReset.Controllers.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOTP);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh", refreshToken);
router.put("/profile", verifyToken, updateProfile);

export default router;
