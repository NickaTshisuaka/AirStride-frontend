// cypress/support/commands.js

// ✅ Firebase imports (optional for UI auth flow only)
import { initializeApp } from "firebase/app";

// ✅ Firebase config using Cypress environment variables
const firebaseConfig = {
  apiKey: 'AIzaSyBNLdaEczydjojg_s4YsY5F9xc14PtC9Ks' ,
  authDomain: 'airstride-3317d.firebaseapp.com',
  projectId: 'airstride-3317d',
  storageBucket: 'airstride-3317d.firebasestorage.app',
  messagingSenderId: '762526980895',
  appId: '1:762526980895:web:2ee974d0b79ccbdc442e2a'
  
};

// ✅ Only initialize once
let app;
if (!app) app = initializeApp(firebaseConfig);

// 🔑 Firebase API key constant to avoid repeating string
const FIREBASE_API_KEY = Cypress.env("VITE_FIREBASE_API_KEY");

// ==================================================
// 🔐 LOGIN COMMAND - Programmatic Firebase Login
// ==================================================
Cypress.Commands.add("login", (email, password) => {
  cy.log(`🔐 Logging in: ${email}`);

  return cy
    .request({
      method: "POST",
      url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      body: {
        email,
        password,
        returnSecureToken: true,
      },
    })
    .then((response) => {
      const idToken = response.body.idToken;
      cy.window().then((win) => {
        win.localStorage.setItem("authToken", idToken);
      });
      cy.log("✅ Firebase login successful");
    });
});

// ==================================================
// 🛒 CART COMMANDS
// ==================================================
Cypress.Commands.add("addToCart", (product) => {
  cy.log(`🛒 Adding to cart: ${product.name}`);

  cy.window().then((win) => {
    const cart = JSON.parse(win.localStorage.getItem("cart") || "[]");
    cart.push({ ...product, quantity: product.quantity || 1 });
    win.localStorage.setItem("cart", JSON.stringify(cart));
  });
});

Cypress.Commands.add("clearCart", () => {
  cy.log("🗑 Clearing cart");
  cy.window().then((win) => win.localStorage.removeItem("cart"));
});

// ==================================================
// 🧭 NAVIGATION HELPERS
// ==================================================
Cypress.Commands.add("navigateTo", (path) => {
  cy.visit(path);
  cy.url().should("include", path);
});

Cypress.Commands.add("logout", () => {
  cy.log("🚪 Logging out...");
  cy.window().then((win) => win.localStorage.clear());
  cy.reload();
});