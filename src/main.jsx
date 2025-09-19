import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// import { ThemeProvider } from "./ThemeContext.jsx";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthProvider } from "./AuthContext"; 
import { CartProvider } from './context/CartContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <CartProvider> 
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </CartProvider>
  </AuthProvider>
)

    
  
