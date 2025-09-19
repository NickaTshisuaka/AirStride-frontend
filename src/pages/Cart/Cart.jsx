// src/pages/Cart/Cart.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import TopNav from "../../components/TopNav";
import "./Cart.css";

const Cart = () => {
  const { cart, setCart, cartCount } = useCart();
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  // Calculate total whenever cart changes
  useEffect(() => {
    const totalPrice = cart.reduce(
      (sum, item) => sum + (item.Price || 0) * (item.quantity || 1),
      0
    );
    setTotal(totalPrice);
  }, [cart]);

  // Increase / decrease quantity
  const updateQuantity = (id, change) => {
    const updatedCart = cart.map((item) =>
      item._id === id
        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + change) }
        : item
    );
    setCart(updatedCart);
  };

  // Remove item completely
  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
  };

  return (
    <div className="cart-page">
      <TopNav />

      <div className="cart-container">
        {/* LEFT SIDE */}
        <div className="cart-left">
          <h1 className="cart-title">
            <FaShoppingCart /> Your Cart
          </h1>

          {cart.length === 0 && <p className="empty-cart">Your cart is empty.</p>}

          {cart.map((item) => (
            <div key={item._id} className="cart-item animate">
              <img
                src={item.image || "/placeholder.png"}
                alt={item.name}
                className="cart-item-img"
              />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p className="cart-item-price">R {(item.Price || 0).toFixed(2)}</p>

                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item._id, -1)}>
                    <FaMinus />
                  </button>
                  <span>{item.quantity || 1}</span>
                  <button onClick={() => updateQuantity(item._id, 1)}>
                    <FaPlus />
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item._id)}
                >
                  <FaTrash /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE (SUMMARY) */}
        <div className="cart-right animate">
          <h3>Order Summary</h3>
          <div className="summary-line">
            <span>Items:</span>
            <span>{cartCount}</span>
          </div>
          <div className="summary-total">
            <span>Total:</span>
            <span>R {total.toFixed(2)}</span>
          </div>
          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
            disabled={cart.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
