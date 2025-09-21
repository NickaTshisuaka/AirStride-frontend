import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// ✅ Use Elastic IP for production, localhost for dev
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:3001"
    : "http://98.89.166.198:3001";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check localStorage for saved auth state
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

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/users/login`, {
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
          name:
            data.user?.name ||
            `${data.user?.firstName || ""} ${data.user?.lastName || ""}`,
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
      console.error("Login fetch error:", err);
      return { success: false, error: "Network error during login" };
    }
  };

  // SIGNUP
  const signup = async ({ email, password, firstName, lastName }) => {
    try {
      const res = await fetch(`${API_BASE}/users/signup`, {
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
      console.error("Signup fetch error:", err);
      return { success: false, error: "Network error during signup" };
    }
  };

  // LOGOUT
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

// Custom hook
export const useAuthentication = () => {
  return useContext(AuthContext) || {
    user: null,
    logout: () => {},
    isAuthenticated: false,
    loading: false,
  };
};
