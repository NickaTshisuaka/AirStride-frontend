// src/contexts/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * CartContext
 * - Single source of truth for the cart across the app.
 * - Persists to localStorage automatically.
 * - Exposes helper functions (addToCart, removeFromCart, updateQty, clearCart).
 *
 * Use:
 *   const { cart, addToCart, removeFromCart, cartCount } = useCart();
 */

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  // initialize from localStorage (safely)
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch (e) {
      console.error("Cart parse error", e);
      return [];
    }
  });

  // Keep a separate state for a small "justAdded" id to show quick UI feedback if desired
  const [justAddedId, setJustAddedId] = useState(null);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to write cart to localStorage", e);
    }
    // Also emit a global event for any legacy listeners (backwards compatibility)
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart]);

  // helper: returns number of items (sum of quantities)
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // addToCart: if product exists increase quantity, else push new item
  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const foundIndex = prev.findIndex((p) => p._id === product._id);
      if (foundIndex > -1) {
        // clone and update quantity
        const next = [...prev];
        next[foundIndex] = {
          ...next[foundIndex],
          quantity: (next[foundIndex].quantity || 1) + qty,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            ...product,
            quantity: qty,
          },
        ];
      }
    });

    // store id for UI feedback (e.g., change button to "Added")
    setJustAddedId(product._id);
    // clear justAddedId after short delay
    setTimeout(() => setJustAddedId(null), 1800);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((p) => p._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prev) =>
      prev.map((p) => (p._id === productId ? { ...p, quantity } : p))
    );
  };

  const clearCart = () => setCart([]);

  const value = {
    cart,
    cartCount,
    justAddedId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
