// src/components/TopNav.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthentication } from "../AuthContext";
import { useCart } from "../context/CartContext"; // ✅ use context
import "./TopNav.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const TopNav = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuthentication();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { cartCount } = useCart(); // ✅ get cart count from context
  const location = useLocation();

  const displayName =
    user?.firstName || user?.name || user?.email?.split("@")[0] || "Guest";

  const isProductsPage = location.pathname === "/products";

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <>
      <header className="topnav">
        {/* Tier 1 */}
        <div className="topnav-top">
          <div className="topnav-right">
            <Link to="/faq#orders">Help</Link>
            <span className="divider">|</span>
            <Link to="/find-store">Find Store</Link>
            <span className="divider">|</span>
            {isAuthenticated ? (
              <>
                <span>Hi, {displayName}</span>
                <i className="fas fa-user-circle profile-icon"></i>
                <button onClick={logout} className="logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/signinlogin">Sign In</Link>
            )}
          </div>
        </div>

        {/* Tier 2 */}
        <div className="topnav-inner">
          {/* Logo */}
          <div className="topnav-left">
            <Link to="/home" className="brand">
              <img src="logo.jpg" alt="AirStride logo" className="brand-logo" />
              <span className="brand-text">AirStride</span>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className={`topnav-center ${mobileOpen ? "open" : ""}`}>
            <ul>
              <li>
                <Link
                  to="/home"
                  className={location.pathname === "/home" ? "active" : ""}
                >
                  Home
                </Link>
              </li>

              {/* About dropdown */}
              <li
                className={`has-dropdown ${
                  mobileOpen && openDropdown === "about" ? "open" : ""
                }`}
              >
                <button
                  type="button"
                  className="drop-btn"
                  onClick={() => toggleDropdown("about")}
                >
                  About <i className="fas fa-caret-down"></i>
                </button>
                <ul className="dropdown">
                  <li>
                    <Link to="/about#company" onClick={() => setMobileOpen(false)}>
                      Our Company
                    </Link>
                  </li>
                  <li>
                    <Link to="/about#mission" onClick={() => setMobileOpen(false)}>
                      Our People
                    </Link>
                  </li>
                  <li>
                    <Link to="/about#team" onClick={() => setMobileOpen(false)}>
                      Sample Products
                    </Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link
                  to="/products"
                  className={location.pathname === "/products" ? "active" : ""}
                >
                  Products
                </Link>
              </li>

              {/* FAQ dropdown */}
              <li
                className={`has-dropdown ${
                  mobileOpen && openDropdown === "faq" ? "open" : ""
                }`}
              >
                <button
                  type="button"
                  className="drop-btn"
                  onClick={() => toggleDropdown("faq")}
                >
                  FAQ <i className="fas fa-caret-down"></i>
                </button>
                <ul className="dropdown">
                  <li><Link to="/faq#orders">Orders</Link></li>
                  <li><Link to="/faq#shipping">Shipping</Link></li>
                  <li><Link to="/faq#returns">Returns</Link></li>
                </ul>
              </li>

              {/* Account dropdown */}
              <li
                className={`has-dropdown ${
                  mobileOpen && openDropdown === "account" ? "open" : ""
                }`}
              >
                <button
                  type="button"
                  className="drop-btn"
                  onClick={() => toggleDropdown("account")}
                >
                  Account <i className="fas fa-caret-down"></i>
                </button>
                <ul className="dropdown">
                  <li><Link to="/account">Profile Settings</Link></li>
                  <li><Link to="/order-summary">Orders</Link></li>
                  <li><Link to="/logout">Logout</Link></li>
                </ul>
              </li>
            </ul>
          </nav>

          {/* Right side: search + cart */}
          <div className="topnav-right-icons">
            {isProductsPage ? (
              <div className="topnav-search">
                <input type="text" placeholder="Search products..." />
                <button><i className="fas fa-search"></i></button>
              </div>
            ) : (
              <button className="search-icon-btn">
                <i className="fas fa-search"></i>
              </button>
            )}

            <Link to="/cart" className="cart-icon">
              <i className="fas fa-shopping-cart"></i>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className={`mobile-burger ${mobileOpen ? "open" : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      {/* Page content wrapper */}
      <div className="page-wrapper">{children}</div>
    </>
  );
};

export default TopNav;
