import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

/**
 * Custom hook for managing cart state
 * FIXED: Prevents infinite loops by tracking last saved value
 */
export const useCart = () => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  });

  // Track the last value we saved to prevent loops
  const lastSavedCart = useRef(null);

  // Save to localStorage when cart changes
  useEffect(() => {
    const cartString = JSON.stringify(cart);
    
    // Only save if it's actually different from what we last saved
    if (cartString !== lastSavedCart.current) {
      lastSavedCart.current = cartString;
      try {
        localStorage.setItem('cart', cartString);
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    }
  }, [cart]);

  // Listen for changes from OTHER tabs only
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Only process if:
      // 1. It's the cart key
      // 2. The new value exists
      // 3. It's different from what we last saved (prevents self-triggering)
      if (e.key === 'cart' && e.newValue && e.newValue !== lastSavedCart.current) {
        try {
          const newCart = JSON.parse(e.newValue);
          setCart(newCart);
        } catch (error) {
          console.error('Error syncing cart:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevCart, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) {
      setCart(prevCart => prevCart.filter(item => item._id !== productId));
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const cartIds = useMemo(() => {
    return new Set(cart.map(item => item._id));
  }, [cart]);

  const isInCart = useCallback((productId) => {
    return cartIds.has(productId);
  }, [cartIds]);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    cartCount,
    subtotal
  };
};