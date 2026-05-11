import axiosInstance from "../plugin/axios";
import { API_ENDPOINTS } from "../constants/url";

export const registerUser = (data) => axiosInstance.post(API_ENDPOINTS.SIGNUP, data);
export const loginUser = (data) => axiosInstance.post(API_ENDPOINTS.SIGNIN, data);
export const verifyEmail = (data) => axiosInstance.post(API_ENDPOINTS.VERIFY_EMAIL, data);
export const resendOTP = (data) => axiosInstance.post(API_ENDPOINTS.RESEND_OTP, data);
export const updateProfile = (data) => axiosInstance.put(API_ENDPOINTS.UPDATE_PROFILE, data);
export const addProduct = (data) => axiosInstance.post(API_ENDPOINTS.ADD_PRODUCT, data);
export const getAllProducts = () => axiosInstance.get(API_ENDPOINTS.PRODUCTS);
export const getSingleProduct = (id) => axiosInstance.get(`${API_ENDPOINTS.PRODUCTS}/${id}`);
