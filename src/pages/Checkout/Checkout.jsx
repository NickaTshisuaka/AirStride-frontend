// src/pages/Checkout/Checkout.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import Confetti from "react-confetti";
import InputMask from "react-input-mask";
import { toast, ToastContainer } from "react-toastify";
import emailjs from "@emailjs/browser";
import "react-toastify/dist/ReactToastify.css";
import "./Checkout.css";

/*
  Key changes:
  - Uses react-input-mask for phone/card/expiry/postal formatting (smooth UX).
  - Payment flow triggered by explicit action `handlePay()` (no automatic useEffect on step).
  - isPaymentProcessing ensures one-shot processing.
  - loadWithExpiry returns robustly; empty cart handled gracefully.
  - EmailJS validated before sending; errors surfaced to user.
  - Receipt download revokes objectURL.
  - Cross-tab sync via localStorage write + event listener.
  - Dynamic progress calculation based on steps.length.
*/

const SHIPPING_COST = 85;
const VAT_RATE = 0.15;
const EXPIRY_TIME = 2 * 60 * 60 * 1000; // for cached orders/cart

const formatZAR = (amount = 0) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(amount);

const saveWithExpiry = (key, value) => {
  const record = { value, timestamp: Date.now() };
  localStorage.setItem(key, JSON.stringify(record));
};

const loadWithExpiry = (key) => {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    // If object has timestamp (we set it), validate expiry
    if (parsed && parsed.timestamp) {
      if (Date.now() - parsed.timestamp > EXPIRY_TIME) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed.value;
    }
    // Backwards compatibility: stored raw array/object without timestamp
    return parsed;
  } catch (err) {
    // invalid JSON — remove and return null
    console.warn("loadWithExpiry: invalid JSON for", key, err);
    localStorage.removeItem(key);
    return null;
  }
};

// Helper to broadcast cart change across tabs
const broadcastCartUpdated = () => {
  // write a timestamp to localStorage so other tabs get `storage` event
  localStorage.setItem("cartUpdated", Date.now().toString());
};

const Checkout = () => {
  const [step, setStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const [orderId] = useState(
    "AS-" + Math.random().toString(36).substring(2, 10).toUpperCase()
  );

  const [cart, setCart] = useState([]);
  const mountedRef = useRef(true);

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

  // load cart safely on mount
  useEffect(() => {
    mountedRef.current = true;
    const saved = loadWithExpiry("cart");
    if (!saved || !Array.isArray(saved) || saved.length === 0) {
      setCart([]); // empty cart
      toast.info("Your cart is empty. Add items before checking out.");
    } else {
      // Defensive — ensure each item has quantity and price
      const cleaned = saved.map((i) => ({
        quantity: Math.max(1, Number(i.quantity) || 1),
        price: Number(i.price) || 0,
        name: i.name || "Item",
        image: i.image || "",
        product_id: i.product_id || i._id || null,
        ...i,
      }));
      setCart(cleaned);
    }

    // listen for cart updates from other tabs
    const onStorage = (e) => {
      if (e.key === "cartUpdated") {
        const newest = loadWithExpiry("cart") || [];
        setCart(
          Array.isArray(newest)
            ? newest.map((i) => ({ quantity: Math.max(1, Number(i.quantity) || 1), price: Number(i.price) || 0, name: i.name || "Item", ...i }))
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

  // safe memoized totals
  const subtotal = useMemo(
    () =>
      cart.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0),
    [cart]
  );
  const vat = useMemo(() => subtotal * VAT_RATE, [subtotal]);
  const total = useMemo(() => subtotal + vat + SHIPPING_COST, [subtotal, vat]);
  const totalItems = useMemo(
    () => cart.reduce((s, i) => s + (Number(i.quantity) || 1), 0),
    [cart]
  );

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  // Provide simple validators
  const isShippingValid = () =>
    Boolean(
      form.name?.trim() &&
        form.email?.trim() &&
        form.phone?.trim() &&
        form.address?.trim() &&
        form.city?.trim() &&
        form.postalCode?.trim() &&
        form.province?.trim()
    );

  const isPaymentValid = () => {
    const rawCard = (form.cardNumber || "").replace(/\s/g, "");
    const rawExpiry = (form.expiry || "").replace(/\s/g, "");
    const rawCvv = (form.cvv || "").replace(/\D/g, "");
    return rawCard.length === 16 && /^((0[1-9])|(1[0-2]))\/\d{2}$/.test(rawExpiry) && rawCvv.length === 3;
  };

  // Payment flow triggered explicitly by user clicking Pay
  const handlePay = async () => {
    if (isPaymentProcessing) return; // guard double clicks
    if (!cart || cart.length === 0) {
      toast.error("Cart is empty.");
      return;
    }
    if (!isShippingValid()) {
      toast.error("Please complete shipping information.");
      setStep(0);
      return;
    }
    if (!isPaymentValid()) {
      toast.error("Please enter valid payment details.");
      setStep(1);
      return;
    }

    try {
      setIsPaymentProcessing(true);
      setStep(3); // show processing UI

      // Simulate payment delay — replace with real payment gateway call in production.
      await new Promise((r) => setTimeout(r, 1200));

      // ONE-TIME: save order only once
      const savedOrders = loadWithExpiry("orders") || [];
      const orderData = {
        id: orderId,
        date: new Date().toLocaleString(),
        total,
        items: cart.map((i) => ({
          name: i.name,
          price: Number(i.price) || 0,
          quantity: Number(i.quantity) || 1,
          img: i.image || "",
          product_id: i.product_id || i._id || null,
        })),
        shipping: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          suburb: form.suburb,
          city: form.city,
          postalCode: form.postalCode,
          province: form.province,
        },
      };

      savedOrders.push(orderData);
      saveWithExpiry("orders", savedOrders);

      // Clear cart once
      localStorage.removeItem("cart");
      broadcastCartUpdated(); // notify other tabs
      setCart([]);

      // show success UI
      setShowConfetti(true);
      setShowSuccessModal(true);
      toast.success("Payment successful! 🎉");

      // stop confetti after short while
      setTimeout(() => setShowConfetti(false), 4500);
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed — please try again.");
    } finally {
      // allow further operations (user may re-order) but do not re-run same processing
      setIsPaymentProcessing(false);
      setStep(0); // optionally reset or navigate away. We show modal anyway.
    }
  };

  // Receipt download (revokes object URL)
  const downloadReceipt = () => {
    const htmlReceipt = `
      <html><head><meta charset="utf-8"><title>Receipt ${orderId}</title>
      <style>body{font-family:Arial,sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px}</style>
      </head><body>
      <h2>Order Receipt</h2>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Customer:</strong> ${form.name || ""} (${form.email || ""})</p>
      <table><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>
      ${cart
        .map(
          (i) =>
            `<tr><td>${i.name}</td><td>${i.quantity}</td><td>${formatZAR(i.price)}</td><td>${formatZAR(
              (Number(i.price) || 0) * (Number(i.quantity) || 1)
            )}</td></tr>`
        )
        .join("")}
      </tbody><tfoot>
      <tr><td colspan="3">Subtotal</td><td>${formatZAR(subtotal)}</td></tr>
      <tr><td colspan="3">Shipping</td><td>${formatZAR(SHIPPING_COST)}</td></tr>
      <tr><td colspan="3">VAT</td><td>${formatZAR(vat)}</td></tr>
      <tr><td colspan="3">Total</td><td>${formatZAR(total)}</td></tr>
      </tfoot></table></body></html>
    `;

    const blob = new Blob([htmlReceipt], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt-${orderId}.html`;
    // Must be user-initiated: this function is called from a button click in modal
    link.click();
    // Release memory
    URL.revokeObjectURL(url);
    toast.success("Receipt downloaded");
  };

  const validateEmailjsConfig = () => {
    return (
      import.meta.env.VITE_EMAILJS_SERVICE_ID &&
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID &&
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
  };

  const sendEmailReceipt = async () => {
    if (!validateEmailjsConfig()) {
      toast.error("Email service is not configured. Contact admin.");
      return;
    }
    try {
      const templateParams = {
        to_name: form.name,
        to_email: form.email,
        order_id: orderId,
        total_paid: formatZAR(total),
        items: cart.map((i) => `${i.name} x${i.quantity}`).join(", "),
      };
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      toast.success("Receipt sent via email ✅");
      setShowEmailPopup(true);
    } catch (err) {
      console.error("EmailJS send error:", err);
      toast.error("Failed to send email. Try again later.");
    }
  };

  // Steps array (component-style)
  const steps = [
    {
      key: "shipping",
      title: "Shipping",
      content: (
        <div className="step-content">
          <h2>Shipping Information</h2>
          <label>
            Full name
            <input value={form.name} onChange={(e) => update("name", e.target.value)} />
          </label>

          <label>
            Email
            <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </label>

          <label>
            Phone
            <InputMask
              mask="999 999 9999"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="081 234 5678"
            />
          </label>

          <label>
            Province
            <select value={form.province} onChange={(e) => update("province", e.target.value)}>
              <option value="">Select Province</option>
              <option>Eastern Cape</option>
              <option>Free State</option>
              <option>Gauteng</option>
              <option>KwaZulu-Natal</option>
              <option>Limpopo</option>
              <option>Mpumalanga</option>
              <option>North West</option>
              <option>Northern Cape</option>
              <option>Western Cape</option>
            </select>
          </label>

          <label>
            Street address
            <input value={form.address} onChange={(e) => update("address", e.target.value)} />
          </label>

          <div className="row-3">
            <input placeholder="Suburb" value={form.suburb} onChange={(e) => update("suburb", e.target.value)} />
            <input placeholder="City" value={form.city} onChange={(e) => update("city", e.target.value)} />
            <InputMask
              mask="9999"
              placeholder="Postal"
              value={form.postalCode}
              onChange={(e) => update("postalCode", e.target.value)}
            />
          </div>

          <div className="row-actions">
            <button className="btn ghost" onClick={() => setStep((s) => Math.max(0, s - 1))}>
              Cancel
            </button>
            <button className="btn primary" disabled={!isShippingValid()} onClick={() => setStep(1)}>
              Next
            </button>
          </div>
        </div>
      ),
    },
    {
      key: "payment",
      title: "Payment",
      content: (
        <div className="step-content">
          <h2>Payment Details</h2>

          <label>
            Card number
            <InputMask
              mask="9999 9999 9999 9999"
              value={form.cardNumber}
              onChange={(e) => update("cardNumber", e.target.value)}
              placeholder="1234 5678 9012 3456"
            />
          </label>

          <div className="row-2">
            <label>
              Expiry
              <InputMask
                mask="99/99"
                placeholder="MM/YY"
                value={form.expiry}
                onChange={(e) => update("expiry", e.target.value)}
              />
            </label>

            <label>
              CVV
              <InputMask
                mask="999"
                placeholder="CVV"
                value={form.cvv}
                onChange={(e) => update("cvv", e.target.value)}
              />
            </label>
          </div>

          <div className="row-actions">
            <button className="btn ghost" onClick={() => setStep(0)}>
              Back
            </button>
            <button className="btn primary" disabled={!isPaymentValid()} onClick={() => setStep(2)}>
              Review
            </button>
          </div>
        </div>
      ),
    },
    {
      key: "review",
      title: "Review",
      content: (
        <div className="step-content">
          <h2>Review & Confirm</h2>
          <div className="review-list">
            {cart.length === 0 ? <p>Your cart is empty.</p> : null}
            {cart.map((i, idx) => (
              <div key={idx} className="review-row">
                <span>{i.name} × {Number(i.quantity) || 1}</span>
                <span>{formatZAR((Number(i.price) || 0) * (Number(i.quantity) || 1))}</span>
              </div>
            ))}
          </div>

          <div className="totals">
            <div><span>Subtotal</span><span>{formatZAR(subtotal)}</span></div>
            <div><span>Shipping</span><span>{formatZAR(SHIPPING_COST)}</span></div>
            <div><span>VAT</span><span>{formatZAR(vat)}</span></div>
            <div className="total"><strong>Total</strong><strong>{formatZAR(total)}</strong></div>
          </div>

          <div className="row-actions">
            <button className="btn ghost" onClick={() => setStep(1)}>Back</button>
            <button
              className="btn primary"
              onClick={handlePay}
              disabled={isPaymentProcessing || cart.length === 0}
            >
              {isPaymentProcessing ? "Processing..." : `Pay ${formatZAR(total)}`}
            </button>
          </div>
        </div>
      ),
    },
    {
      key: "processing",
      title: "Processing",
      content: (
        <div className="step-content center">
          <div className="spinner" />
          <p>Processing your payment...</p>
        </div>
      ),
    },
  ];

  // dynamic progress percent
  const progressPercent = ((step + 1) / steps.length) * 25;

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      {showConfetti && <Confetti recycle={false} numberOfPieces={250} />}

      {showSuccessModal && (
        <div className="success-modal">
          <div className="success-box">
            <h2>Order Successful 🎉</h2>
            <p>Thanks {form.name || "Customer"}! Your order {orderId} is confirmed.</p>
            <div className="summary-mini">
              <p>Total Paid: {formatZAR(total)}</p>
              <p>Items: {totalItems}</p>
            </div>
            <div className="modal-buttons">
              <button className="btn primary" onClick={downloadReceipt}>Download Receipt</button>
              <button className="btn orange" onClick={sendEmailReceipt}>Send Receipt via Email</button>
              <button className="btn ghost" onClick={() => { setShowSuccessModal(false); }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showEmailPopup && (
        <div className="email-popup">
          <div className="popup-box">
            <p>Receipt sent to {form.email}</p>
            <button className="btn primary" onClick={() => setShowEmailPopup(false)}>OK</button>
          </div>
        </div>
      )}

      <div className="checkout-root">
        <div className="progress-wrap">
          <div className="progress" style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="checkout-grid">
          <div className="left-panel">
            {/* slide wrapper: translateX based on step (calculated as percentage) */}
            <div
              className="steps-wrapper"
              style={{
                width: `${steps.length * 100}%`,
                transform: `translateX(-${(step / steps.length) * 100}%)`,
                transition: "transform 350ms ease",
                display: "flex",
              }}
            >
              {steps.map((s) => (
                <div key={s.key} style={{ width: `${100 / steps.length}%`, padding: 20 }}>
                  {s.content}
                </div>
              ))}
            </div>
          </div>

          <aside className="right-panel">
            <div className="summary-card">
              <h3>Order Summary</h3>
              {cart.length === 0 ? <p>No items</p> : cart.map((item, i) => (
                <div className="summary-item" key={i}>
                  <span>{item.name} × {Number(item.quantity) || 1}</span>
                  <span>{formatZAR((Number(item.price) || 0) * (Number(item.quantity) || 1))}</span>
                </div>
              ))}
              <hr/>
              <div className="totals-compact">
                <div><span>Subtotal</span><span>{formatZAR(subtotal)}</span></div>
                <div><span>Shipping</span><span>{formatZAR(SHIPPING_COST)}</span></div>
                <div><span>VAT</span><span>{formatZAR(vat)}</span></div>
                <div className="total"><strong>Total</strong><strong>{formatZAR(total)}</strong></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Checkout;
