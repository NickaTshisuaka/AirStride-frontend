import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart, Eye, Heart, Filter, ArrowDownWideNarrow } from "lucide-react";
import { getAuth, onIdTokenChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Products.css";

const BASE_API_URL = "http://localhost:5000/api/products";

const useAuth = () => {
  const [authHeader, setAuthHeader] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      try {
        if (user) {
          const token = await user.getIdToken(false);
          setAuthHeader(`Bearer ${token}`);
        } else {
          setAuthHeader(null);
        }
      } catch (err) {
        console.error("Failed to get ID token:", err);
      } finally {
        setAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return { authHeader, authLoading };
};

function Products() {
  const { authHeader, authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [toastMsg, setToastMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  // Listen for search input from navbar
  useEffect(() => {
    const handleSearch = (e) => setSearchTerm(e.detail.toLowerCase());
    window.addEventListener("productSearch", handleSearch);
    return () => window.removeEventListener("productSearch", handleSearch);
  }, []);

  // Load from localStorage
  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
    setFavourites(JSON.parse(localStorage.getItem("favourites") || "[]"));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  // Fetch products
  useEffect(() => {
    if (authLoading || !authHeader) return;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(BASE_API_URL, {
          headers: { Authorization: authHeader },
        });
        setProducts(res.data.products || res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [authHeader, authLoading]);

  const addToCart = (product) => {
    if (cart.some((item) => item._id === product._id)) return showToast("Already in cart!");
    setCart([...cart, { ...product, quantity: 1 }]);
    window.dispatchEvent(new Event("cartUpdated"));
    showToast("Added to cart!");
  };

  const addToFavourites = (product) => {
    if (favourites.some((item) => item._id === product._id)) return showToast("Already in favourites!");
    setFavourites([...favourites, product]);
    showToast("Added to favourites!");
  };

  const showToast = (message) => {
    setToastMsg(message);
    setTimeout(() => setToastMsg(""), 2500);
  };

  const goToDetail = (id) => navigate(`/product/${id}`);

  // Filter + Sort
  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm) &&
      (selectedCategory === "all" || p.category === selectedCategory)
    )
    .sort((a, b) => {
      if (sortOrder === "low-high") return a.price - b.price;
      if (sortOrder === "high-low") return b.price - a.price;
      return 0;
    });

  return (
    <div className="products-page">
      {toastMsg && <div className="toast">{toastMsg}</div>}

      <div className="products-header">
        <div className="filters">
          <label>
            <Filter className="icon" /> Category:
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All</option>
              <option value="shoes">Shoes</option>
              <option value="clothing">Clothing</option>
              <option value="accessories">Accessories</option>
            </select>
          </label>

          <label>
            <ArrowDownWideNarrow className="icon" /> Sort:
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="low-high">Price: Low → High</option>
              <option value="high-low">Price: High → Low</option>
            </select>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="skeleton-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="no-results">No products found.</div>
      ) : (
        <section className="products-grid">
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product._id}
              className="product-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="image-wrap" onClick={() => goToDetail(product._id)}>
                <img
                  src={product.image || "https://placehold.co/400x400?text=No+Image"}
                  alt={product.name}
                />
                {product.inventory_count < 1 && (
                  <span className="badge">Out of Stock</span>
                )}

                <div className="overlay">
                  <button
                    className="overlay-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    <ShoppingCart className="icon" /> Add
                  </button>
                  <button
                    className="overlay-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToDetail(product._id);
                    }}
                  >
                    <Eye className="icon" /> View
                  </button>
                  <button
                    className="overlay-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToFavourites(product);
                    }}
                  >
                    <Heart className="icon" /> Fav
                  </button>
                </div>
              </div>

              <div className="info">
                <h3>{product.name}</h3>
                <p className="price">R{product.price.toFixed(2)}</p>
              </div>
            </motion.div>
          ))}
        </section>
      )}
    </div>
  );
}

export default Products;
