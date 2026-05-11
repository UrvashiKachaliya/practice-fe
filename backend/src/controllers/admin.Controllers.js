import {
  getStatsService,
  getAllUsersService,
  updateUserRoleService,
  deleteUserService,
  getAllProductsAdminService,
  deleteProductService,
} from "../services/admin.Services.js";

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
