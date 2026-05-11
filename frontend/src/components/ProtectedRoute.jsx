import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthPrompt } from "../context/AuthPromptContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const { openAuthPrompt } = useAuthPrompt();
  const location = useLocation();

  useEffect(() => {
    if (!user) openAuthPrompt(location.pathname);
  }, [user]);

  if (!user) return null;

  return children;
};

export default ProtectedRoute;
