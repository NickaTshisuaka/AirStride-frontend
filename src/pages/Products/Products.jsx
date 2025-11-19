import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart, Heart } from "lucide-react";
import { useCartContext } from "../../contexts/CartContext";
import { useFavoritesContext } from "../../contexts/FavoritesContext";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import "./Products.css";

// const BASE_API_URL = "http://localhost:5000/api/products";
const BASE_API_URL = "http://3.210.9.239:5000/api/products";


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

  const normalize = (str) =>
    str?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";

  useEffect(() => {
    if (authLoading) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const headers = {};
        if (idToken) headers.Authorization = `Bearer ${idToken}`;

        const res = await axios.get(BASE_API_URL, { headers });
        const prods = res.data.products || [];
        setProducts(prods);
        setFilteredProducts(prods);
        console.log("Fetched products:", prods);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [idToken, authLoading]);

  // === LIVE SEARCH FILTER WITH LOGS & HIGHLIGHT ===
  useEffect(() => {
    const term = normalize(searchTerm);
    console.log("Search term changed:", term);

    if (!term) {
      setFilteredProducts(products);
      console.log("No search term, showing all products");
      return;
    }

    const filtered = products.filter((p) => {
      const name = normalize(p.name);
      const category = normalize(p.category);
      return name.includes(term) || category.includes(term);
    });

    console.log("Filtered products:", filtered);
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const highlightMatch = (text) => {
    const term = normalize(searchTerm);
    if (!term) return text;
    const regex = new RegExp(`(${term})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

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

  return (
    <div className="products-page">
      {/* Search */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p>No products found 😢</p>
      ) : (
        <section className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.product_id} className="product-card">
              <img
                src={product.image || "https://placehold.co/400x400?text=No+Image"}
                alt={product.name}
                className="product-img"
              />
              <div className="info">
                <h3
                  dangerouslySetInnerHTML={{ __html: highlightMatch(product.name) }}
                />
                <p>R{Number(product.price).toFixed(2)}</p>
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
      )}

      {toastMessage && <div className="toast">{toastMessage}</div>}
    </div>
  );
};

export default Products;
