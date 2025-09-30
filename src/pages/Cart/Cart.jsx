import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMinus, FaTrashAlt, FaShoppingCart } from "react-icons/fa";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage and add quantity if missing
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartWithQty = storedCart.map(item => ({
      ...item,
      quantity: item.quantity || 1
    }));
    setCartItems(cartWithQty);
  }, []);

  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleRemove = (id) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    updateCart(updatedCart);
  };

  const handleQuantityChange = (id, delta) => {
    const updatedCart = cartItems.map(item => {
      if (item._id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    updateCart(updatedCart);
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h1><FaShoppingCart /> Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-grid">
            {cartItems.map(item => (
              <div className="cart-item" key={item._id}>
                <div className="cart-image">
                  <img
                    src={item.img || "/images/default.jpeg"}
                    alt={item.name}
                  />
                </div>
                <div className="cart-info">
                  <h2>{item.name}</h2>
                  <p className="price">R {item.price}</p>

                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(item._id, -1)}><FaMinus /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item._id, 1)}><FaPlus /></button>
                  </div>

                  <button className="remove-btn" onClick={() => handleRemove(item._id)}>
                    <FaTrashAlt /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Total: R {totalPrice.toFixed(2)}</h2>
            <button className="checkout-btn" onClick={() => navigate("/Checkout")}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
