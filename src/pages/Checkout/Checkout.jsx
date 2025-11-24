import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { toast, ToastContainer } from "react-toastify";
import emailjs from "@emailjs/browser";
import {
  FaUser, FaEnvelope, FaMapMarkerAlt, FaPhone,
  FaCreditCard, FaCalendarAlt, FaLock, FaCopy
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./Checkout.css";

const SHIPPING_COST = 85;
const VAT_RATE = 0.15;

const provinces = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape"
];

const formatZAR = (amount) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(amount);

// Expiry utility functions
const EXPIRY_TIME = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

const saveWithExpiry = (key, value) => {
  const record = {
    value,
    timestamp: new Date().getTime()
  };
  localStorage.setItem(key, JSON.stringify(record));
};

const loadWithExpiry = (key) => {
  const record = localStorage.getItem(key);
  if (!record) return null;

  try {
    const parsed = JSON.parse(record);
    if (!parsed.timestamp) return parsed.value; // fallback if no timestamp

    const now = new Date().getTime();
    if (now - parsed.timestamp > EXPIRY_TIME) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.value;
  } catch {
    return null;
  }
};

const Checkout = () => {
  const [step, setStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);

  const [orderId] = useState("AS-" + Math.random().toString(36).substring(2, 10).toUpperCase());
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = loadWithExpiry("cart");
    setCart(savedCart || []);
  }, []);

  const subtotal = cart.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + SHIPPING_COST + vat;

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    address: "", suburb: "", city: "", postalCode: "", province: "",
    cardNumber: "", expiry: "", cvv: ""
  });

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  // Input formatters
  const autoFormatPhone = (v) => v.replace(/\D/g, "").slice(0, 10).replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
  const autoFormatPostal = (v) => v.replace(/\D/g, "").slice(0, 4);
  const autoFormatCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const autoFormatExpiry = (v) => {
    const s = v.replace(/\D/g, "").slice(0, 4);
    if (s.length <= 2) return s;
    return s.slice(0, 2) + "/" + s.slice(2);
  };

  // Step validations
  const isShippingValid = () =>
    form.name && form.email && form.phone && form.address && form.suburb &&
    form.city && form.postalCode && form.province;

  const isPaymentValid = () =>
    form.cardNumber.length === 19 && form.expiry.length === 5 && form.cvv.length === 3;

  // Payment success
  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        setShowConfetti(true);
        setShowSuccessModal(true);

        // Save order with expiry
        const savedOrders = loadWithExpiry("orders") || [];
        savedOrders.push({
          id: orderId,
          date: new Date().toLocaleString(),
          total,
          items: cart.map(i => ({
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            img: i.image || ""
          })),
          address: { ...form }
        });
        saveWithExpiry("orders", savedOrders);

        // Clear cart
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));

        setTimeout(() => setShowConfetti(false), 5000);
        toast.success("Payment Successful! 🎉");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Copy order ID
  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    toast.info("Order ID copied!");
  };

  // Download receipt
  const downloadReceipt = () => {
    const receipt = `Order Receipt\n\nCustomer: ${form.name}\nEmail: ${form.email}\nOrder ID: ${orderId}\nTotal: ${formatZAR(total)}`;
    const blob = new Blob([receipt], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "receipt.txt";
    link.click();
    toast.success("Receipt downloaded!");
  };

  // Send receipt via EmailJS
  const sendEmailReceipt = () => {
    const templateParams = {
      to_name: form.name,
      to_email: form.email,
      order_id: orderId,
      total_paid: formatZAR(total),
      items: cart.map(i => `${i.name} x${i.quantity}`).join(", ")
    };

    console.log("EmailJS send params:", {
      serviceID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
      templateID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      templateParams
    });

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
      .then((response) => {
        console.log("EmailJS success:", response);
        toast.success(`Receipt sent to ${form.email} ✅`);
        setShowEmailPopup(true);
      })
      .catch((error) => {
        console.error("EmailJS error detail:", error);
        toast.error(`Email failed: ${error.text || JSON.stringify(error)}`);
      });
  };

  const steps = [
    // Shipping
    <div className="step-page" key="shipping">
      <h2>Shipping Information</h2>
      <label className="field"><FaUser /><input placeholder="Full Name" value={form.name} onChange={e => update("name", e.target.value)} /></label>
      <label className="field"><FaEnvelope /><input placeholder="Email" value={form.email} onChange={e => update("email", e.target.value)} /></label>
      <label className="field"><FaPhone /><input placeholder="Phone" value={form.phone} onChange={e => update("phone", autoFormatPhone(e.target.value))} /></label>
      <label className="field"><FaMapMarkerAlt />
        <select value={form.province} onChange={e => update("province", e.target.value)}>
          <option value="">Select Province</option>
          {provinces.map(p => <option key={p}>{p}</option>)}
        </select>
      </label>
      <label className="field"><FaMapMarkerAlt /><input placeholder="Street Address" value={form.address} onChange={e => update("address", e.target.value)} /></label>
      <div className="row-3">
        <input placeholder="Suburb" value={form.suburb} onChange={e => update("suburb", e.target.value)} />
        <input placeholder="City" value={form.city} onChange={e => update("city", e.target.value)} />
        <input placeholder="Postal Code" value={form.postalCode} onChange={e => update("postalCode", autoFormatPostal(e.target.value))} />
      </div>
      <button className="btn primary" disabled={!isShippingValid()} onClick={() => setStep(1)}>Next</button>
    </div>,

    // Payment
    <div className="step-page" key="payment">
      <h2>Payment Details</h2>

      {/* Display user info from previous step */}
      <div className="user-summary">
        <p><strong>{form.name}</strong> – {form.email}</p>
        <p>{form.address}, {form.city}, {form.postalCode}</p>
      </div>

      <label className="field futuristic-card"><FaCreditCard /><input placeholder="Card Number" value={form.cardNumber} onChange={e => update("cardNumber", autoFormatCard(e.target.value))} /></label>
      <div className="row-2">
        <label className="field"><FaCalendarAlt /><input placeholder="MM/YY" value={form.expiry} onChange={e => update("expiry", autoFormatExpiry(e.target.value))} /></label>
        <label className="field"><FaLock /><input placeholder="CVV" value={form.cvv} onChange={e => update("cvv", e.target.value.replace(/\D/g, "").slice(0, 3))} /></label>
      </div>
      <div className="step-buttons">
        <button className="btn ghost" onClick={() => setStep(0)}>Back</button>
        <button className="btn primary" disabled={!isPaymentValid()} onClick={() => setStep(2)}>Next</button>
      </div>
    </div>,

    // Review & Confirm
    <div className="step-page" key="review">
      <h2>Review & Confirm</h2>
      <p><strong>{form.name}</strong> – {form.phone}</p>
      <p>{form.address}, {form.suburb}, {form.city}, {form.postalCode}</p>
      <p>{form.province}</p>
      <ul className="review-list">
        {cart.map((i, x) => (
          <li key={x}>
            <span>{i.name} × {i.quantity}</span>
            <span>{formatZAR(i.price * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="totals">
        <p><span>Subtotal</span><span>{formatZAR(subtotal)}</span></p>
        <p><span>Shipping</span><span>{formatZAR(SHIPPING_COST)}</span></p>
        <p><span>VAT</span><span>{formatZAR(vat)}</span></p>
        <p className="total"><strong>Total</strong><strong>{formatZAR(total)}</strong></p>
      </div>
      <div className="step-buttons">
        <button className="btn ghost" onClick={() => setStep(1)}>Back</button>
        <button className="btn primary" onClick={() => setStep(3)}>Pay {formatZAR(total)}</button>
      </div>
    </div>,

    // Processing
    <div className="step-page center" key="processing">
      <div className="spinner"></div>
      <p>Processing your payment...</p>
    </div>
  ];

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      {showConfetti && <Confetti recycle={false} numberOfPieces={250} />}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="success-modal">
          <div className="success-box">
            <div className="checkmark">
              <div className="checkmark-circle" />
              <div className="checkmark-stem" />
              <div className="checkmark-kick" />
            </div>
            <h2>Order Successful 🎉</h2>
            <p>Thank you, <strong>{form.name}</strong>! Your payment has been processed.</p>

            <div className="order-id-box">
              <span>Order ID:</span>
              <strong>{orderId}</strong>
              <FaCopy className="copy-icon" onClick={copyOrderId} />
            </div>

            <div className="summary-mini">
              <p><span>Total Paid:</span> {formatZAR(total)}</p>
              <p><span>Items:</span> {cart.length}</p>
            </div>

            <div className="modal-buttons">
              <button className="btn primary" onClick={downloadReceipt}>Download Receipt</button>
              <button className="btn orange" onClick={sendEmailReceipt}>Receive Receipt via Email</button>
              <button className="btn ghost" onClick={() => window.location.href = "/PastPurchases"}>View Past Orders</button>
            </div>
          </div>
        </div>
      )}

      {/* Email Popup */}
      {showEmailPopup && (
        <div className="email-popup">
          <div className="popup-box">
            <p>Receipt successfully sent to <strong>{form.email}</strong>!</p>
            <button className="btn primary" onClick={() => setShowEmailPopup(false)}>OK</button>
          </div>
        </div>
      )}

      {/* Main Checkout Layout */}
      <div className="checkout-root">
        <div className="progress-wrap">
          <div className="progress" style={{ width: `${(step + 1) * 25}%` }} />
        </div>
        <div className="checkout-container">
          <div className="checkout-left">
            <div className="steps-wrapper" style={{ transform: `translateX(-${step * 25}%)` }}>
              {steps}
            </div>
          </div>
          <aside className="checkout-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              {cart.map((item, i) => (
                <div key={i} className="summary-item">
                  <span>{item.name}</span>
                  <span>{formatZAR(item.price * item.quantity)}</span>
                </div>
              ))}
              <hr />
              <p><span>Subtotal</span><span>{formatZAR(subtotal)}</span></p>
              <p><span>Shipping</span><span>{formatZAR(SHIPPING_COST)}</span></p>
              <p><span>VAT</span><span>{formatZAR(vat)}</span></p>
              <p className="total"><strong>Total</strong><strong>{formatZAR(total)}</strong></p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Checkout;
