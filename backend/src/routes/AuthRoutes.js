import express from "express";
import { signup } from "../controllers/auth.controllers.js";
import { signin } from "../controllers/signin.Controllers.js";
import { refreshToken } from "../controllers/token.Controllers.js";
import { updateProfile } from "../controllers/updateProfile.Controllers.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/refresh", refreshToken);
router.put("/profile", verifyToken, updateProfile);

export default router;
