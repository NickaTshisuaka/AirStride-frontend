// src/contexts/FavoritesContext.jsx
import { createContext, useContext, useReducer, useEffect } from "react";

// Create context
const FavoritesContext = createContext();

// Initial state from localStorage
const initialState =
  JSON.parse(localStorage.getItem("favorites")) || [];

// Reducer function
function favReducer(state, action) {
  switch (action.type) {
    case "ADD":
      // Avoid duplicates
      if (state.some(item => item.product_id === action.item.product_id)) {
        return state;
      }
      return [...state, action.item];
    case "REMOVE":
      return state.filter(item => item.product_id !== action.product_id);
    default:
      return state;
  }
}

// Provider component
export function FavoritesProvider({ children }) {
  const [favorites, dispatch] = useReducer(favReducer, initialState);

  // Persist favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Action helpers
  const addFavorite = (item) => dispatch({ type: "ADD", item });
  const removeFavorite = (product_id) => dispatch({ type: "REMOVE", product_id });
  const isFavorite = (product_id) => favorites.some(item => item.product_id === product_id);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Custom hook
export const useFavoritesContext = () => useContext(FavoritesContext);
