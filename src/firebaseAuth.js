// src/firebaseAuth.js
import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Google User:", user);
    return user;
  } catch (error) {
    console.error("Google Sign-In error:", error);
    throw error;
  }
};

// Add this line to export auth
export { auth };
