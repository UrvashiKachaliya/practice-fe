import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { BASE_URLS } from "../constants/serviceBaseUrl";
import { setToken, clearToken } from "../plugin/axios";

const AuthContext = createContext(null);

// Decode JWT payload without verifying signature
const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

// Check if token is expired (with 30s buffer)
const isExpired = (token) => {
  const payload = decodeToken(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 < Date.now() + 30_000;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const restoreToken = async () => {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // No session at all
        setAuthReady(true);
        return;
      }

      if (isExpired(refreshToken)) {
        // Refresh token itself is expired — clear session, no API call needed
        clearToken();
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setUser(null);
        setAuthReady(true);
        return;
      }

      // Refresh token is valid — get a new accessToken
      // This is the ONLY time we call refresh on reload
      try {
        const res = await axios.post(
          `${BASE_URLS.BACKEND_URL}/api/auth/refresh`,
          { refreshToken }
        );
        setToken(res.data.accessToken);
      } catch {
        // Refresh failed — clear everything and force re-login
        clearToken();
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setUser(null);
      }

      setAuthReady(true);
    };

    restoreToken();
  }, []);

  const login = (data) => {
    setToken(data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    clearToken();
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  if (!authReady)
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="flex flex-col items-center gap-3">
          <span className="text-5xl">🌾</span>
          <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
