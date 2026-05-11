import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../layout";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import Products from "./pages/Products";
import SingleProduct from "./pages/SingleProduct";
import AddProduct from "./pages/AddProduct";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { AuthPromptProvider } from "./context/AuthPromptContext";
import AuthPromptModal from "./components/AuthPromptModal";
import { Toaster } from "sonner";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AuthPromptProvider>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
      <AuthPromptModal />
        <Routes>
          {/* Auth pages — no layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* All other pages — with Layout (navbar + footer) */}
          <Route element={<Layout />}>

            {/* ── Public routes — no login needed ── */}
            <Route path="/" element={<Products />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<SingleProduct />} />

            {/* ── Private routes — must be logged in ── */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

            {/* ── Role-based routes — seller/admin only ── */}
            <Route
              path="/products/add"
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute roles={["seller", "admin"]}>
                    <AddProduct />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
      </AuthPromptProvider>
    </AuthProvider>
  </QueryClientProvider>
);
