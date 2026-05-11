import { getCartService, addToCartService, updateCartService, removeFromCartService } from "../services/cart.Services.js";

export const getCart = async (req, res) => {
  try {
    res.json(await getCartService(req.user.id));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const addToCart = async (req, res) => {
  const { productId, quantity, weight } = req.body;
  if (!productId) return res.status(400).json({ message: "productId is required" });
  try {
    res.json(await addToCartService(req.user.id, productId, quantity, weight));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    res.json(await updateCartService(req.params.id, req.user.id, req.body.quantity));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    res.json(await removeFromCartService(req.params.id, req.user.id));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
