import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../layout";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Home from "./pages/Products";
import SingleProduct from "./pages/SingleProduct";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Boutique from "./pages/Boutique";
import BoutiqueGallery from "./pages/BoutiqueGallery";
import BoutiqueInquiry from "./pages/BoutiqueInquiry";
import AddProduct from "./pages/AddProduct";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { AuthPromptProvider } from "./context/AuthPromptContext";
import { CartProvider } from "./context/CartContext";
import { BrandProvider } from "./context/BrandContext";
import AuthPromptModal from "./components/AuthPromptModal";
import { BOUTIQUE_ENABLED } from "./constants/featureFlags";
import { Toaster } from "sonner";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrandProvider>
      <AuthPromptProvider>
        <CartProvider>
          <Toaster position="top-right" richColors />
          <BrowserRouter>
            <AuthPromptModal />
            <Routes>
              {/* Auth pages — no layout */}
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* All other pages — with Layout (navbar + footer) */}
              <Route element={<Layout />}>
                {/*Public routes*/}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                {BOUTIQUE_ENABLED && (
                  <>
                    <Route path="/boutique" element={<Boutique />} />
                    <Route path="/boutique/gallery" element={<BoutiqueGallery />} />
                    <Route path="/boutique/inquiry" element={<BoutiqueInquiry />} />
                  </>
                )}
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
                <Route path="/products/:id" element={<SingleProduct />} />

                {/*Private routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/edit"
                  element={
                    <ProtectedRoute>
                      <EditProfile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <RoleProtectedRoute roles={["admin"]}>
                        <AdminDashboard />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* 404 fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthPromptProvider>
      </BrandProvider>
    </AuthProvider>
  </QueryClientProvider>,
);
