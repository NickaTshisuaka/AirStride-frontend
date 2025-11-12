import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

// Helper function to format currency as ZAR
const formatZAR = (amount) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Mock data (Assume this comes from your product page state)
// const initialCartItems = [
//   {
//     id: 2,
//     image: "/prod2.jpeg",
//     name: "AirStride Jogging Shoes",
//     price: 2500.00,
//     quantity: 1,
//     description: "Lightweight, cushioned, and performance-optimized.",
//   },
//   {
//     id: 5,
//     image: "/prod5.jpeg",
//     name: "Smart Hydration Bottle",
//     price: 750.00,
//     quantity: 2,
//     description: "Monitors water intake and syncs with the app for tracking.",
//   },
//   {
//     id: 1,
//     image: "/prod1.jpeg",
//     name: "Breathing Trainer Pro",
//     price: 1200.00,
//     quantity: 1,
//     description: "Enhances lung capacity and endurance for athletes.",
//   },
// ];

const SHIPPING_COST = 85.00;

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const navigate = useNavigate();

  // Calculate Subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Handle Quantity Changes (unchanged)
  const handleQuantityChange = (id, newQuantity) => {
    const updatedItems = cartItems
      .map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    setCartItems(updatedItems);
  };

  // Handle Item Removal (unchanged)
  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // ----------------------------------------------------
  // --- UPDATED NAVIGATION FUNCTIONS ---
  // ----------------------------------------------------

  const handleCheckout = () => {
    // Redirect to the checkout page
    navigate('/checkout'); 
  };
  
  const handleContinueShopping = () => {
    // Redirect to the products page
    navigate('/products');
  };

  // ----------------------------------------------------

  const cartIsEmpty = cartItems.length === 0;

  return (
    <div className="cart-page-container">
      <h1>Your Shopping Cart</h1>
      
      {cartIsEmpty ? (
        <div className="empty-cart-message">
          <p>Your cart is empty! Time to find your next piece of gear. 🏃</p>
          <button 
            className="btn continue-shopping" 
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          {/* --- Cart Items List (unchanged) --- */}
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div className="cart-item-card" key={item.id}>
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">
                    {formatZAR(item.price)} per item
                  </p>
                  <p className="item-desc">{item.description}</p>
                  
                  <div className="item-controls">
                    <div className="quantity-control">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="item-total">
                  {formatZAR(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* --- Summary Panel --- */}
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>{formatZAR(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping Estimate</span>
              <span>{formatZAR(SHIPPING_COST)}</span>
            </div>
            <div className="summary-row total">
              <strong>Total (ZAR)</strong>
              <strong>{formatZAR(subtotal + SHIPPING_COST)}</strong>
            </div>
            
            {/* 1. Checkout button redirects to /checkout */}
            <button className="btn checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            
            {/* 2. Continue Shopping button redirects to /products */}
            <button 
              className="btn back-to-shop-btn" 
              onClick={handleContinueShopping}
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;