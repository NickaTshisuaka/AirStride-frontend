// src/config/api.js

// Reads VITE_API_URL from .env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// List of endpoints
export const API_ENDPOINTS = {
  products: `${API_BASE_URL}/api/products`,
  orders: `${API_BASE_URL}/api/orders`,
  users: `${API_BASE_URL}/users`,
  signup: `${API_BASE_URL}/signup`,
  login: `${API_BASE_URL}/login`,
};
console.log("API BASE URL:", API_BASE_URL);

export default API_BASE_URL;
