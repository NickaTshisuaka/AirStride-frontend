import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} AirStride. All rights reserved.</p>
      <p>Made with ❤️ in South Africa</p>
    </footer>
  );
};

export default Footer;
