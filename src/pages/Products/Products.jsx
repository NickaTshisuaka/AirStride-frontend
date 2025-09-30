import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { products } from "../../data/products"; // all 31 products
import "./Products.css";

function Products() {
  const navigate = useNavigate();

  // Cart state: loads from localStorage on mount
  const [cartCount, setCartCount] = useState(
    JSON.parse(localStorage.getItem("cart"))?.length || 0
  );

  // Add product to cart
  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    setCartCount(cart.length);
  };

  // Update cart count if localStorage changes in another tab
  useEffect(() => {
    const handleStorage = () => {
      setCartCount(JSON.parse(localStorage.getItem("cart"))?.length || 0);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-header">
        <h1 className="products-title">Our Products</h1>
        <div
          className="cart-icon"
          onClick={() => navigate("/cart")}
        >
          🛒
          <span className="cart-count">{cartCount}</span>
        </div>
      </div>

      {/* Product grid */}
      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <Link to={`/product/${product._id}`} className="product-link">
              <div className="product-image-container">
                <img
                  src={product.img}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => (e.target.src = "/images/default.jpeg")}
                />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">R{product.price}</p>
              </div>
            </Link>
            <button
              className="add-to-cart"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product);
              }}
            >
              🛒 Add to Cart
            </button>
          </div>
        ))}
      </div>
      
    </div>
  );
}

export default Products;
