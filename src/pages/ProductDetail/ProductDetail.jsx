import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Package, Ruler, Award, Shield } from "lucide-react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useTheme } from "../../contexts/ThemeContext";
import "./ProductDetail.css";

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext); // use theme from context
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authHeader, setAuthHeader] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) user.getIdToken().then(token => setAuthHeader(`Bearer ${token}`));
  }, []);

  useEffect(() => {
    if (!authHeader) return;
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://54.205.166.75:5000/api/products/${id}`, {
          headers: { Authorization: authHeader }
        });
        setProduct(res.data.product || res.data);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, authHeader]);

  useEffect(() => {
    if (!product?.category || !authHeader) return;
    const fetchSimilar = async () => {
      try {
        const res = await axios.get("http://54.205.166.75:5000/api/products", {
          headers: { Authorization: authHeader }
        });
        const data = res.data.products || res.data;
        setSimilarProducts(
          data.filter(p => p.category === product.category && p._id !== product._id).slice(0, 3)
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchSimilar();
  }, [product, authHeader]);

  const mockReviews = [
    { name: "Thandi M.", rating: 5, comment: "Absolutely love this product! It helped me boost my performance.", date: "2025-09-21" },
    { name: "Michael D.", rating: 4, comment: "Great quality and very comfortable. The design feels premium.", date: "2025-09-25" },
    { name: "Zanele P.", rating: 5, comment: "Incredible support and breathable material. Worth every cent!", date: "2025-10-02" },
  ];

  if (loading) return <div className={`loading-screen ${theme}`}>Loading product details...</div>;
  if (!product) return (
    <div className={`not-found-screen ${theme}`}>
      <p>⚠️ Product not found</p>
      <button onClick={() => navigate("/products")} className="back-btn">Back to Products</button>
    </div>
  );

  return (
    <div className={`product-page ${theme}`}>
      {/* Back Button */}
      <button onClick={() => navigate("/products")} className="back-btn">
        <ArrowLeft className="icon" /> Back to Products
      </button>

      {/* Product Hero */}
      <div className="product-hero product-hero-enter product-hero-enter-active">
        <div className="product-grid">
          <div className="product-image-container">
            <img src={product.image || "https://placehold.co/600x600/e0e0e0/666?text=No+Image"} alt={product.name} className="product-image" />
            {product.inventory_count < 1 && <div className="out-of-stock-badge">Out of Stock</div>}
          </div>

          <div className="product-info">
            <span className="product-category">{product.category || "General"}</span>
            <h1 className="product-name">{product.name}</h1>
            <p className="product-price">R {product.price.toFixed(2)}</p>
            <p className="product-description">{product.description || "Premium quality product designed for your needs."}</p>

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
                  <p className={`detail-value ${product.inventory_count > 10 ? 'in-stock' : 'low-stock'}`}>{product.inventory_count} units</p>
                </div>
              </div>
              <div className="product-detail-card">
                <Shield className="detail-icon" />
                <div>
                  <p className="detail-title">Material</p>
                  <p className="detail-value">{product.material || "High-Performance Polymer"}</p>
                </div>
              </div>
              <div className="product-detail-card">
                <Ruler className="detail-icon" />
                <div>
                  <p className="detail-title">Sizes</p>
                  <p className="detail-value">{product.available_sizes?.join(", ") || "One Size"}</p>
                </div>
              </div>
            </div>

            {product.tags?.length > 0 && (
              <div className="product-tags">
                {product.tags.map((tag, i) => <span key={i} className="tag">#{tag}</span>)}
              </div>
            )}

            <button
              className={`add-to-cart-btn ${product.inventory_count > 0 ? 'available' : 'sold-out'}`}
              onClick={() => addToCart(product)}
              disabled={product.inventory_count < 1}
            >
              <ShoppingCart className="cart-icon" /> {product.inventory_count > 0 ? 'Add to Cart' : 'Sold Out'}
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="reviews-section">
        <h3>Customer Reviews ({mockReviews.length})</h3>
        <div className="reviews-grid">
          {mockReviews.map((review, i) => (
            <div className="review-card" key={i}>
              <div className="review-header">
                <h4>{review.name}</h4>
                <span>{review.date}</span>
              </div>
              <div className="review-stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
              <p className="review-comment">"{review.comment}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="similar-products-section">
          <h3>You May Also Like</h3>
          <div className="similar-products-grid">
            {similarProducts.map(sp => (
              <div className="similar-product-card" key={sp._id} onClick={() => navigate(`/product/${sp._id}`)}>
                <img src={sp.image || "https://placehold.co/400x300/e0e0e0/666?text=No+Image"} alt={sp.name} className="similar-product-image" />
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
