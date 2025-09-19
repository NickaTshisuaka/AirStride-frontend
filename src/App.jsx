// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";

// Pages
import Home from "./pages/Home/Home.jsx";
import SigninLogin from "./SigninLogin.jsx";
import Products from "./pages/Products/Products.jsx";
import ProductDetail from "./pages/ProductDetail/ProductDetail.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import OrderSummary from "./pages/OrderSummary/OrderSummary.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import FAQ from "./pages/FAQ/FAQ.jsx";
import About from "./pages/About/About.jsx";
import Account from "./pages/Account/AccountSettings.jsx";
import Logout from "./pages/Logout/Logout.jsx";
import FindStore from "./pages/FindStore/FindStore.jsx"; // ✅ NEW PAGE

import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Route: Only visible if NOT authenticated */}
          <Route
            path="/signinlogin"
            element={
              <PublicRoute>
                <SigninLogin />
              </PublicRoute>
            }
          />

          {/* Protected Routes: Require authentication */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-summary"
            element={
              <ProtectedRoute>
                <OrderSummary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faq"
            element={
              <ProtectedRoute>
                <FAQ />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <ProtectedRoute>
                <Logout />
              </ProtectedRoute>
            }
          />

          {/* ✅ NEW: Find Store route */}
          <Route
            path="/find-store"
            element={
              <ProtectedRoute>
                <FindStore />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to /signinlogin ALWAYS */}
          <Route path="/" element={<Navigate to="/signinlogin" replace />} />

          {/* Catch-all: redirect unknown routes to signin */}
          <Route path="*" element={<Navigate to="/signinlogin" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
