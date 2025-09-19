// src/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // store user info
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
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
        const userInfo = {
          email: data.user?.email || email,
          firstName: data.user?.firstName || "",
          lastName: data.user?.lastName || "",
          name: data.user?.name || "",
        };
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("auth_user", JSON.stringify(userInfo));
        setToken(data.token);
        setUser(userInfo);
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
      if (res.ok && data.token) {
        const userInfo = {
          email,
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
        };
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("auth_user", JSON.stringify(userInfo));
        setToken(data.token);
        setUser(userInfo);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: data?.error || "Signup failed" };
    } catch (err) {
      return { success: false, error: "Signup error" };
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, user, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthentication = () => {
  return useContext(AuthContext) || {
    user: null,
    logout: () => {},
    isAuthenticated: false,
    loading: false,
  };
};
