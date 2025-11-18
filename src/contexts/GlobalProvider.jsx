// src/context/GlobalProvider.jsx
import { CartProvider } from "./CartContext";
import { FavoritesProvider } from "./FavoritesContext";
import { ProductsProvider } from "./ProductsContext";

export default function GlobalProvider({ children }) {
  return (
    <ProductsProvider>
      <FavoritesProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </FavoritesProvider>
    </ProductsProvider>
  );
}
