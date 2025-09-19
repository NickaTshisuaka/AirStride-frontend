// src/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthentication } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthentication();

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/signinlogin" replace />;
};

export default ProtectedRoute;
