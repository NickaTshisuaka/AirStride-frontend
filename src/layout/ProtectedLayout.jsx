import React from "react";
import Sidebar from "../components/Sidebar";

const ProtectedLayout = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        {children}
      </div>
    </div>
  );
};

export default ProtectedLayout;
