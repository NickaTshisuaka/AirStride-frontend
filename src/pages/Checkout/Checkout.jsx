// src/pages/Checkout/Checkout.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import Confetti from "react-confetti";
import { toast, ToastContainer } from "react-toastify";
import emailjs from "@emailjs/browser";
import "react-toastify/dist/ReactToastify.css";
import "./Checkout.css";
import { useCartContext } from "../../contexts/CartContext"; // ✅ Import context

// ---------------------------------------------
// SETTINGS
// ---------------------------------------------
const SHIPPING_COST = 85;
const VAT_RATE = 0.15;

// ---------------------------------------------
// HELPERS
// ---------------------------------------------
const formatZAR = (amount = 0) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(amount);

const saveOrdersToLocalStorage = (orders) => {
  try {
    if (!Array.isArray(orders)) orders = [];
    const record = { value: orders, timestamp: Date.now() };
    localStorage.setItem("orders", JSON.stringify(record));
  } catch (err) {
    console.error("Failed to save orders to localStorage:", err);
  }
};

// Input-format helpers
const formatCardNumber = (value) =>
  value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();

const formatExpiry = (value) =>
  value
    .replace(/\D/g, "")
    .replace(/^([2-9])$/, "0$1")
    .replace(/^([01][0-9]{1})([0-9]{0,2})$/, "$1/$2")
    .slice(0, 5);

const formatPhone = (value) =>
  value.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3").slice(0, 11);

// ---------------------------------------------
// COMPONENT
// ---------------------------------------------
const Checkout = () => {
  const { cart, clearCart } = useCartContext(); // ✅ use context
  const [step, setStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const [orderId] = useState(
    "AS-" + Math.random().toString(36).substring(2, 10).toUpperCase()
  );

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

  const [fieldErrors, setFieldErrors] = useState({});

  // ---------------------------------------------
  // TOTALS
  // ---------------------------------------------
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

  // ---------------------------------------------
  // UPDATE FORM + LIVE VALIDATION
  // ---------------------------------------------
  const update = (key, value) => {
    if (key === "cardNumber") value = formatCardNumber(value);
    if (key === "expiry") value = formatExpiry(value);
    if (key === "phone") value = formatPhone(value);

    setForm((prev) => ({ ...prev, [key]: value }));

    const newErrors = { ...fieldErrors };
    switch (key) {
      case "name":
        newErrors.name = value.trim() ? "" : "Full Name is required";
        break;
      case "email":
        newErrors.email = /\S+@\S+\.\S+/.test(value) ? "" : "Email is invalid";
        break;
      case "phone":
        newErrors.phone =
          value.replace(/\s/g, "").length >= 10 ? "" : "Phone is invalid";
        break;
      case "address":
        newErrors.address = value.trim() ? "" : "Address is required";
        break;
      case "city":
        newErrors.city = value.trim() ? "" : "City is required";
        break;
      case "postalCode":
        newErrors.postalCode = value.trim() ? "" : "Postal Code is required";
        break;
      case "province":
        newErrors.province = value.trim() ? "" : "Province is required";
        break;
      case "cardNumber":
        newErrors.cardNumber =
          value.replace(/\s/g, "").length === 16 ? "" : "Card must be 16 digits";
        break;
      case "expiry":
        newErrors.expiry = /^((0[1-9])|(1[0-2]))\/\d{2}$/.test(value)
          ? ""
          : "Expiry MM/YY";
        break;
      case "cvv":
        newErrors.cvv =
          value.replace(/\D/g, "").length === 3 ? "" : "CVV must be 3 digits";
        break;
      default:
        break;
    }
    setFieldErrors(newErrors);
  };

  // ---------------------------------------------
  // FINAL VALIDATION
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

      // fake delay
      await new Promise((res) => setTimeout(res, 1200));

      // Safe localStorage handling and normalization
      let savedOrders = [];
      try {
        const rawOrders = localStorage.getItem("orders");
        if (rawOrders) {
          const parsed = JSON.parse(rawOrders);
          savedOrders = Array.isArray(parsed?.value) ? parsed.value : [];
        }
      } catch (err) {
        console.warn("Corrupted localStorage orders, resetting...", err);
        savedOrders = [];
      }

      const orderData = {
        id: orderId,
        date: new Date().toLocaleString(),
        total,
        items: cart.map((i) => ({
          name: i.name || "Unnamed Item",
          quantity: Number(i.quantity) || 1,
          price: Number(i.price) || 0,
          img: i.img || "",
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
      saveOrdersToLocalStorage(savedOrders);

      clearCart(); // ✅ clear cart via context

      setShowConfetti(true);
      setShowSuccessModal(true);
      toast.success("Payment successful! 🎉");
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed.");
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  // ---------------------------------------------
  // RENDER (simplified for brevity)
  // ---------------------------------------------
  return (
    <div className="checkout-container">
      {showConfetti && <Confetti />}
      <ToastContainer />
      <h1>Checkout</h1>
      {/* Form, steps, review, and payment buttons remain the same */}
      <button className="pay-btn" onClick={handlePay}>
        PAY NOW
      </button>
    </div>
  );
};

export default Checkout;
