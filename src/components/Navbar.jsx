// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useCart } from "../contexts/CartContext";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Navbar.css";

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { cartCount } = useCart();

  const [cartAnimate, setCartAnimate] = useState(false);
  const [firstName, setFirstName] = useState("");

  // Extract firstName from Firebase or localStorage
  useEffect(() => {
    if (user?.displayName) {
      setFirstName(user.displayName);
    } else {
      const storedName = localStorage.getItem("firstName");
      if (storedName) {
        setFirstName(storedName);
      } else if (user?.email) {
        setFirstName(user.email.split("@")[0]);
      } else {
        setFirstName("");
      }
    }
  }, [user]);

  // Show search bar only on /products page
  const showSearch = location.pathname === "/products";

  // Trigger small animation whenever cartCount changes
  useEffect(() => {
    if (cartCount > 0) {
      setCartAnimate(true);
      const t = setTimeout(() => setCartAnimate(false), 450);
      return () => clearTimeout(t);
    }
  }, [cartCount]);

  return (
    <header className="navbar-container">
      {/* Top Bar */}
      <div className="navbar-top">
        <div className="top-left">
          <Link to="/find-store" className="nav-link">Find a Store</Link>
          <span className="divider">|</span>
          <Link to="/FAQ" className="nav-link">Help</Link>
        </div>

        <div className="top-right">
          {firstName ? (
            <span className="nav-link">Hi, {firstName}</span>
          ) : (
            <Link to="/signinlogin" className="nav-link">Sign In</Link>
          )}
          <Link to="/account" className="nav-icon">
            <i className="fas fa-user"></i>
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="navbar-main">
        <Link to="/home" className="logo">
          <img src="/logo.ico" alt="AirStride Logo" />
        </Link>

        <nav className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/past-purchases">Past Purchases</Link>
          <Link to="/FAQ">FAQs</Link>
          <Link to="/About">About Us</Link>
          <Link to="/account">Account Settings</Link>
          <Link to="/logout">Logout</Link>
        </nav>

        <div className="nav-actions">
          {showSearch && (
            <div className="search-bar">
              <i className="fas fa-search"></i>
              <input
  type="text"
  placeholder="Search products..."
  onChange={(e) =>
    window.dispatchEvent(new CustomEvent("productSearch", { detail: e.target.value }))
  }
/>

            </div>
          )}

          <Link to="/favorites" className="nav-icon">
            <i className="far fa-heart"></i>
          </Link>

          {/* Cart Icon */}
          <div className="cart-container">
            <Link to="/cart" className={`nav-icon ${cartAnimate ? "cart-bounce" : ""}`}>
              <i className="fas fa-shopping-cart"></i>
            </Link>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
