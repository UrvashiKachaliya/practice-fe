import express from "express";
import { placeOrder, getUserOrders, repeatOrder, cancelOrder } from "../controllers/order.Controllers.js";
import { getAdminAllOrders } from "../controllers/admin.Controllers.js";
import { verifyToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();

router.use(verifyToken);
router.get("/all", requireRole("admin"), getAdminAllOrders);
router.post("/", placeOrder);
router.get("/", getUserOrders);
router.post("/:id/repeat", repeatOrder);
router.put("/:id/cancel", cancelOrder);

export default router;
