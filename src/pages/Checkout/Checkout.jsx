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

const EXPIRY_TIME = 2 * 60 * 60 * 1000;

const formatZAR = (amount) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(amount);

const saveWithExpiry = (key, value) => {
  const record = { value, timestamp: new Date().getTime() };
  localStorage.setItem(key, JSON.stringify(record));
};

const loadWithExpiry = (key) => {
  const record = localStorage.getItem(key);
  if (!record) return null;
  try {
    const parsed = JSON.parse(record);
    if (!parsed.timestamp) return parsed.value;
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
  const [isPaymentProcessed, setIsPaymentProcessed] = useState(false);

  const [orderId] = useState("AS-" + Math.random().toString(36).substring(2, 10).toUpperCase());
  const [cart, setCart] = useState([]);

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    address: "", suburb: "", city: "", postalCode: "", province: "",
    cardNumber: "", expiry: "", cvv: ""
  });

  useEffect(() => {
    const savedCart = loadWithExpiry("cart");
    if (!savedCart || savedCart.length === 0) {
      toast.info("Your cart is empty.");
      setCart([]);
    } else {
      setCart(savedCart);
    }
  }, []);

  const subtotal = cart.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + SHIPPING_COST + vat;
  const totalItems = cart.reduce((sum, i) => sum + (i.quantity || 1), 0);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const autoFormatPhone = (v) => v.replace(/\D/g, "").slice(0, 10).replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
  const autoFormatPostal = (v) => v.replace(/\D/g, "").slice(0, 4);
  const autoFormatCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const autoFormatExpiry = (v) => {
    const s = v.replace(/\D/g, "").slice(0, 4);
    if (s.length <= 2) return s;
    return s.slice(0, 2) + "/" + s.slice(2);
  };

  const isShippingValid = () =>
    form.name && form.email && form.phone && form.address && form.suburb &&
    form.city && form.postalCode && form.province;

  const isPaymentValid = () =>
    form.cardNumber.replace(/\s/g, "").length === 16 && form.expiry.length === 5 && form.cvv.length === 3;

  useEffect(() => {
    if (step === 3 && !isPaymentProcessed) {
      setIsPaymentProcessed(true);

      const timer = setTimeout(() => {
        setShowConfetti(true);
        setShowSuccessModal(true);

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

        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));

        setTimeout(() => setShowConfetti(false), 5000);
        toast.success("Payment Successful! 🎉");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [step, isPaymentProcessed, cart, form, orderId, total]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    toast.info("Order ID copied!");
  };

  const downloadReceipt = () => {
    const htmlReceipt = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
            tfoot td { font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>Order Receipt</h2>
          <p><strong>Customer:</strong> ${form.name}</p>
          <p><strong>Email:</strong> ${form.email}</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${cart.map(i => `
                <tr>
                  <td>${i.name}</td>
                  <td>${i.quantity}</td>
                  <td>${formatZAR(i.price)}</td>
                  <td>${formatZAR(i.price * i.quantity)}</td>
                </tr>`).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3">Subtotal</td>
                <td>${formatZAR(subtotal)}</td>
              </tr>
              <tr>
                <td colspan="3">Shipping</td>
                <td>${formatZAR(SHIPPING_COST)}</td>
              </tr>
              <tr>
                <td colspan="3">VAT</td>
                <td>${formatZAR(vat)}</td>
              </tr>
              <tr>
                <td colspan="3">Total Paid</td>
                <td>${formatZAR(total)}</td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlReceipt], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "receipt.html";
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success("Receipt downloaded!");
  };

  const sendEmailReceipt = () => {
    if (!import.meta.env.VITE_EMAILJS_SERVICE_ID ||
        !import.meta.env.VITE_EMAILJS_TEMPLATE_ID ||
        !import.meta.env.VITE_EMAILJS_PUBLIC_KEY) {
      toast.error("Email service is not properly configured.");
      return;
    }

    const templateParams = {
      to_name: form.name,
      to_email: form.email,
      order_id: orderId,
      total_paid: formatZAR(total),
      items: cart.map(i => `${i.name} x${i.quantity}`).join(", ")
    };

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
      .then(() => {
        toast.success(`Receipt sent to ${form.email} ✅`);
        setShowEmailPopup(true);
      })
      .catch((error) => {
        toast.error(`Email failed: ${error.text || JSON.stringify(error)}`);
      });
  };

  const steps = [
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
    <div className="step-page" key="payment">
      <h2>Payment Details</h2>
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
    <div className="step-page center" key="processing">
      <div className="spinner"></div>
      <p>Processing your payment...</p>
    </div>
  ];

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      {showConfetti && <Confetti recycle={false} numberOfPieces={250} />}
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
              <p><span>Items:</span> {totalItems}</p>
            </div>
            <div className="modal-buttons">
              <button className="btn primary" onClick={downloadReceipt}>Download Receipt</button>
              <button className="btn orange" onClick={sendEmailReceipt}>Receive Receipt via Email</button>
              <button className="btn ghost" onClick={() => window.location.href = "/PastPurchases"}>View Past Orders</button>
            </div>
          </div>
        </div>
      )}
      {showEmailPopup && (
        <div className="email-popup">
          <div className="popup-box">
            <p>Receipt successfully sent to <strong>{form.email}</strong>!</p>
            <button className="btn primary" onClick={() => setShowEmailPopup(false)}>OK</button>
          </div>
        </div>
      )}
      <div className="checkout-root">
        <div className="progress-wrap">
          <div className="progress" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>
        <div className="checkout-container">
          <div className="checkout-left">
            <div className="steps-wrapper" style={{ transform: `translateX(-${(step / steps.length) * 100}%)` }}>
              {steps}
            </div>
          </div>
          <aside className="checkout-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              {cart.map((item, i) => (
                <div key={i} className="summary-item">
                  <span>{item.name} × {item.quantity}</span>
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
