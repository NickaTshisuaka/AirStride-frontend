// src/pages/Products/Products.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart, Heart } from "lucide-react";
import { useCartContext } from "../../contexts/CartContext";
import { useFavoritesContext } from "../../contexts/FavoritesContext";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import "./Products.css";

const BASE_API_URL = import.meta.env.VITE_API_URL;

// How long cache should live (milliseconds) — e.g. 2 hours
const CACHE_LIFETIME = 1000 * 60 * 60 * 2;

const Products = () => {
  const { cart, addToCart } = useCartContext();
  const { favorites, addFavorite, removeFavorite } = useFavoritesContext();
  const { idToken, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  /** -------------------------------------
   * NORMALIZE PRODUCT SHAPE
   ---------------------------------------- */
  const normalizeProduct = (p) => ({
    ...p,
    _id: p._id,
    product_id: p._id,
    imageUrl: p.imageUrl || p.image || "https://placehold.co/600x600",
    price: Number(p.price || 0),
    inventory_count: p.inventory_count ?? 0,
  });

  /** -------------------------------------
   * LOCAL STORAGE CACHING
   ---------------------------------------- */
  const loadFromCache = () => {
    try {
      const cached = JSON.parse(localStorage.getItem("products_cache"));
      if (!cached) return null;

      const expired = Date.now() - cached.timestamp > CACHE_LIFETIME;
      if (expired) {
        localStorage.removeItem("products_cache");
        return null;
      }

      return cached.products;
    } catch (e) {
      return null;
    }
  };

  const saveToCache = (products) => {
    localStorage.setItem(
      "products_cache",
      JSON.stringify({
        timestamp: Date.now(),
        products,
      })
    );
  };

  /** -------------------------------------
   * FETCH PRODUCTS (with caching)
   ---------------------------------------- */
  useEffect(() => {
    if (authLoading) return;

    // 1️⃣ — Try to load cached products immediately
    const cachedProducts = loadFromCache();
    if (cachedProducts) {
      setProducts(cachedProducts);
      setFilteredProducts(cachedProducts);
      setLoading(false); // show cached instantly
    }

    // 2️⃣ — Always refresh from API in background
    const fetchProducts = async () => {
      try {
        const headers = idToken ? { Authorization: `Bearer ${idToken}` } : {};
        const res = await axios.get(`${BASE_API_URL}/products`, { headers });

        const prods = Array.isArray(res.data)
          ? res.data
          : res.data.products || res.data.data || [];

        const normalized = prods.map(normalizeProduct);

        setProducts(normalized);
        setFilteredProducts(normalized);

        // Save to localStorage
        saveToCache(normalized);
      } catch (err) {
        console.error("Product fetch error:", err);

        // If there was cached data, do NOT show error
        if (!cachedProducts) {
          setProducts([]);
          setFilteredProducts([]);
        }
      } finally {
        // If no cache was loaded, this sets loading false
        setLoading(false);
      }
    };

    fetchProducts();
  }, [idToken, authLoading]);

  /** -------------------------------------
   * SEARCH FILTERING
   ---------------------------------------- */
  const normalizeString = (str) =>
    str?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") ||
    "";

  useEffect(() => {
    const term = normalizeString(searchTerm);
    if (!term) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((p) => {
      const name = normalizeString(p.name);
      const category = normalizeString(p.category);
      return name.includes(term) || category.includes(term);
    });

    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  /** -------------------------------------
   * HIGHLIGHT MATCHES
   ---------------------------------------- */
  const highlightMatch = (text) => {
    const term = normalizeString(searchTerm);
    if (!term) return text;
    return text.replace(new RegExp(`(${term})`, "gi"), "<mark>$1</mark>");
  };

  /** -------------------------------------
   * INTERACTIONS
   ---------------------------------------- */
  const isInCart = (id) => cart.some((item) => item.product_id === id);
  const isFavorite = (id) => favorites.some((item) => item.product_id === id);

  const handleAddToCart = (product) => {
    if (!isInCart(product.product_id)) {
      addToCart(product);
      setToastMessage(`${product.name} added to cart 🛒`);
    } else {
      setToastMessage(`${product.name} is already in your cart`);
    }
  };

  const handleToggleFavorite = (product) => {
    if (isFavorite(product.product_id)) {
      removeFavorite(product.product_id);
      setToastMessage(`${product.name} removed from favorites ❤️`);
    } else {
      addFavorite(product);
      setToastMessage(`${product.name} added to favorites ❤️`);
    }
  };
  // Listen for navbar search input
useEffect(() => {
  const handleSearch = (e) => {
    setSearchTerm(e.detail); // Update Products page search
  };

  window.addEventListener("productSearch", handleSearch);
  return () => window.removeEventListener("productSearch", handleSearch);
}, []);


  /** -------------------------------------
   * RENDER
   ---------------------------------------- */
  return (
    <div className="products-page">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <section className="products-grid">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="product-card shimmer">
                <div className="product-img-placeholder"></div>
                <div className="info-placeholder">
                  <div className="line short"></div>
                  <div className="line medium"></div>
                  <div className="line long"></div>
                </div>
              </div>
            ))
          : filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="product-img"
                />

                <div className="info">
                  <h3
                    dangerouslySetInnerHTML={{
                      __html: highlightMatch(product.name),
                    }}
                  />

                  <p>R{product.price.toFixed(2)}</p>

                  {product.inventory_count < 1 && (
                    <p className="out-of-stock">Out of Stock</p>
                  )}

                  <div className="buttons">
                    {/* CART */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.inventory_count < 1 || isInCart(product.product_id)}
                    >
                      <ShoppingCart />{" "}
                      {isInCart(product.product_id) ? "In Cart" : "Add to Cart"}
                    </button>

                    {/* FAVORITES */}
                    <button onClick={() => handleToggleFavorite(product)}>
                      <Heart
                        fill={isFavorite(product.product_id) ? "currentColor" : "none"}
                      />
                      {isFavorite(product.product_id) ? "Unfav" : "Fav"}
                    </button>

                    {/* DETAIL PAGE */}
                    <button onClick={() => navigate(`/product/${product.product_id}`)}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </section>

      {toastMessage && <div className="toast">{toastMessage}</div>}
    </div>
  );
};

export default Products;
