import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthentication } from "./AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthentication();

  if (loading) return <div>Loading...</div>;

  if (isAuthenticated) return <Navigate to="/home" replace />;

  return children;
};

export default PublicRoute;
