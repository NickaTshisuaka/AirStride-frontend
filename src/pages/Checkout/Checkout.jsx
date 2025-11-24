// src/pages/Checkout/Checkout.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import Confetti from "react-confetti";
import { toast, ToastContainer } from "react-toastify";
import emailjs from "@emailjs/browser";
import "react-toastify/dist/ReactToastify.css";
import "./Checkout.css";

// ---------------------------------------------
// SETTINGS
// ---------------------------------------------
const SHIPPING_COST = 85;
const VAT_RATE = 0.15;
const EXPIRY_TIME = 2 * 60 * 60 * 1000;

// ---------------------------------------------
// HELPERS
// ---------------------------------------------
const formatZAR = (amount = 0) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(
    amount
  );

const saveWithExpiry = (key, value) => {
  const record = { value, timestamp: Date.now() };
  localStorage.setItem(key, JSON.stringify(record));
};

const loadWithExpiry = (key) => {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.timestamp) {
      if (Date.now() - parsed.timestamp > EXPIRY_TIME) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed.value;
    }
    return parsed;
  } catch (err) {
    console.warn("Invalid JSON for", key, err);
    localStorage.removeItem(key);
    return null;
  }
};

const broadcastCartUpdated = () => {
  localStorage.setItem("cartUpdated", Date.now().toString());
};

// ---------------------------------------------
// COMPONENT
// ---------------------------------------------
const Checkout = () => {
  const [step, setStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const mountedRef = useRef(true);

  const [orderId] = useState(
    "AS-" + Math.random().toString(36).substring(2, 10).toUpperCase()
  );

  const [cart, setCart] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    suburb: "",
    city: "",
    postalCode: "",
    province: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  // ---------------------------------------------
  // LOAD CART ON MOUNT
  // ---------------------------------------------
  useEffect(() => {
    mountedRef.current = true;

    const saved = loadWithExpiry("cart");
    if (!saved || !Array.isArray(saved) || saved.length === 0) {
      setCart([]);
      toast.info("Your cart is empty. Add items before checking out.");
    } else {
      const cleaned = saved.map((item) => ({
        quantity: Math.max(1, Number(item.quantity) || 1),
        price: Number(item.price) || 0,
        name: item.name || "Item",
        image: item.image || "",
        product_id: item.product_id || item._id || null,
        ...item,
      }));
      setCart(cleaned);
    }

    const onStorage = (e) => {
      if (e.key === "cartUpdated") {
        const newest = loadWithExpiry("cart") || [];
        setCart(
          Array.isArray(newest)
            ? newest.map((i) => ({
                quantity: Math.max(1, Number(i.quantity) || 1),
                price: Number(i.price) || 0,
                name: i.name || "Item",
                ...i,
              }))
            : []
        );
      }
    };

    window.addEventListener("storage", onStorage);

    return () => {
      mountedRef.current = false;
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // ---------------------------------------------
  // TOTALS
  // ---------------------------------------------
  const subtotal = useMemo(
    () =>
      cart.reduce(
        (s, i) =>
          s + (Number(i.price) || 0) * (Number(i.quantity) || 1),
        0
      ),
    [cart]
  );

  const vat = useMemo(() => subtotal * VAT_RATE, [subtotal]);
  const total = useMemo(() => subtotal + vat + SHIPPING_COST, [subtotal, vat]);

  const totalItems = useMemo(
    () => cart.reduce((s, i) => s + (Number(i.quantity) || 1), 0),
    [cart]
  );

  // ---------------------------------------------
  // SIMPLE INPUT HANDLER
  // ---------------------------------------------
  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ---------------------------------------------
  // VALIDATION
  // ---------------------------------------------
  const isShippingValid = () =>
    form.name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.address.trim() &&
    form.city.trim() &&
    form.postalCode.trim() &&
    form.province.trim();

  const isPaymentValid = () => {
    const card = form.cardNumber.replace(/\D/g, "");
    const cvv = form.cvv.replace(/\D/g, "");
    const expiry = form.expiry.trim();

    return (
      card.length === 16 &&
      cvv.length === 3 &&
      /^((0[1-9])|(1[0-2]))\/\d{2}$/.test(expiry)
    );
  };

  // ---------------------------------------------
  // PROCESS PAYMENT
  // ---------------------------------------------
  const handlePay = async () => {
    if (isPaymentProcessing) return;

    if (!cart.length) {
      toast.error("Cart is empty.");
      return;
    }

    if (!isShippingValid()) {
      toast.error("Please complete shipping information.");
      setStep(0);
      return;
    }

    if (!isPaymentValid()) {
      toast.error("Enter valid payment details.");
      setStep(1);
      return;
    }

    try {
      setIsPaymentProcessing(true);
      setStep(3);

      await new Promise((res) => setTimeout(res, 1200));

      const savedOrders = loadWithExpiry("orders") || [];
      const orderData = {
        id: orderId,
        date: new Date().toLocaleString(),
        total,
        items: cart,
        shipping: { ...form },
      };

      savedOrders.push(orderData);
      saveWithExpiry("orders", savedOrders);

      localStorage.removeItem("cart");
      broadcastCartUpdated();
      setCart([]);

      setShowConfetti(true);
      setShowSuccessModal(true);
      toast.success("Payment successful! 🎉");

      setTimeout(() => setShowConfetti(false), 4500);
    } catch (err) {
      console.error(err);
      toast.error("Payment failed.");
    } finally {
      setIsPaymentProcessing(false);
      setStep(0);
    }
  };

  // ---------------------------------------------
  // RECEIPT DOWNLOAD
  // ---------------------------------------------
  const downloadReceipt = () => {
    const html = `
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Receipt ${orderId}</title>
      </head>
      <body style="font-family: Arial; padding: 20px;">
        <h2>Order Receipt</h2>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${form.name} (${form.email})</p>

        <table border="1" cellpadding="8" cellspacing="0" width="100%">
          <thead>
            <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
          </thead>
          <tbody>
            ${cart
              .map(
                (i) => `
              <tr>
                <td>${i.name}</td>
                <td>${i.quantity}</td>
                <td>${formatZAR(i.price)}</td>
                <td>${formatZAR(i.price * i.quantity)}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>

        <h3>Grand Total: ${formatZAR(total)}</h3>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Receipt-${orderId}.html`;
    a.click();

    URL.revokeObjectURL(url);
  };

  // ---------------------------------------------
  // UI RENDER
  // ---------------------------------------------
  return (
    <div className="checkout-container">
      {showConfetti && <Confetti />}

      <ToastContainer />

      <h1>Checkout</h1>

      {/* ------------------ STEP TABS ------------------ */}
      <div className="steps">
        <button className={step === 0 ? "active" : ""} onClick={() => setStep(0)}>
          Shipping
        </button>
        <button className={step === 1 ? "active" : ""} onClick={() => setStep(1)}>
          Payment
        </button>
        <button className={step === 2 ? "active" : ""} onClick={() => setStep(2)}>
          Review
        </button>
      </div>

      {/* ------------------ STEP CONTENT ------------------ */}
      <div className="step-content">
        {/* SHIPPING STEP */}
        {step === 0 && (
          <div className="form-section">
            <input placeholder="Full Name" value={form.name} onChange={(e) => update("name", e.target.value)} />
            <input placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} />
            <input placeholder="Phone Number" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            <input placeholder="Address" value={form.address} onChange={(e) => update("address", e.target.value)} />
            <input placeholder="Suburb" value={form.suburb} onChange={(e) => update("suburb", e.target.value)} />
            <input placeholder="City" value={form.city} onChange={(e) => update("city", e.target.value)} />
            <input placeholder="Postal Code" value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} />
            <input placeholder="Province" value={form.province} onChange={(e) => update("province", e.target.value)} />

            <button onClick={() => setStep(1)}>Next →</button>
          </div>
        )}

        {/* PAYMENT STEP */}
        {step === 1 && (
          <div className="form-section">
            <input
              placeholder="Card Number (16 digits)"
              value={form.cardNumber}
              maxLength={19}
              onChange={(e) => update("cardNumber", e.target.value)}
            />
            <input
              placeholder="Expiry (MM/YY)"
              value={form.expiry}
              maxLength={5}
              onChange={(e) => update("expiry", e.target.value)}
            />
            <input
              placeholder="CVV"
              maxLength={3}
              value={form.cvv}
              onChange={(e) => update("cvv", e.target.value)}
            />

            <button onClick={() => setStep(2)}>Next →</button>
          </div>
        )}

        {/* REVIEW STEP */}
        {step === 2 && (
          <div className="review-section">
            <h2>Order Summary</h2>
            <p>Items: {totalItems}</p>
            <p>Subtotal: {formatZAR(subtotal)}</p>
            <p>VAT: {formatZAR(vat)}</p>
            <p>Shipping: {formatZAR(SHIPPING_COST)}</p>
            <h3>Total: {formatZAR(total)}</h3>

            <button className="pay-btn" onClick={handlePay}>
              PAY NOW
            </button>
          </div>
        )}
      </div>

      {/* ------------------ SUCCESS MODAL ------------------ */}
      {showSuccessModal && (
        <div className="success-modal">
          <h2>🎉 Payment Successful!</h2>
          <p>Your order ID is <strong>{orderId}</strong></p>

          <button onClick={downloadReceipt}>Download Receipt</button>
          <button onClick={() => setShowEmailPopup(true)}>Email Receipt</button>
        </div>
      )}

      {/* ------------------ EMAIL POPUP ------------------ */}
      {showEmailPopup && (
        <div className="email-popup">
          <h3>Enter your email</h3>
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
          <button onClick={() => setShowEmailPopup(false)}>Send</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
