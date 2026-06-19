import {
  getStatsService,
  getAllUsersService,
  updateUserRoleService,
  deleteUserService,
  getAllProductsAdminService,
  deleteProductService,
  getAllAdminOrdersService
} from "../services/admin.Services.js";
import logger from "../utils/logger.js";

export const getStats = async (req, res) => {
  try {
    res.json(await getStatsService());
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    res.json(await getAllUsersService());
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    res.json(await updateUserRoleService(req.params.id, req.body.role));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    res.json(await deleteUserService(req.params.id));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getAllProductsAdmin = async (req, res) => {
  try {
    res.json(await getAllProductsAdminService());
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    res.json(await deleteProductService(req.params.id));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getAdminAllOrders = async (req, res) => {
  try {
    const orders = await getAllAdminOrdersService();

    res.status(200).json(orders);
  } catch (e) {
    logger.error({
      message: "getAdminOrders failed",
      error: e.message,
    });

    res.status(500).json({
      message: e.message,
    });
  }
};
