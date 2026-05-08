import express from "express";
import { addProduct, getAllProducts, getSingleProduct } from "../controllers/product.Controller.js";
import { verifyToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();

// Public
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

// Seller / Admin only
router.post("/add", verifyToken, requireRole("seller", "admin"), addProduct);

export default router;
