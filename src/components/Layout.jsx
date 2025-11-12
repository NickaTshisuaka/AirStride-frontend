import React from "react";
// import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <main style={{ flex: 1, padding: "1rem" }}>
        {/* <Navbar /> */}
        {children}
      </main>
    </div>
  );
}

export default Layout;
