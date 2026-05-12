import axiosInstance from "../plugin/axios";
import { API_ENDPOINTS } from "../constants/url";

export const registerUser = (data) => axiosInstance.post(API_ENDPOINTS.SIGNUP, data);
export const loginUser = (data) => axiosInstance.post(API_ENDPOINTS.SIGNIN, data);
export const verifyEmail = (data) => axiosInstance.post(API_ENDPOINTS.VERIFY_EMAIL, data);
export const resendOTP = (data) => axiosInstance.post(API_ENDPOINTS.RESEND_OTP, data);
export const forgotPassword = (data) => axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, data);
export const resetPassword = (data) => axiosInstance.post(API_ENDPOINTS.RESET_PASSWORD, data);
export const updateProfile = (data) => axiosInstance.put(API_ENDPOINTS.UPDATE_PROFILE, data);
export const addProduct = (data) => axiosInstance.post(API_ENDPOINTS.ADD_PRODUCT, data);
export const getAllProducts = () => axiosInstance.get(API_ENDPOINTS.PRODUCTS);
export const getSingleProduct = (id) => axiosInstance.get(`${API_ENDPOINTS.PRODUCTS}/${id}`);
export const updateProduct = (id, data) => axiosInstance.put(`${API_ENDPOINTS.PRODUCTS}/${id}`, data);

// Cart
export const getCart = () => axiosInstance.get(API_ENDPOINTS.CART);
export const addToCart = (data) => axiosInstance.post(API_ENDPOINTS.CART, data);
export const updateCartItem = (id, quantity) => axiosInstance.put(`${API_ENDPOINTS.CART}/${id}`, { quantity });
export const removeCartItem = (id) => axiosInstance.delete(`${API_ENDPOINTS.CART}/${id}`);

// Orders
export const placeOrder = (data) => axiosInstance.post(API_ENDPOINTS.ORDERS, data);
export const getUserOrders = () => axiosInstance.get(API_ENDPOINTS.ORDERS);
export const repeatOrder = (id) => axiosInstance.post(`${API_ENDPOINTS.ORDERS}/${id}/repeat`);

// Admin
export const getAdminStats = () => axiosInstance.get(API_ENDPOINTS.ADMIN_STATS);
export const getAdminUsers = () => axiosInstance.get(API_ENDPOINTS.ADMIN_USERS);
export const updateUserRole = (id, role) => axiosInstance.put(`${API_ENDPOINTS.ADMIN_USERS}/${id}/role`, { role });
export const deleteUser = (id) => axiosInstance.delete(`${API_ENDPOINTS.ADMIN_USERS}/${id}`);
export const getAdminProducts = () => axiosInstance.get(API_ENDPOINTS.ADMIN_PRODUCTS);
export const deleteProduct = (id) => axiosInstance.delete(`${API_ENDPOINTS.ADMIN_PRODUCTS}/${id}`);
export const getAdminOrders = () => axiosInstance.get(API_ENDPOINTS.ADMIN_ORDERS);
export const updateOrderStatus = (id, status) => axiosInstance.put(`${API_ENDPOINTS.ADMIN_ORDERS}/${id}/status`, { status });
export const respondDeliveryDate = (id, data) => axiosInstance.put(`${API_ENDPOINTS.ADMIN_ORDERS}/${id}/delivery-response`, data);

// Offers
export const getActiveOffers = () => axiosInstance.get(API_ENDPOINTS.OFFERS);
export const getAdminOffers = () => axiosInstance.get(API_ENDPOINTS.ADMIN_OFFERS);
export const createOffer = (data) => axiosInstance.post(API_ENDPOINTS.OFFERS, data);
export const updateOffer = (id, data) => axiosInstance.put(`${API_ENDPOINTS.OFFERS}/${id}`, data);
export const deleteOffer = (id) => axiosInstance.delete(`${API_ENDPOINTS.OFFERS}/${id}`);

// Wishlist
export const getWishlist = () => axiosInstance.get(API_ENDPOINTS.WISHLIST);
export const toggleWishlist = (productId) => axiosInstance.post(`${API_ENDPOINTS.WISHLIST}/toggle`, { productId });
export const checkWishlist = (productId) => axiosInstance.get(`${API_ENDPOINTS.WISHLIST}/check/${productId}`);
