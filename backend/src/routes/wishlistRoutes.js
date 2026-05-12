import express from "express";
import { getWishlist, toggleWishlist, checkWishlist } from "../controllers/wishlist.Controllers.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);
router.get("/", getWishlist);
router.post("/toggle", toggleWishlist);
router.get("/check/:productId", checkWishlist);

export default router;
