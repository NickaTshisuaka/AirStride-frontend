// src/pages/Favorites/Favorites.jsx
import React, { useEffect, useState } from "react";
import "./Favorites.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Load saved favorites from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const removeFavorite = (id) => {
    const updated = favorites.filter((item) => item._id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="favorites-page">
      <h2 className="favorites-title">❤️ Your Favorites</h2>

      {favorites.length === 0 ? (
        <p className="no-favorites">You haven’t added any favorites yet.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((product) => (
            <div key={product._id} className="favorite-card">
              <img
                src={product.thumbnailUrl || product.img}
                alt={product.Product_name}
                className="favorite-img"
              />
              <div className="favorite-info">
                <h3>{product.Product_name}</h3>
                <p className="favorite-price">R{product.Price}</p>
                <div className="favorite-buttons">
                  <button
                    className="remove-btn"
                    onClick={() => removeFavorite(product._id)}
                  >
                    Remove
                  </button>
                  <button
                    className="view-btn"
                    onClick={() => (window.location.href = `/products/${product._id}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
