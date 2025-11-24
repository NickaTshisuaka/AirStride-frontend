import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFavoritesContext } from "../../contexts/FavoritesContext";
import { useCartContext } from "../../contexts/CartContext";
import { ShoppingCart, Heart } from "lucide-react";
import "./Favorites.css";

const Favorites = () => {
  const navigate = useNavigate();
  const { favorites, removeFavorite } = useFavoritesContext();
  const { addToCart, cart } = useCartContext();
  const [toastMessage, setToastMessage] = useState("");

  // Check if a product is in the cart
  const isInCart = (id) => cart.some((item) => item.product_id === id);

  // Add product to cart
  const handleAddToCart = (item) => {
    if (!isInCart(item.product_id)) {
      addToCart(item);
      setToastMessage(`${item.name} added to cart 🛒`);
    } else {
      setToastMessage(`${item.name} is already in cart`);
    }
  };

  // Remove product from favorites
  const handleRemoveFavorite = (id, name) => {
    console.log("Removing favorite:", id, name); // <-- debug log
    removeFavorite(id);

    // Log updated favorites after a short delay to ensure state updated
    setTimeout(() => {
      console.log("Updated favorites array:", favorites);
    }, 100);

    setToastMessage(`${name} removed from favorites ❤️`);
  };

  // Auto-hide toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(""), 2000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  return (
    <div className="favorites-page">
      <h2>❤️ Your Favorites</h2>

      {favorites.length === 0 ? (
        <p className="no-favorites">
          No favorites yet. Browse products to add some!
        </p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((item) => (
            <div key={item.product_id} className="favorite-card">
              <img
                src={item.image || item.imageUrl || "https://placehold.co/300x300?text=No+Image"}
                alt={item.name}
                className="favorite-img"
              />
              <h3 className="favorite-name">{item.name}</h3>
              <p className="favorite-price">R{(item.price || 0).toFixed(2)}</p>

              <div className="favorite-buttons">
                <button
                  className="btn remove-fav-btn"
                  onClick={() => handleRemoveFavorite(item.product_id, item.name)}
                >
                  <Heart fill="red" /> Remove
                </button>

                <button
                  className={`btn add-cart-btn ${isInCart(item.product_id) ? "in-cart" : ""}`}
                  onClick={() => handleAddToCart(item)}
                  disabled={isInCart(item.product_id)}
                >
                  <ShoppingCart /> {isInCart(item.product_id) ? "In Cart" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toastMessage && <div className="toast">{toastMessage}</div>}
    </div>
  );
};

export default Favorites;
