import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ArrowLeft,
  Package,
  Ruler,
  Award,
  Shield,
} from "lucide-react";
import axios from "axios";
import { useCartContext } from "../../contexts/CartContext";
import { useAuth } from "../../AuthContext";
import { API_ENDPOINTS } from "../../config/api.js"; 
// import { API_ENDPOINTS } from "../../../../config/
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const { cart, addToCart } = useCartContext();
  const { idToken, loading: authLoading } = useAuth();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ Track errors

  // Convert backend product into consistent shape
  const normalizeProduct = (p) => ({
    ...p,
    _id: p._id || p.product_id,
    product_id: p.product_id || p._id,
    imageUrl: p.imageUrl || p.image || "https://placehold.co/600x600",
    price: Number(p.price || 0),
    inventory_count: p.inventory_count ?? 0,
  });

  // Fetch the product
  useEffect(() => {
    if (authLoading) return;
    
    // ✅ Allow fetching without token for testing
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const headers = {};
        if (idToken) {
          headers.Authorization = `Bearer ${idToken}`;
        }

        console.log('Fetching product:', `${API_ENDPOINTS.products}/${id}`); // ✅ Debug log

        const res = await axios.get(`${API_ENDPOINTS.products}/${id}`, {
          headers,
          timeout: 10000, // ✅ 10 second timeout
        });

        const data = res.data.product || res.data;
        setProduct(normalizeProduct(data));
      } catch (err) {
        console.error("Product fetch error:", err);
        setError(err.response?.data?.error || err.message || "Failed to load product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, idToken, authLoading]);

  // Fetch similar products
  useEffect(() => {
    if (!product?.category || authLoading) return;

    const fetchSimilar = async () => {
      try {
        const headers = {};
        if (idToken) {
          headers.Authorization = `Bearer ${idToken}`;
        }

        const res = await axios.get(API_ENDPOINTS.products, { headers });
        const data = res.data.products || res.data;
        const normalized = data.map(normalizeProduct);

        setSimilarProducts(
          normalized
            .filter(
              (p) =>
                p.category === product.category && 
                p.product_id !== product.product_id
            )
            .slice(0, 3)
        );
      } catch (err) {
        console.error("Similar products fetch error:", err);
      }
    };

    fetchSimilar();
  }, [product, idToken, authLoading]);

  // Fake reviews
  const mockReviews = [
    {
      name: "Thandi M.",
      rating: 5,
      comment: "Absolutely love this product! It helped me boost my performance.",
      date: "2025-09-21",
    },
    {
      name: "Michael D.",
      rating: 4,
      comment: "Great quality and very comfortable. The design feels premium.",
      date: "2025-09-25",
    },
    {
      name: "Zanele P.",
      rating: 5,
      comment: "Incredible support and breathable material. Worth every cent!",
      date: "2025-10-02",
    },
  ];

  if (loading) {
    return <div className="loading-screen">Loading product details...</div>;
  }

  if (error) {
    return (
      <div className="error-screen">
        <p>⚠️ Error: {error}</p>
        <button onClick={() => navigate("/products")} className="back-btn">
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found-screen">
        <p>⚠️ Product not found</p>
        <button onClick={() => navigate("/products")} className="back-btn">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-page">
      <button onClick={() => navigate("/products")} className="back-btn">
        <ArrowLeft className="icon" /> Back to Products
      </button>

      <div className="product-hero">
        <div className="product-grid">
          {/* IMAGE */}
          <div className="product-image-container">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-image"
            />
            {product.inventory_count < 1 && (
              <div className="out-of-stock-badge">Out of Stock</div>
            )}
          </div>

          {/* MAIN INFO */}
          <div className="product-info">
            <span className="product-category">
              {product.category || "General"}
            </span>

            <h1 className="product-name">{product.name}</h1>

            <p className="product-price">R {product.price.toFixed(2)}</p>

            <p className="product-description">
              {product.description ||
                "Premium quality product designed for your needs."}
            </p>

            {/* DETAILS GRID */}
            <div className="product-details-grid">
              <div className="product-detail-card">
                <Award className="detail-icon" />
                <div>
                  <p className="detail-title">Brand</p>
                  <p className="detail-value">{product.brand || "AirStride"}</p>
                </div>
              </div>

              <div className="product-detail-card">
                <Package className="detail-icon" />
                <div>
                  <p className="detail-title">Stock</p>
                  <p
                    className={`detail-value ${
                      product.inventory_count > 10 ? "in-stock" : "low-stock"
                    }`}
                  >
                    {product.inventory_count} units
                  </p>
                </div>
              </div>

              <div className="product-detail-card">
                <Shield className="detail-icon" />
                <div>
                  <p className="detail-title">Material</p>
                  <p className="detail-value">
                    {product.material || "High-Performance Polymer"}
                  </p>
                </div>
              </div>

              <div className="product-detail-card">
                <Ruler className="detail-icon" />
                <div>
                  <p className="detail-title">Sizes</p>
                  <p className="detail-value">
                    {product.available_sizes?.join(", ") || "One Size"}
                  </p>
                </div>
              </div>
            </div>

            {/* TAGS */}
            {product.tags?.length > 0 && (
              <div className="product-tags">
                {product.tags.map((tag, i) => (
                  <span key={i} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* ADD TO CART */}
            <button
              className={`add-to-cart-btn ${
                product.inventory_count > 0 ? "available" : "sold-out"
              }`}
              onClick={() => addToCart(product)}
              disabled={
                product.inventory_count < 1 ||
                cart.some((p) => p.product_id === product.product_id)
              }
            >
              <ShoppingCart className="cart-icon" />
              {product.inventory_count > 0 ? "Add to Cart" : "Sold Out"}
            </button>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="reviews-section">
        <h3>Customer Reviews ({mockReviews.length})</h3>
        <div className="reviews-grid">
          {mockReviews.map((review, i) => (
            <div className="review-card" key={i}>
              <div className="review-header">
                <h4>{review.name}</h4>
                <span>{review.date}</span>
              </div>

              <div className="review-stars">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>

              <p className="review-comment">"{review.comment}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* SIMILAR PRODUCTS */}
      {similarProducts.length > 0 && (
        <div className="similar-products-section">
          <h3>You May Also Like</h3>

          <div className="similar-products-grid">
            {similarProducts.map((sp) => (
              <div
                key={sp.product_id}
                className="similar-product-card"
                onClick={() => navigate(`/product/${sp.product_id}`)}
              >
                <img
                  src={sp.imageUrl}
                  alt={sp.name}
                  className="similar-product-image"
                />
                <div className="similar-product-info">
                  <h4>{sp.name}</h4>
                  <p>{sp.category}</p>
                  <p>R {sp.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;