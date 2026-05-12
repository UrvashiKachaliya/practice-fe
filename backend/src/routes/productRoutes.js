import express from "express";
import { addProduct, getAllProducts, getSingleProduct, updateProduct } from "../controllers/product.Controller.js";
import { verifyToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.post("/add", verifyToken, requireRole("seller", "admin"), addProduct);
router.put("/:id", verifyToken, requireRole("seller", "admin"), updateProduct);

export default router;
