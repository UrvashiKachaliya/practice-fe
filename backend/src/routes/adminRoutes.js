import express from "express";
import { getStats, getAllUsers, updateUserRole, deleteUser, getAllProductsAdmin, deleteProduct } from "../controllers/admin.Controllers.js";
import { getAdminOrders, updateOrderStatus } from "../controllers/order.Controllers.js";
import { verifyToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();

router.use(verifyToken, requireRole("admin"));

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/products", getAllProductsAdmin);
router.delete("/products/:id", deleteProduct);
router.get("/orders", getAdminOrders);
router.put("/orders/:id/status", updateOrderStatus);

export default router;
