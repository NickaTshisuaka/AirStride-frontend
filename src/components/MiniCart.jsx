import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

const MiniCart = () => {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  }, []);

  const handleClick = () => {
    navigate("/cart");
  };

  return (
    <div className="mini-cart" onClick={handleClick}>
      <i className="fas fa-shopping-cart"></i> Cart1 ({cartCount})
    </div>
  );
};

export default MiniCart;
