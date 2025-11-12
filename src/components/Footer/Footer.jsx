// src/components/Footer/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer style={{ textAlign: "center", padding: "20px", background: "#eee" }}>
      <p>© {new Date().getFullYear()} AirStride. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
