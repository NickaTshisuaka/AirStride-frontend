import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./AuthContext.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx"; // ⚡ CHANGE: imported PublicRoute

// Pages
import Home from "./pages/Home/Home.jsx";
import SigninLogin from "./SigninLogin.jsx";
import Products from "./pages/Products/Products.jsx";
import ProductDetail from "./pages/ProductDetail/ProductDetail.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import OrderSummary from "./pages/OrderSummary/OrderSummary.jsx";

// Optional extra pages
import FAQ from "./pages/FAQ/FAQ.jsx";
import About from "./pages/About/About.jsx";
import Account from "./pages/Account/AccountSettings.jsx";
import Logout from "./pages/Logout/Logout.jsx";

import "./App.css";
import Checkout from "./pages/Checkout/Checkout.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route
              path="/signinlogin"
              element={
                <PublicRoute>
                  <SigninLogin />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
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
              path="/Checkout"
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

            {/* Redirects */}
            <Route path="/" element={<SigninLogin/>} />
            <Route path="*" element={<SigninLogin />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
