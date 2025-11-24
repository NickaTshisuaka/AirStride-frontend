// src/pages/Checkout/Checkout.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import Confetti from "react-confetti";
import { toast, ToastContainer } from "react-toastify";
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
// INPUT MASKING HELPERS
// ---------------------------------------------
const formatCardNumber = (value) =>
  value
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExpiry = (value) =>
  value
    .replace(/\D/g, "")
    .replace(/^([2-9])$/, "0$1") // prepend 0 if first digit is 2-9
    .replace(/^([01][0-9]{1})([0-9]{0,2})$/, "$1/$2")
    .slice(0, 5);

const formatPhone = (value) =>
  value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")
    .slice(0, 11);

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

  const [fieldErrors, setFieldErrors] = useState({}); // live validation state

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
  // INPUT HANDLER WITH MASKING AND LIVE VALIDATION
  // ---------------------------------------------
  const update = (key, value) => {
    if (key === "cardNumber") value = formatCardNumber(value);
    if (key === "expiry") value = formatExpiry(value);
    if (key === "phone") value = formatPhone(value);

    setForm((prev) => ({ ...prev, [key]: value }));

    // live validation
    const errors = { ...fieldErrors };
    switch (key) {
      case "name":
        errors.name = value.trim() ? "" : "Full Name is required";
        break;
      case "email":
        errors.email = /\S+@\S+\.\S+/.test(value) ? "" : "Email is invalid";
        break;
      case "phone":
        errors.phone = value.replace(/\s/g, "").length === 10 ? "" : "Phone invalid";
        break;
      case "address":
        errors.address = value.trim() ? "" : "Address required";
        break;
      case "city":
        errors.city = value.trim() ? "" : "City required";
        break;
      case "postalCode":
        errors.postalCode = value.trim() ? "" : "Postal Code required";
        break;
      case "province":
        errors.province = value.trim() ? "" : "Province required";
        break;
      case "cardNumber":
        errors.cardNumber =
          value.replace(/\s/g, "").length === 16 ? "" : "Card must be 16 digits";
        break;
      case "expiry":
        errors.expiry = /^((0[1-9])|(1[0-2]))\/\d{2}$/.test(value)
          ? ""
          : "Expiry MM/YY";
        break;
      case "cvv":
        errors.cvv = value.replace(/\D/g, "").length === 3 ? "" : "CVV must be 3 digits";
        break;
      default:
        break;
    }
    setFieldErrors(errors);
  };

  // ---------------------------------------------
  // VALIDATION FOR FINAL CHECKOUT
  // ---------------------------------------------
  const validateShipping = () => {
    const errors = [];
    if (!form.name.trim()) errors.push("Full Name is required");
    if (!form.email.trim()) errors.push("Email is required");
    if (!form.phone.trim()) errors.push("Phone Number is required");
    if (!form.address.trim()) errors.push("Address is required");
    if (!form.city.trim()) errors.push("City is required");
    if (!form.postalCode.trim()) errors.push("Postal Code is required");
    if (!form.province.trim()) errors.push("Province is required");
    return errors;
  };

  const validatePayment = () => {
    const errors = [];
    const card = form.cardNumber.replace(/\s/g, "");
    const cvv = form.cvv.replace(/\D/g, "");
    const expiry = form.expiry.trim();

    if (card.length !== 16) errors.push("Card Number must be 16 digits");
    if (!/^((0[1-9])|(1[0-2]))\/\d{2}$/.test(expiry))
      errors.push("Expiry must be in MM/YY format");
    if (cvv.length !== 3) errors.push("CVV must be 3 digits");
    return errors;
  };

  // ---------------------------------------------
  // HANDLE PAYMENT
  // ---------------------------------------------
  const handlePay = async () => {
    if (isPaymentProcessing) return;
    if (!cart.length) {
      toast.error("Cart is empty.");
      return;
    }

    const shippingErrors = validateShipping();
    if (shippingErrors.length) {
      shippingErrors.forEach((err) => toast.error(err));
      setStep(0);
      return;
    }

    const paymentErrors = validatePayment();
    if (paymentErrors.length) {
      paymentErrors.forEach((err) => toast.error(err));
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
  // DOWNLOAD RECEIPT
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
  const inputClass = (field) =>
    fieldErrors[field] ? "input-error" : "";

  return (
    <div className="checkout-container">
      {showConfetti && <Confetti />}
      <ToastContainer />
      <h1>Checkout</h1>

      <div className="steps">
        <button className={step === 0 ? "active" : ""} onClick={() => setStep(0)}>Shipping</button>
        <button className={step === 1 ? "active" : ""} onClick={() => setStep(1)}>Payment</button>
        <button className={step === 2 ? "active" : ""} onClick={() => setStep(2)}>Review</button>
      </div>

      <div className="step-content">
        {step === 0 && (
          <div className="form-section">
            <input className={inputClass("name")} placeholder="Full Name" value={form.name} onChange={(e) => update("name", e.target.value)} />
            <input className={inputClass("email")} placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} />
            <input className={inputClass("phone")} placeholder="Phone Number" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            <input className={inputClass("address")} placeholder="Address" value={form.address} onChange={(e) => update("address", e.target.value)} />
            <input placeholder="Suburb" value={form.suburb} onChange={(e) => update("suburb", e.target.value)} />
            <input className={inputClass("city")} placeholder="City" value={form.city} onChange={(e) => update("city", e.target.value)} />
            <input className={inputClass("postalCode")} placeholder="Postal Code" value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} />
            <input className={inputClass("province")} placeholder="Province" value={form.province} onChange={(e) => update("province", e.target.value)} />
            <button onClick={() => setStep(1)}>Next →</button>
          </div>
        )}

        {step === 1 && (
          <div className="form-section">
            <input className={inputClass("cardNumber")} placeholder="Card Number (16 digits)" value={form.cardNumber} maxLength={19} onChange={(e) => update("cardNumber", e.target.value)} />
            <input className={inputClass("expiry")} placeholder="Expiry (MM/YY)" value={form.expiry} maxLength={5} onChange={(e) => update("expiry", e.target.value)} />
            <input className={inputClass("cvv")} placeholder="CVV" maxLength={3} value={form.cvv} onChange={(e) => update("cvv", e.target.value)} />
            <button onClick={() => setStep(2)}>Next →</button>
          </div>
        )}

        {step === 2 && (
          <div className="review-section">
            <h2>Order Summary</h2>
            <p>Items: {totalItems}</p>
            <p>Subtotal: {formatZAR(subtotal)}</p>
            <p>VAT: {formatZAR(vat)}</p>
            <p>Shipping: {formatZAR(SHIPPING_COST)}</p>
            <h3>Total: {formatZAR(total)}</h3>
            <button className="pay-btn" onClick={handlePay}>PAY NOW</button>
          </div>
        )}
      </div>

      {showSuccessModal && (
        <div className="success-modal">
          <h2>🎉 Payment Successful!</h2>
          <p>Your order ID is <strong>{orderId}</strong></p>
          <button onClick={downloadReceipt}>Download Receipt</button>
          <button onClick={() => setShowEmailPopup(true)}>Email Receipt</button>
        </div>
      )}

      {showEmailPopup && (
        <div className="email-popup">
          <h3>Enter your email</h3>
          <input placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          <button onClick={() => setShowEmailPopup(false)}>Send</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
