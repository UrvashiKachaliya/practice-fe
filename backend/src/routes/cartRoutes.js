import express from "express";
import { getCart, addToCart, updateCart, removeFromCart } from "../controllers/cart.Controllers.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);
router.get("/", getCart);
router.post("/", addToCart);
router.put("/:id", updateCart);
router.delete("/:id", removeFromCart);

export default router;
