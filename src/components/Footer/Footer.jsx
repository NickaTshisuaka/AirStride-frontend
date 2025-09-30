// src/components/Footer/Footer.jsx
import React from "react";
import "./Footer.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <h3>AirStride</h3>
        <p>123 Malborough Lane, SpringField , South Africa</p>
        <div className="social-icons">
          <a href="#" aria-label="Facebook"><FaFacebookF /></a>
          <a href="#" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
        </div>
        <p className="footer-copy">&copy; {new Date().getFullYear()} AirStride. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
