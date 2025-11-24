import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext"; 
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Navbar.css";

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [cartCount, setCartCount] = useState(0);
  const [cartAnimate, setCartAnimate] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [navSearch, setNavSearch] = useState("");
  
  // Set user name
  useEffect(() => {
    if (user?.displayName) {
      setFirstName(user.displayName);
    } else {
      const storedName = localStorage.getItem("firstName");
      if (storedName) {
        setFirstName(storedName);
      } else if (user?.email) {
        setFirstName(user.email.split("@")[0]);
      }
    }
  }, [user]);

  // Listen for cart updates
  useEffect(() => {
    const update = () => {
      const saved = JSON.parse(localStorage.getItem("cart")) || [];
      const totalQuantity = saved.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
      );

      setCartCount(totalQuantity);

      setCartAnimate(true);
      setTimeout(() => setCartAnimate(false), 450);
    };

    update(); // Initial load
    window.addEventListener("cartUpdated", update);

    return () => window.removeEventListener("cartUpdated", update);
  }, []);

  const showSearch = location.pathname === "/products";

  return (
    <header className="navbar-container">
      <div className="navbar-top">
        <div className="top-left">
          <Link to="/find-store" className="nav-link">Find a Store</Link>
          <span className="divider">|</span>
          <Link to="/FAQ" className="nav-link">Help</Link>
        </div>

        <div className="top-right">
          {firstName ? <span className="nav-link">Hi, {firstName}</span> :
            <Link to="/signinlogin" className="nav-link">Sign In</Link>}
          <Link to="/account" className="nav-icon">
            <i className="fas fa-user"></i>
          </Link>
        </div>
      </div>

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
  value={navSearch}
  placeholder="Search products..."
  onChange={(e) => {
    setNavSearch(e.target.value);
    window.dispatchEvent(
      new CustomEvent("productSearch", { detail: e.target.value })
    );
  }}
/>

            </div>
          )}

          <Link to="/favorites" className="nav-icon">
            <i className="far fa-heart"></i>
          </Link>

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
