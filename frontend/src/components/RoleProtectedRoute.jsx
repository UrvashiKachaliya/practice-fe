import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!roles.includes(user?.role))
    return <Navigate to="/" replace />;

  return children;
};

export default RoleProtectedRoute;
