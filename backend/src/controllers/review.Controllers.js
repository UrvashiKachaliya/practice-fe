import { addReviewService, getProductReviewsService, toggleReviewLikeService, getAllReviewsAdminService, deleteReviewService, addManualReviewService } from "../services/review.Services.js";

export const addReview = async (req, res) => {
  const { productId, orderId, rating, comment } = req.body;
  if (!productId || !orderId || !rating)
    return res.status(400).json({ message: "productId, orderId and rating are required" });
  try {
    res.status(201).json(await addReviewService(req.user.id, productId, orderId, rating, comment));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    res.json(await getProductReviewsService(req.params.productId, userId));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const toggleReviewLike = async (req, res) => {
  try {
    res.json(await toggleReviewLikeService(req.user.id, req.params.id));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getAllReviewsAdmin = async (req, res) => {
  try {
    res.json(await getAllReviewsAdminService());
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    res.json(await deleteReviewService(req.params.id));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const addManualReview = async (req, res) => {
  const { productId, reviewerName, rating, comment } = req.body;
  if (!productId || !reviewerName || !rating)
    return res.status(400).json({ message: "productId, reviewerName and rating are required" });
  try {
    res.status(201).json(await addManualReviewService(productId, reviewerName, rating, comment));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
