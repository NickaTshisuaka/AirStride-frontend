import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TopNav from "../../components/TopNav";
import { useCart } from "../../context/CartContext";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 });
    // Optionally: show toast/animation
  };

  if (!product) {
    return (
      <>
        <TopNav />
        <div className="loading">Loading product...</div>
      </>
    );
  }

  return (
    <>
      <TopNav />
      <div className="product-detail-container">
        <div className="product-detail-card">
          <img
            src={product.image || "/placeholder.png"}
            alt={product.name}
            className="product-detail-image"
          />
          <div className="product-detail-info">
            <h1>{product.name}</h1>
            <p className="product-detail-price">R {product.Price}</p>
            <p className="product-detail-description">
              {product.description || "No description available."}
            </p>

            <button className="btn add-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
