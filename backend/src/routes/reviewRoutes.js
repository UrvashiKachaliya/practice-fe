import express from "express";
import jwt from "jsonwebtoken";
import { addReview, getProductReviews, toggleReviewLike, getAllReviewsAdmin, deleteReview, addManualReview } from "../controllers/review.Controllers.js";
import { verifyToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

// Optional auth — attaches user if token present, doesn't block if missing
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    try {
      req.user = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    } catch {}
  }
  next();
};

const router = express.Router();

router.post("/", verifyToken, addReview);
router.get("/:productId", optionalAuth, getProductReviews);
router.post("/:id/like", verifyToken, toggleReviewLike);

// Admin
router.get("/admin/all", verifyToken, requireRole("admin"), getAllReviewsAdmin);
router.delete("/admin/:id", verifyToken, requireRole("admin"), deleteReview);
router.post("/admin/manual", verifyToken, requireRole("admin"), addManualReview);

export default router;
