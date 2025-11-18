

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBNLdaEczydjojg_s4YsY5F9xc14PtC9Ks",
  authDomain: "airstride-3317d.firebaseapp.com",
  projectId: "airstride-3317d",
  storageBucket: "airstride-3317d.firebasestorage.app",
  messagingSenderId: "762526980895",
  appId: "1:762526980895:web:2ee974d0b79ccbdc442e2a",
  measurementId: "G-4KEZ1X4SDL"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase services you plan to use
export const auth = getAuth(app);         // for authentication
export default app;                       // export app if needed elsewhere
