import { getWishlistService, toggleWishlistService, checkWishlistService } from "../services/wishlist.Services.js";

export const getWishlist = async (req, res) => {
  try { res.json(await getWishlistService(req.user.id)); }
  catch (e) { res.status(500).json({ message: e.message }); }
};

export const toggleWishlist = async (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ message: "productId required" });
  try { res.json(await toggleWishlistService(req.user.id, productId)); }
  catch (e) { res.status(500).json({ message: e.message }); }
};

export const checkWishlist = async (req, res) => {
  try { res.json(await checkWishlistService(req.user.id, req.params.productId)); }
  catch (e) { res.status(500).json({ message: e.message }); }
};
