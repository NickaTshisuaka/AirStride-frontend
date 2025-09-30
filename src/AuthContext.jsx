// src/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:3001/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("auth_token", data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        return { success: true, token: data.token };
      }
      return { success: false, error: data?.error || "Login failed" };
    } catch (err) {
      return { success: false, error: "Login error" };
    }
  };

  const signup = async ({ email, password, firstName, lastName }) => {
    try {
      const res = await fetch("http://localhost:3001/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });
      const data = await res.json();
      if (res.ok) return { success: true };
      return { success: false, error: data?.error || "Signup failed" };
    } catch (err) {
      return { success: false, error: "Signup error" };
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthentication = () => {
  return useContext(AuthContext) || {};
};
