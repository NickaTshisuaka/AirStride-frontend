// Checkout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCalendarAlt,
  FaLock,
  FaPhone,
  FaGift,
  FaClock,
} from "react-icons/fa";
import "./Checkout.css";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    promoCode: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    deliveryTime: "Morning (8am - 12pm)",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    for (let key in formData) {
      if (!formData[key]) {
        alert("Please fill in all fields.");
        return;
      }
    }

    const order = {
      items: cart,
      total: totalPrice,
      address: formData.address,
      deliveryTime: formData.deliveryTime,
      date: new Date().toLocaleString(),
      shippingTime: "3-5 business days",
    };

    localStorage.setItem("latestOrder", JSON.stringify(order));
    setOrderTotal(totalPrice);

    // Show popup before redirect
    setShowPopup(true);

    // Clear cart
    localStorage.removeItem("cart");
    setCart([]);
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate("/order-summary"); // ✅ Go to Order Summary, not home
  };

  if (cart.length === 0 && !showPopup) {
    return <p className="empty-cart">Your cart is empty</p>;
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <h2>Shipping & Payment Details</h2>

        <div className="form-group">
          <FaUser className="icon" />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <FaEnvelope className="icon" />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <FaPhone className="icon" />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <FaMapMarkerAlt className="icon" />
          <textarea
            name="address"
            placeholder="Shipping Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        {/* Delivery Time Dropdown */}
        <div className="form-group">
          <FaClock className="icon" />
          <select
            name="deliveryTime"
            value={formData.deliveryTime}
            onChange={handleChange}
            required
          >
            <option>Morning (8am - 12pm)</option>
            <option>Afternoon (12pm - 4pm)</option>
            <option>Evening (4pm - 8pm)</option>
          </select>
        </div>

        <div className="form-group">
          <FaGift className="icon" />
          <input
            type="text"
            name="promoCode"
            placeholder="Promo Code (Optional)"
            value={formData.promoCode}
            onChange={handleChange}
          />
        </div>

        <h3>Payment Details</h3>
        <div className="form-group">
          <FaCreditCard className="icon" />
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={formData.cardNumber}
            onChange={handleChange}
            required
            maxLength={16}
          />
        </div>

        <div className="form-row">
          <div className="form-group small">
            <FaCalendarAlt className="icon" />
            <input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              value={formData.expiry}
              onChange={handleChange}
              required
              maxLength={5}
            />
          </div>
          <div className="form-group small">
            <FaLock className="icon" />
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              value={formData.cvv}
              onChange={handleChange}
              required
              maxLength={3}
            />
          </div>
        </div>

        <button type="submit" className="confirm-btn">
          Confirm Checkout
        </button>
      </form>

      {/* Popup */}
      {showPopup && (
        <div className="checkout-popup-overlay">
          <div className="checkout-popup">
            <h2>Thank You!</h2>
            <p>Your order has been placed successfully.</p>
            <p>
              <strong>Total Paid:</strong> R {orderTotal.toFixed(2)}
            </p>
            <button className="close-popup-btn" onClick={closePopup}>
              View Order Summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
