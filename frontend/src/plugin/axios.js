import axios from "axios";
import { BASE_URLS } from "../constants/serviceBaseUrl";

// ─── Singleton axios instance ─────────────────────────────────────────────────
// Created ONCE — not inside a hook — so interceptors never stack up
const axiosInstance = axios.create({
  baseURL: BASE_URLS.BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

// ─── Token store (in-memory, not localStorage) ───────────────────────────────
let accessToken = null;
let isRefreshing = false;
let failedQueue = []; // holds requests waiting for new token

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

// ─── Public API to set/get/clear token ───────────────────────────────────────
export const setToken = (token) => { accessToken = token; };
export const getToken = () => accessToken;
export const clearToken = () => { accessToken = null; };

// ─── Helper: is token expired? ───────────────────────────────────────────────
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // refresh 30 seconds before actual expiry
    return payload.exp * 1000 < Date.now() + 30_000;
  } catch {
    return true;
  }
};

// ─── Helper: call refresh endpoint ───────────────────────────────────────────
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token");
  const res = await axios.post(`${BASE_URLS.BACKEND_URL}/api/auth/refresh`, { refreshToken });
  return res.data.accessToken;
};

// ─── Request interceptor: attach token, proactively refresh if near expiry ───
axiosInstance.interceptors.request.use(async (config) => {
  // Skip auth header for auth routes (only signin, signup, refresh)
  if (config.url?.includes("/api/auth/signin") ||
      config.url?.includes("/api/auth/signup") ||
      config.url?.includes("/api/auth/refresh")) return config;

  if (accessToken && isTokenExpired(accessToken)) {
    // Token is expired or about to expire — refresh proactively
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        setToken(newToken);
        processQueue(null, newToken);
      } catch (err) {
        processQueue(err, null);
        clearToken();
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/signin";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Queue this request until refresh completes
    return new Promise((resolve, reject) => {
      failedQueue.push({
        resolve: (token) => {
          config.headers.Authorization = `Bearer ${token}`;
          resolve(config);
        },
        reject,
      });
    });
  }

  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// ─── Response interceptor: handle 401 as fallback ────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry &&
        !original.url?.includes("/api/auth/signin") &&
        !original.url?.includes("/api/auth/signup") &&
        !original.url?.includes("/api/auth/refresh")) {
      if (isRefreshing) {
        // Another refresh is in progress — queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              original.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(original));
            },
            reject,
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        setToken(newToken);
        processQueue(null, newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(original);
      } catch (err) {
        processQueue(err, null);
        clearToken();
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/signin";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
