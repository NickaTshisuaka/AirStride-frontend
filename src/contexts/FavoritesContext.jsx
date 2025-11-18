// src/context/FavoritesContext.jsx
import { createContext, useContext, useReducer, useEffect } from "react";

const FavoritesContext = createContext();

const initialState =
  JSON.parse(localStorage.getItem("favorites")) || [];

function favReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, action.item];
    case "REMOVE":
      return state.filter(i => i.id !== action.id);
    default:
      return state;
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, dispatch] = useReducer(favReducer, initialState);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite: item => dispatch({ type: "ADD", item }),
        removeFavorite: id => dispatch({ type: "REMOVE", id })
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavoritesContext = () => useContext(FavoritesContext);
