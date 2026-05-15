import express from "express";
import { createPaymentOrder, verifyPayment } from "../controllers/payment.Controllers.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);
router.post("/create-order", createPaymentOrder);
router.post("/verify", verifyPayment);

export default router;
