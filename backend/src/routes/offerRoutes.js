import express from "express";
import { getActiveOffers, getAllOffersAdmin, createOffer, updateOffer, deleteOffer } from "../controllers/offers.Controllers.js";
import { verifyToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();

router.get("/", getActiveOffers);
router.get("/admin", verifyToken, requireRole("admin"), getAllOffersAdmin);
router.post("/", verifyToken, requireRole("admin"), createOffer);
router.put("/:id", verifyToken, requireRole("admin"), updateOffer);
router.delete("/:id", verifyToken, requireRole("admin"), deleteOffer);

export default router;
