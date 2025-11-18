import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { toast, ToastContainer } from "react-toastify";
import {
  FaUser, FaEnvelope, FaMapMarkerAlt, FaCreditCard,
  FaCalendarAlt, FaLock, FaPhone, FaCopy
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./Checkout.css";

const formatZAR = (amount) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(amount);

const SHIPPING_COST = 85;
const VAT_RATE = 0.15;

const provinces = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape"
];

const Checkout = () => {
  const [step, setStep] = useState(0);

  /** SUCCESS MODAL STATE */
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  /** ORDER ID */
  const [orderId] = useState(
    "AS-" + Math.random().toString(36).substring(2, 10).toUpperCase()
  );

  /** CART */
  const [cart, setCart] = useState([]);
  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
  }, []);

  const subtotal = cart.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + SHIPPING_COST + vat;

  /** FORM STATE */
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    address: "", suburb: "", city: "",
    postalCode: "", province: "",
    cardNumber: "", expiry: "", cvv: ""
  });

  const update = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  /** INPUT FORMATTERS */
  const autoFormatPhone = (v) =>
    v.replace(/\D/g, "").slice(0, 10).replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");

  const autoFormatPostal = (v) => v.replace(/\D/g, "").slice(0, 4);

  const autoFormatCard = (v) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const autoFormatExpiry = (v) => {
    const s = v.replace(/\D/g, "").slice(0, 4);
    if (s.length <= 2) return s;
    return s.slice(0, 2) + "/" + s.slice(2);
  };

  /** PAYMENT PROCESS → SHOW SUCCESS POPUP + TOAST */
  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        setShowConfetti(true);
        setShowSuccessModal(true);
        toast.success("Payment Successful! 🎉");
        setTimeout(() => setShowConfetti(false), 5000);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  /** COPY ORDER ID */
  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    toast.info("Order ID copied!");
  };

  /** DOWNLOAD RECEIPT */
  const downloadReceipt = () => {
    const receipt =
      `Order Receipt\n\nCustomer: ${form.name}\nEmail: ${form.email}\nOrder ID: ${orderId}\nTotal: ${formatZAR(total)}`;
    const blob = new Blob([receipt], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "receipt.txt";
    link.click();
    toast.success("Receipt downloaded!");
  };

  /** EMAIL RECEIPT MOCK */
  const emailReceipt = () => {
    toast.success(`📧 Receipt sent to ${form.email}`);
  };

  /** STEPS */
  const steps = [
    /* STEP 0 — SHIPPING */
    <div className="step-page" key="shipping">
      <h2>Shipping Information</h2>

      <label className="field">
        <FaUser />
        <input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />
      </label>

      <label className="field">
        <FaEnvelope />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </label>

      <label className="field">
        <FaPhone />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => update("phone", autoFormatPhone(e.target.value))}
        />
      </label>

      <label className="field">
        <FaMapMarkerAlt />
        <select
          value={form.province}
          onChange={(e) => update("province", e.target.value)}
        >
          <option value="">Select Province</option>
          {provinces.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <FaMapMarkerAlt />
        <input
          placeholder="Street Address"
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
        />
      </label>

      <div className="row-3">
        <input
          placeholder="Suburb"
          value={form.suburb}
          onChange={(e) => update("suburb", e.target.value)}
        />
        <input
          placeholder="City"
          value={form.city}
          onChange={(e) => update("city", e.target.value)}
        />
        <input
          placeholder="Postal Code"
          value={form.postalCode}
          onChange={(e) => update("postalCode", autoFormatPostal(e.target.value))}
        />
      </div>

      <button className="btn primary" onClick={() => setStep(1)}>
        Next
      </button>
    </div>,

    /* STEP 1 — PAYMENT */
    <div className="step-page" key="payment">
      <h2>Payment Details</h2>

      <label className="field">
        <FaCreditCard />
        <input
          placeholder="Card Number"
          value={form.cardNumber}
          onChange={(e) => update("cardNumber", autoFormatCard(e.target.value))}
        />
      </label>

      <div className="row-2">
        <label className="field">
          <FaCalendarAlt />
          <input
            placeholder="MM/YY"
            value={form.expiry}
            onChange={(e) => update("expiry", autoFormatExpiry(e.target.value))}
          />
        </label>

        <label className="field">
          <FaLock />
          <input
            placeholder="CVV"
            value={form.cvv}
            onChange={(e) =>
              update("cvv", e.target.value.replace(/\D/g, "").slice(0, 3))
            }
          />
        </label>
      </div>

      <div className="step-buttons">
        <button className="btn ghost" onClick={() => setStep(0)}>
          Back
        </button>
        <button className="btn primary" onClick={() => setStep(2)}>
          Next
        </button>
      </div>
    </div>,

    /* STEP 2 — REVIEW */
    <div className="step-page" key="review">
      <h2>Review & Confirm</h2>

      <p>
        <strong>{form.name}</strong> – {form.phone}
      </p>
      <p>
        {form.address}, {form.suburb}, {form.city}, {form.postalCode}
      </p>
      <p>{form.province}</p>

      <ul className="review-list">
        {cart.map((i, x) => (
          <li key={x}>
            <span>
              {i.name} × {i.quantity}
            </span>
            <span>{formatZAR(i.price * i.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="totals">
        <p>
          <span>Subtotal</span>
          <span>{formatZAR(subtotal)}</span>
        </p>
        <p>
          <span>Shipping</span>
          <span>{formatZAR(SHIPPING_COST)}</span>
        </p>
        <p>
          <span>VAT</span>
          <span>{formatZAR(vat)}</span>
        </p>
        <p className="total">
          <strong>Total</strong>
          <strong>{formatZAR(total)}</strong>
        </p>
      </div>

      <div className="step-buttons">
        <button className="btn ghost" onClick={() => setStep(1)}>
          Back
        </button>
        <button className="btn primary" onClick={() => setStep(3)}>
          Pay {formatZAR(total)}
        </button>
      </div>
    </div>,

    /* STEP 3 — PROCESSING */
    <div className="step-page center" key="processing">
      <div className="spinner"></div>
      <p>Processing your payment...</p>
    </div>,
  ];

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      {showConfetti && <Confetti recycle={false} numberOfPieces={250} />}

      {/* SUCCESS POPUP */}
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
              <button className="btn primary" onClick={downloadReceipt}>
                Download Receipt
              </button>

              <button className="btn orange" onClick={emailReceipt}>
                Email Receipt
              </button>

              <button className="btn ghost track">
                Track Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CHECKOUT LAYOUT */}
      <div className="checkout-root">
        <div className="progress-wrap">
          <div className="progress" style={{ width: `${(step + 1) * 33.33}%` }} />
        </div>

        <div className="checkout-container">
          <div className="checkout-left">
            <div
              className="steps-wrapper"
              style={{ transform: `translateX(-${step * 25}%)` }}
            >
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

              <p>
                <span>Subtotal</span>
                <span>{formatZAR(subtotal)}</span>
              </p>
              <p>
                <span>Shipping</span>
                <span>{formatZAR(SHIPPING_COST)}</span>
              </p>
              <p>
                <span>VAT</span>
                <span>{formatZAR(vat)}</span>
              </p>

              <p className="total">
                <strong>Total</strong>
                <strong>{formatZAR(total)}</strong>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Checkout;
