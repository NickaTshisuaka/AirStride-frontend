import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthentication } from "../AuthContext"; // fixed path
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthentication(); // should contain { firstName, email, ... }

  return (
    <nav className={`sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Header */}
      <div className="sidebar-header">
        {isOpen && (
          <>
            <img src="/public/logo.png" alt="AirStride Logo" className="sidebar-logo" />
            <h1 className="sidebar-title">AirStride</h1>
          </>
        )}
        <button
          className={`burger-btn ${isOpen ? "rotated" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Sidebar"
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      {/* User Greeting */}
      {isOpen && user?.firstName && (
        <div className="sidebar-user">👋 Hello, {user.firstName}</div>
      )}

      {/* Links */}
      <ul className="sidebar-links">
        <li>
          <Link to="/signinlogin">
            <i className="fas fa-user-plus"></i> {isOpen && "Sign In / Sign Up"}
          </Link>
        </li>
        <li>
          <Link to="/home">
            <i className="fas fa-home"></i> {isOpen && "Home"}
          </Link>
        </li>
        <li>
          <Link to="/products">
            <i className="fas fa-list"></i> {isOpen && "Products"}
          </Link>
        </li>
        <li>
          <Link to="/cart">
            <i className="fas fa-shopping-cart"></i> {isOpen && "Cart"}
          </Link>
        </li>
        <li>
          <Link to="/checkout">
            <i className="fas fa-credit-card"></i> {isOpen && "Checkout"}
          </Link>
        </li>
        <li>
          <Link to="/order-summary">
            <i className="fas fa-receipt"></i> {isOpen && "Order Summary"}
          </Link>
        </li>
        <li>
          <Link to="/about">
            <i className="fas fa-info-circle"></i> {isOpen && "About Us"}
          </Link>
        </li>
        <li>
          <Link to="/faq">
            <i className="fas fa-question-circle"></i> {isOpen && "FAQ"}
          </Link>
        </li>
        <li>
          <Link to="/account">
            <i className="fas fa-user-cog"></i> {isOpen && "Account Settings"}
          </Link>
        </li>
        <li>
          <Link to="/logout">
            <i className="fas fa-sign-out-alt"></i> {isOpen && "Logout"}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
