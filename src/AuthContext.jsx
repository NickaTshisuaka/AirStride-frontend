// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onIdTokenChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../actual-back-end/airstride-server/config/firebase"; // make sure this exports the initialized firebase auth instance

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const useAuthentication = useAuth;

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState(null);

  // Signup
  async function signup(email, password, firstName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: firstName });
    localStorage.setItem("firstName", firstName);
    return user;
  }

  // Login
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout
  function logout() {
    localStorage.removeItem("firstName");
    return signOut(auth);
  }

  // Google sign-in
  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    if (res.user?.displayName) localStorage.setItem("firstName", res.user.displayName.split(" ")[0]);
    return res.user;
  }

  // Get current token (fresh)
  async function getIdToken(forceRefresh = false) {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken(forceRefresh);
  }

  // --- Use onIdTokenChanged to avoid flicker during token refresh ---
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        // Keep previous user if already set to avoid flicker
        setCurrentUser((prev) => prev || user);
        setIdToken(token);
        if (user.displayName) localStorage.setItem("firstName", user.displayName);
      } else {
        setCurrentUser(null);
        setIdToken(null);
        localStorage.removeItem("firstName");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    user: currentUser,
    loading,
    idToken,
    isAuthenticated: !!currentUser,
    token: idToken,
    getAuthHeaders: () => (idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    signup,
    login,
    logout,
    signInWithGoogle,
    getIdToken,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
