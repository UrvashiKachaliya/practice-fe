import express from "express";
import {
  getStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllProductsAdmin,
  deleteProduct,
  getAdminAllOrders,
} from "../controllers/admin.Controllers.js";
import { getAdminOrders, updateOrderStatus, respondDeliveryDate } from "../controllers/order.Controllers.js";
import { updateProduct } from "../controllers/product.Controller.js";
import { verifyToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { upload, handleUploadError } from '../middleware/upload.js';
import { uploadProductImage, deleteProductImage } from '../controllers/upload.Controllers.js';

const router = express.Router();

router.use(verifyToken, requireRole("admin"));

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/products", getAllProductsAdmin);
router.delete("/products/:id", deleteProduct);
router.put("/products/:id", updateProduct);
router.get("/orders", getAdminOrders);
router.get("/orders/all", getAdminAllOrders);
router.put("/orders/:id/status", updateOrderStatus);
router.put("/orders/:id/delivery-response", respondDeliveryDate);
router.post('/product-image', (req,res,next)=>{
  console.log("ROUTE HIT");
  next();
},
upload.single('image'),
handleUploadError,
uploadProductImage
);

// Delete product image (admin only)
router.delete(
  '/product-image/:filename',
  deleteProductImage
);


export default router;
