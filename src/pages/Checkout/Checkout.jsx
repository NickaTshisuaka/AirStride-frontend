// Checkout.jsx (Minimal changes here, mainly structure and adding Province)
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

// Helper function to format currency as ZAR
const formatZAR = (amount) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Mock data (Assume this comes from your product page state)
const initialCartItems = [
  { id: 2, name: "AirStride Jogging Shoes", price: 2500.00, quantity: 1 },
  { id: 5, name: "Smart Hydration Bottle", price: 750.00, quantity: 2 },
  { id: 1, name: "Breathing Trainer Pro", price: 1200.00, quantity: 1 },
];

const SHIPPING_COST = 85.00; 
const VAT_RATE = 0.15; // 15% VAT for South Africa

const provinces = [
    "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", 
    "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape"
];

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    province: "", // NEW FIELD
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
    // Mock cart data if localStorage is empty for testing, or use real data
    const storedCart = JSON.parse(localStorage.getItem("cart")) || initialCartItems;
    setCart(storedCart);
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  
  const vat = subtotal * VAT_RATE;
  const totalPrice = subtotal + SHIPPING_COST + vat;


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    for (let key in formData) {
        // Skip promoCode for simplified validation
        if (key !== 'promoCode' && !formData[key]) {
            alert("Please fill in all required fields.");
            return;
        }
    }

    const order = {
      items: cart,
      total: totalPrice,
      address: formData.address,
      province: formData.province,
      deliveryTime: formData.deliveryTime,
      date: new Date().toLocaleString(),
      shippingTime: "3-5 business days",
    };

    localStorage.setItem("latestOrder", JSON.stringify(order));
    setOrderTotal(totalPrice); 

    // Show popup before redirect
    setShowPopup(true);

    // Clear cart (or use API calls here)
    // localStorage.removeItem("cart"); 
    // setCart([]);
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate("/order-summary"); 
  };

  if (cart.length === 0 && !showPopup) {
    return (
        <div className="checkout-page-empty">
            <h1 className="empty-cart-title">Your Cart is Empty!</h1>
            <button className="btn back-to-shop-btn" onClick={() => navigate('/products')}>
                ← Back to Products
            </button>
        </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Secure Checkout</h1>

      <div className="checkout-grid">
        {/* FORM SECTION */}
        <form id="checkout-form" className="checkout-form" onSubmit={handleSubmit}>
          
          <div className="form-section-group">
            <h2>1. Shipping Details</h2>
            
            <div className="form-group">
              <FaUser className="icon" />
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <FaEnvelope className="icon" />
              <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <FaPhone className="icon" />
              <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <FaMapMarkerAlt className="icon" />
              <textarea name="address" placeholder="Street Address & Suburb (e.g. 15 Main Rd, Sea Point)" value={formData.address} onChange={handleChange} required />
            </div>
            
            {/* NEW PROVINCE/STATE FIELD */}
            <div className="form-group">
              <FaMapMarkerAlt className="icon" />
              <select name="province" value={formData.province} onChange={handleChange} required>
                <option value="" disabled>Select Province</option>
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            
            <div className="form-group">
              <FaClock className="icon" />
              <select name="deliveryTime" value={formData.deliveryTime} onChange={handleChange} required >
                <option value="Morning (8am - 12pm)">Morning (8am - 12pm)</option>
                <option value="Afternoon (12pm - 4pm)">Afternoon (12pm - 4pm)</option>
                <option value="Evening (4pm - 8pm)">Evening (4pm - 8pm)</option>
              </select>
            </div>
          </div>
          
          <div className="form-section-group">
            <h2>2. Payment & Promo</h2>
            
            {/* SECURITY MESSAGE */}
            <p className="security-info"><FaLock className="security-icon" /> All payments are processed securely via SSL. We do not store card details.</p>

            <div className="form-group">
              <FaCreditCard className="icon" />
              <input type="text" name="cardNumber" placeholder="Credit/Debit Card Number (16 Digits)" value={formData.cardNumber} onChange={handleChange} required maxLength={16} />
            </div>

            <div className="form-row">
              <div className="form-group small">
                <FaCalendarAlt className="icon" />
                <input type="text" name="expiry" placeholder="Expiry Date (MM/YY)" value={formData.expiry} onChange={handleChange} required maxLength={5} />
              </div>
              <div className="form-group small">
                <FaLock className="icon" />
                <input type="text" name="cvv" placeholder="CVV" value={formData.cvv} onChange={handleChange} required maxLength={3} />
              </div>
            </div>
            
            <div className="form-group">
              <FaGift className="icon" />
              <input type="text" name="promoCode" placeholder="Promo Code (Optional)" value={formData.promoCode} onChange={handleChange} />
            </div>
          </div>

        </form>
        
        {/* ORDER SUMMARY SECTION (Mostly unchanged) */}
        <div className="order-summary-box">
            <h2>Order Summary</h2>
            
            <ul className="cart-item-list">
                {cart.map(item => (
                    <li key={item.id} className="summary-item">
                        <span className="item-name">{item.name} ({item.quantity || 1}x)</span>
                        <span className="item-total">{formatZAR(item.price * (item.quantity || 1))}</span>
                    </li>
                ))}
            </ul>

            <div className="summary-details">
                <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatZAR(subtotal)}</span>
                </div>
                <div className="summary-row">
                    <span>Shipping Fee</span>
                    <span>{formatZAR(SHIPPING_COST)}</span>
                </div>
                <div className="summary-row vat-row">
                    <span>VAT ({VAT_RATE * 100}%)</span>
                    <span>{formatZAR(vat)}</span>
                </div>
                
                <div className="summary-row final-total">
                    <strong>Total Due</strong>
                    <strong>{formatZAR(totalPrice)}</strong>
                </div>
            </div>
            
            <button type="submit" form="checkout-form" className="confirm-btn">
                Pay Now: {formatZAR(totalPrice)}
            </button>
            <p className="secure-message-small">
                <FaLock /> Secured by AirStride Payment Gateway
            </p>
        </div>
      </div>

      {/* Popup (Unchanged) */}
      {showPopup && (
        <div className="checkout-popup-overlay">
          <div className="checkout-popup">
            <h2>Order Confirmed! 🎉</h2>
            <p>Your order has been placed successfully.</p>
            <p>
              <strong>Total Paid:</strong> {formatZAR(orderTotal)}
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