// src/pages/Products/Products.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart, Heart } from "lucide-react";
import { useCartContext } from "../../contexts/CartContext";
import { useFavoritesContext } from "../../contexts/FavoritesContext";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import "./Products.css";

// Use environment variable for API URL
const BASE_API_URL = import.meta.env.VITE_API_URL; // e.g., http://3.210.9.239:5000/api

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

  // Normalize strings for search
  const normalize = (str) =>
    str?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";

  // Fetch products from API
  useEffect(() => {
    if (authLoading) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const headers = idToken ? { Authorization: `Bearer ${idToken}` } : {};
const res = await axios.get(`${BASE_API_URL}/products`, { headers });
        const prods = res.data.products || [];

        // Map products for frontend use
        const mappedProds = prods.map((p) => ({
          ...p,
          product_id: p._id,
          inventory_count: p.stock ?? 0,
        }));

        setProducts(mappedProds);
        setFilteredProducts(mappedProds);
      } catch (err) {
        console.error("Product fetch error:", err);

        // Fallback: show 8 placeholder cards if network/API fails
        const placeholders = Array.from({ length: 8 }, (_, i) => ({
          product_id: `placeholder-${i}`,
        }));
        setProducts(placeholders);
        setFilteredProducts(placeholders);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [idToken, authLoading]);

  // Filter products as user types
  useEffect(() => {
    const term = normalize(searchTerm);
    if (!term) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((p) => {
      const name = normalize(p.name);
      const category = normalize(p.category);
      return name.includes(term) || category.includes(term);
    });
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Highlight search matches
  const highlightMatch = (text) => {
    const term = normalize(searchTerm);
    if (!term) return text;
    const regex = new RegExp(`(${term})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

  // Cart & favorites helpers
  const isInCart = (id) => cart.some((item) => item.product_id === id);
  const isFavorite = (id) => favorites.some((item) => item.product_id === id);

  // Handle add to cart
  const handleAddToCart = (product) => {
    if (!isInCart(product.product_id)) {
      addToCart(product);
      setToastMessage(`${product.name || "Item"} added to cart 🛒`);
    } else {
      setToastMessage(`${product.name || "Item"} is already in your cart`);
    }
  };

  // Handle favorites toggle
  const handleToggleFavorite = (product) => {
    if (isFavorite(product.product_id)) {
      removeFavorite(product.product_id);
      setToastMessage(`${product.name || "Item"} removed from favorites ❤️`);
    } else {
      addFavorite(product);
      setToastMessage(`${product.name || "Item"} added to favorites ❤️`);
    }
  };

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
                <div className="product-img-placeholder" />
                <div className="info-placeholder">
                  <div className="line short"></div>
                  <div className="line medium"></div>
                  <div className="line long"></div>
                </div>
              </div>
            ))
          : filteredProducts.map((product) => (
              <div key={product.product_id} className="product-card">
                <img
                  src={product.image || ""}
                  alt={product.name || "Product"}
                  className={`product-img ${!product.image ? "no-image" : ""}`}
                />
                <div className="info">
                  <h3
                    dangerouslySetInnerHTML={{
                      __html: highlightMatch(product.name || "No Name"),
                    }}
                  />
                  <p>{product.price ? `R${Number(product.price).toFixed(2)}` : "Price N/A"}</p>
                  {product.inventory_count < 1 && <p className="out-of-stock">Out of Stock</p>}
                  <div className="buttons">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.inventory_count < 1 || isInCart(product.product_id)}
                    >
                      <ShoppingCart /> {isInCart(product.product_id) ? "In Cart" : "Add to Cart"}
                    </button>
                    <button onClick={() => handleToggleFavorite(product)}>
                      <Heart fill={isFavorite(product.product_id) ? "currentColor" : "none"} />
                      {isFavorite(product.product_id) ? "Unfav" : "Fav"}
                    </button>
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
