import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { getAuth, onIdTokenChanged } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import './Products.css';

const BASE_API_URL = "http://54.205.166.75:5000/api/products";
// const BASE_API_URL = "http://localhost:5000/api/products";


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
  const navigate = useNavigate();

  // Load cart and favourites from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const savedFavs = JSON.parse(localStorage.getItem("favourites") || "[]");
    setCart(savedCart);
    setFavourites(savedFavs);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  // Fetch products after auth is ready
  useEffect(() => {
    if (authLoading || !authHeader) return;

    const fetchProducts = async () => {
      try {
        const res = await axios.get(BASE_API_URL, {
          headers: { Authorization: authHeader },
        });
        setProducts(res.data.products || res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [authHeader, authLoading]);

  const addToCart = (product) => {
    if (cart.some((item) => item._id === product._id)) {
      showToast("Already in cart!");
      return;
    }

    const newCart = [...cart, { ...product, quantity: 1 }];
    setCart(newCart);
    window.dispatchEvent(new Event("cartUpdated"));
    showToast("Added to cart!");
  };

  const addToFavourites = (product) => {
    if (favourites.some((item) => item._id === product._id)) {
      showToast("Already in favourites!");
      return;
    }

    const newFavs = [...favourites, product];
    setFavourites(newFavs);
    showToast("Added to favourites!");
  };

  const showToast = (message) => {
    setToastMsg(message);
    setTimeout(() => setToastMsg(""), 2500);
  };

  const goToDetail = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="products-page">
      {/* Toast */}
      {toastMsg && <div className="toast">{toastMsg}</div>}

      {/* Product Grid */}
      <section className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <div className="image-wrap" onClick={() => goToDetail(product._id)}>
              <img
                src={product.image || "https://placehold.co/400x400?text=No+Image"}
                alt={product.name}
              />
              {product.inventory_count < 1 && (
                <span className="badge">Out of Stock</span>
              )}
            </div>

            <div className="info">
              <h3>{product.name}</h3>
              <p className="price">R{product.price.toFixed(2)}</p>

              <div className="buttons">
                <button
                  className={`add-btn ${product.inventory_count < 1 ? 'disabled' : ''}`}
                  disabled={product.inventory_count < 1}
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart className="icon" /> Add to Cart
                </button>

                <Link to={`/product/${product._id}`} className="view-btn">
                  <Eye className="icon" /> View
                </Link>

                <button className="fav-btn" onClick={() => addToFavourites(product)}>
                  <Heart className="icon" /> Favourite
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Products;
