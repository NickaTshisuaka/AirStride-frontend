// src/pages/PastPurchases/PastPurchases.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./PastPurchases.css";

const PastPurchases = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
      // Ensure each order has a valid items array
      const cleanedOrders = savedOrders.map(order => ({
        ...order,
        items: Array.isArray(order.items) ? order.items : [],
        address: order.address || {}
      }));
      setOrders(cleanedOrders);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setOrders([]);
    }
  }, []);

  if (!orders || orders.length === 0) {
    return (
      <div className="past-purchases-page">
        <h1>No past orders found</h1>
        <p>Please add items to your cart and complete checkout first.</p>
        <Link to="/products" className="back-to-shop-btn">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="order-summary-page">
      <h1>Past Purchases</h1>

      {orders.map((order, idx) => (
        <div key={idx} className="single-order">
          <p>
            <strong>Order Date:</strong> {order.date}
          </p>
          <p>
            <strong>Shipping Address:</strong>
            <br />
            {order.address.address || ""}
            <br />
            {order.address.suburb || ""}, {order.address.city || ""}
            <br />
            {order.address.province || ""} {order.address.postalCode || ""}
          </p>

          {order.shippingTime && (
            <p>
              <strong>Delivery Option:</strong> {order.shippingTime}
            </p>
          )}

          <h2>Items:</h2>
          {order.items.length > 0 ? (
            <div className="order-items-grid">
              {order.items.map((item, index) => (
                <div key={index} className="order-item-card">
                  {item.img && <img src={item.img} alt={item.name} />}
                  <div className="order-item-info">
                    <h3>{item.name}</h3>
                    <p>Qty: {item.quantity || 1}</p>
                    <p>Price: R {item.price?.toFixed(2) || "0.00"}</p>
                    <p>
                      Subtotal: R {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No items found for this order.</p>
          )}

          <h2 className="order-total">
            <strong>Total Paid: R {order.total?.toFixed(2) || "0.00"}</strong>
          </h2>

          <hr style={{ margin: "2rem 0", borderColor: "#ff6b35" }} />
        </div>
      ))}

      <Link to="/products" className="back-to-shop-btn">
        Continue Shopping
      </Link>
    </div>
  );
};

export default PastPurchases;
