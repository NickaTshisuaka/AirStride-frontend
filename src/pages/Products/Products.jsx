import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import TopNav from "../../components/TopNav";
import { useCart } from "../../context/CartContext";
import { apiFetch } from "../../api";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const gridRef = useRef();
  const { cart, setCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiFetch("/api/products");
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate");
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll(".product-card, .products-title");
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [products]);

  const addToCart = (product) => {
    const existingIndex = cart.findIndex((item) => item._id === product._id);
    let updatedCart = [...cart];
    if (existingIndex !== -1) {
      updatedCart[existingIndex].quantity = (updatedCart[existingIndex].quantity || 1) + 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div className="products-page">
      <TopNav />
      <div className="products-container">
        <h1 className="products-title">Our Products</h1>
        {loading && <p className="loading-text">Loading products...</p>}
        {error && <p className="error-text">Error: {error}</p>}
        {!loading && !error && (
          <div className="products-grid" ref={gridRef}>
            {products.map((p) => (
              <div key={p._id} className="product-card animate">
                <img src={p.image || "/placeholder.png"} alt={p.name} className="product-image" />
                <h3 className="product-name">{p.name}</h3>
                <p className="product-price">R {p.price}</p>
                <div className="product-buttons">
                  <button className="btn add-cart-btn" onClick={() => addToCart(p)}>Add to Cart</button>
                  <Link to={`/product/${p._id}`} className="btn view-btn">View Product</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
