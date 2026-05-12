import { addProductService, getAllProductsService, getSingleProductService, updateProductService, getAllProductsAdminService } from "../services/product.Services.js";

export const addProduct = async (req, res) => {
  const { title, description, price, category, stock, image } = req.body;
  if (!title || !price || !category || !stock)
    return res.status(400).json({ message: "title, price, category and stock are required" });
  try {
    const product = await addProductService({ title, description, price, category, stock, image }, req.user.id);
    res.status(201).json({ success: true, message: "Product added", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { title, description, price, category, stock, image, status } = req.body;
  if (!title || !price || !category || stock === undefined)
    return res.status(400).json({ message: "title, price, category and stock are required" });
  try {
    await updateProductService(req.params.id, { title, description, price, category, stock, image, status });
    res.json({ success: true, message: "Product updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await getAllProductsService();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await getSingleProductService(req.params.id);
    res.status(200).json({ success: true, product });
  } catch (error) {
    const status = error.message === "Product not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

// Admin only — returns all products including inactive
export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await getAllProductsAdminService();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
