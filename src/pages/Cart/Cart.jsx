import React from "react";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../../contexts/CartContext";
import { useFavoritesContext } from "../../contexts/FavoritesContext";
import "./Cart.css";

const SHIPPING_COST = 85.0;

const formatZAR = (amount) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(amount);

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartContext();
  const { favorites, addFavorite, removeFavorite } = useFavoritesContext();

  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <div className="cart-page-container">
      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-cart-message">
          <p>Your cart is empty! Browse products to add items.</p>
          <button className="btn back-to-shop-btn" onClick={() => navigate("/products")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          {/* --- Cart Items List --- */}
          <div className="cart-items-list">
            {cart.map((item) => (
              <div key={item.product_id} className="cart-item-card">
                <img src={item.image || item.imageUrl} alt={item.name} className="item-image" />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">{formatZAR(item.price)}</p>
                  <p className="item-desc">{item.description || "No description available."}</p>

                  {/* --- Quantity Controls --- */}
                  <div className="item-controls">
                    <div className="quantity-control">
                      <button
                        onClick={() =>
                          updateQuantity(item.product_id, Math.max(1, (item.quantity || 1) - 1))
                        }
                        disabled={(item.quantity || 1) <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity || 1}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product_id, (item.quantity || 1) + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button className="remove-btn" onClick={() => removeFromCart(item.product_id)}>
                      Remove
                    </button>

                    <button
                      className={`fav-btn ${
                        favorites.some((f) => f.product_id === item.product_id) ? "active" : ""
                      }`}
                      onClick={() =>
                        favorites.some((f) => f.product_id === item.product_id)
                          ? removeFavorite(item.product_id)
                          : addFavorite(item)
                      }
                    >
                      {favorites.some((f) => f.product_id === item.product_id) ? "💔 Unfav" : "❤️ Fav"}
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  {formatZAR((item.price || 0) * (item.quantity || 1))}
                </div>
              </div>
            ))}
          </div>

          {/* --- Order Summary --- */}
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal ({cart.length} items)</span>
              <span>{formatZAR(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{formatZAR(SHIPPING_COST)}</span>
            </div>
            <div className="summary-row total">
              <strong>Total</strong>
              <strong>{formatZAR(subtotal + SHIPPING_COST)}</strong>
            </div>

            <button className="btn checkout-btn" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </button>
            <button className="btn back-to-shop-btn" onClick={() => navigate("/products")}>
              ← Continue Shopping
            </button>
            <button className="btn clear-cart-btn" onClick={() => clearCart()}>
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
