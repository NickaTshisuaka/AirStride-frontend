import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./PastPurchases.css";

const OrderSummary = () => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem("latestOrder"));
    if (savedOrder) {
      setOrder(savedOrder);
    }
  }, []);

  if (!order) {
    return (
      <div className="past-purchases-page">
        <h1>No recent order found</h1>
        <p>Please add items to your cart and complete checkout first.</p>
        <Link to="/products" className="back-to-shop-btn">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="order-summary-page">
      <h1>Order Summary</h1>
      <p>
        <strong>Order Date:</strong> {order.date}
      </p>
      <p>
        <strong>Shipping Address:</strong> {order.address}
      </p>
      <p>
        <strong>Delivery Option:</strong> {order.shippingTime}
      </p>

      <h2>Items:</h2>
      <div className="order-items-grid">
        {order.items.map((item, index) => (
          <div key={index} className="order-item-card">
            <img src={item.img} alt={item.name} />
            <div className="order-item-info">
              <h3>{item.name}</h3>
              <p>Qty: {item.quantity || 1}</p>
              <p>Price: R {item.price.toFixed(2)}</p>
              <p>
                Subtotal: R{" "}
                {(item.price * (item.quantity || 1)).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="order-total">
        <strong>Total Paid: R {order.total.toFixed(2)}</strong>
      </h2>

      <Link to="/products" className="back-to-shop-btn">
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSummary;
