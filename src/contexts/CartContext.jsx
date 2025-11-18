import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const initialState = JSON.parse(localStorage.getItem("cart")) || [];

// Normalize ID so everything uses "id"
const normalizeId = (item) => item.product_id || item._id || item.id;

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const id = normalizeId(action.item);
      const exists = state.find((i) => normalizeId(i) === id);

      if (exists) {
        return state.map((i) =>
          normalizeId(i) === id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...state, { ...action.item, product_id: id, quantity: 1 }];
    }

    case "REMOVE":
      return state.filter((i) => normalizeId(i) !== action.id);

    case "UPDATE_QTY":
      return state.map((i) =>
        normalizeId(i) === action.id
          ? { ...i, quantity: Math.max(1, Number(action.qty)) }
          : i
      );

    case "CLEAR":
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    // Triggers Navbar/cart updates instantly
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart: (item) => dispatch({ type: "ADD", item }),
        removeFromCart: (id) => dispatch({ type: "REMOVE", id }),
        updateQuantity: (id, qty) => dispatch({ type: "UPDATE_QTY", id, qty }),
        clearCart: () => dispatch({ type: "CLEAR" }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ✅ Correct hook export
export const useCartContext = () => useContext(CartContext);
