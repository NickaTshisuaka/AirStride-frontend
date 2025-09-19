// src/PublicRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthentication } from "./AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthentication();

  if (loading) return <div>Loading...</div>;

  return !isAuthenticated ? children : <Navigate to="/home" replace />;
};

export default PublicRoute;
