// src/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthentication } from "./AuthContext";
import Layout from "./components/Layout.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthentication();
  const location = useLocation();

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signinlogin" state={{ from: location }} replace />;
  }

  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;
