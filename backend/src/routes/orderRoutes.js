import express from "express";
import { placeOrder, getUserOrders, repeatOrder } from "../controllers/order.Controllers.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);
router.post("/", placeOrder);
router.get("/", getUserOrders);
router.post("/:id/repeat", repeatOrder);

export default router;
