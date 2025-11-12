// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile, // ✅ added to store firstName
} from "firebase/auth";
import { auth } from "./firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Backwards-compatible alias used across the codebase
export const useAuthentication = useAuth;

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState(null);

  // ✅ Signup with email, password, and first name
  async function signup(email, password, firstName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ✅ Save firstName to Firebase user profile
    await updateProfile(user, {
      displayName: firstName,
    });

    // ✅ Store locally for easy access
    localStorage.setItem("firstName", firstName);

    // ✅ Return updated user
    setCurrentUser({ ...user, displayName: firstName });
    return user;
  }

  // ✅ Login with email and password
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // ✅ Logout
  function logout() {
    localStorage.removeItem("firstName");
    return signOut(auth);
  }

  // ✅ Google Sign-in
  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // If the Google account has a name, store it locally too
    if (user.displayName) {
      localStorage.setItem("firstName", user.displayName.split(" ")[0]);
    }

    return user;
  }

  // ✅ Get ID token for secure API requests
  async function getIdToken() {
    if (currentUser) {
      return await currentUser.getIdToken();
    }
    return null;
  }

  // ✅ Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setCurrentUser(user);
        setIdToken(token);

        // Persist firstName if available
        if (user.displayName) {
          localStorage.setItem("firstName", user.displayName);
        }
      } else {
        setCurrentUser(null);
        setIdToken(null);
        localStorage.removeItem("firstName");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // ✅ Shared context value
  const value = {
    currentUser,
    idToken,
    loading,
    isAuthenticated: !!currentUser,
    user: currentUser,
    token: idToken,
    getAuthHeaders: () => (idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    signup,
    login,
    logout,
    signInWithGoogle,
    getIdToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
