import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { products } from "../../data/products";
import "./ProductDetail.css";

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const selected = products.find((p) => p._id.toString() === id.toString());
    setProduct(selected || null);
  }, [id]);

  if (!product) {
    return (
      <div className="product-detail-container">
        <Sidebar />
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <Sidebar />
      <div className="product-detail-content">
        {/* Left: Product Image */}
        <div className="product-detail-left">
          <img
            src={product.img}
            alt={product.name}
            className="product-detail-image"
            onError={(e) => (e.target.src = "/images/default.jpeg")}
          />
        </div>

        {/* Right: Product Info */}
        <div className="product-detail-right">
          <h1 className="product-detail-name">{product.name}</h1>
          <h2 className="product-detail-price">R {product.price}</h2>
          <p className="product-detail-description">{product.description}</p>

          <div className="product-detail-actions">
            <button
              className="add-to-cart-btn"
              onClick={() => addToCart(product)}
            >
              🛒 Add to Cart
            </button>
            <button
              className="back-to-products-btn"
              onClick={() => navigate("/products")}
            >
              ← Back to Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
