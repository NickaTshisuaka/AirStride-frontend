import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";
// import { auth } from "../../../../actual-back-end/airstride-server/config/firebase";
import { auth } from "../../../../actual-back-end/airstride-server/config/firebase.js";
import "./SigninLogin.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SigninLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup, currentUser, loading } = useAuth();
  const navigate = useNavigate();

  if (!loading && currentUser) {
    return <Navigate to="/home" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields");
        return;
      }
    } else {
      if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
        setError("Please fill in all fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        const userCredential = await login(formData.email, formData.password);
        const displayName = userCredential?.user?.displayName || formData.email.split("@")[0];

        // Save to localStorage
        localStorage.setItem("email", formData.email);
        localStorage.setItem("firstName", displayName);

        toast.success(`🎉 Welcome back, ${displayName}!`);
        setTimeout(() => navigate("/home", { replace: true }), 800);
      } else {
        await signup(formData.email, formData.password);

        // Save to localStorage
        localStorage.setItem("email", formData.email);
        localStorage.setItem("firstName", formData.firstName);
        localStorage.setItem("lastName", formData.lastName);

        toast.success(`🎊 Welcome aboard, ${formData.firstName}!`);
        setTimeout(() => navigate("/home", { replace: true }), 800);
      }
    } catch (err) {
      console.error("Auth Error:", err);
      let msg = "Authentication failed";
      if (err.code) {
        switch (err.code) {
          case "auth/user-not-found":
          case "auth/invalid-email":
            msg = "No account found for that email";
            break;
          case "auth/wrong-password":
            msg = "Incorrect password";
            break;
          case "auth/email-already-in-use":
            msg = "Email already in use";
            break;
          case "auth/weak-password":
            msg = "Password is too weak";
            break;
          case "auth/too-many-requests":
            msg = "Too many attempts. Try again later.";
            break;
          default:
            msg = err.message || msg;
        }
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    });
    setError("");
  };

  const handleSocialLogin = async (provider) => {
    setError("");
    setIsLoading(true);
    try {
      let authProvider;
      switch (provider) {
        case "Google":
          authProvider = new GoogleAuthProvider();
          break;
        case "GitHub":
          authProvider = new GithubAuthProvider();
          break;
        case "Facebook":
          authProvider = new FacebookAuthProvider();
          break;
        case "Twitter":
          authProvider = new TwitterAuthProvider();
          break;
        default:
          setError(`${provider} login not implemented yet`);
          setIsLoading(false);
          return;
      }

      const result = await signInWithPopup(auth, authProvider);
      if (result.user) {
        // Save user info to localStorage for AccountSettings
        localStorage.setItem("email", result.user.email);
        localStorage.setItem(
          "firstName",
          result.user.displayName || result.user.email.split("@")[0]
        );
        navigate("/home", { replace: true });
      }
    } catch (err) {
      console.error(`${provider} login error:`, err);
      let errorMessage = `${provider} login failed`;
      switch (err.code) {
        case "auth/popup-closed-by-user":
          errorMessage = "Login cancelled";
          break;
        case "auth/popup-blocked":
          errorMessage = "Popup was blocked. Please allow popups for this site";
          break;
        case "auth/account-exists-with-different-credential":
          errorMessage = "An account already exists with the same email";
          break;
        default:
          errorMessage = err.message || `${provider} login failed`;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={4000} hideProgressBar={false} />

      <div className="auth-container gradient-bg">
        <div className="auth-wrapper glass-card">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <h2>{isLogin ? "Welcome Back 👋" : "Create Account 🚀"}</h2>
              <p>{isLogin ? "Sign in to your account" : "Sign up for a new account"}</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="name-row">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    className="auth-input"
                    disabled={isLoading}
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    className="auth-input"
                    disabled={isLoading}
                  />
                </div>
              )}

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="auth-input"
                disabled={isLoading}
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="auth-input"
                disabled={isLoading}
              />

              {!isLogin && (
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="auth-input"
                  disabled={isLoading}
                />
              )}

              {isLogin && (
                <div className="forgot-password">
                  <a href="#" className="forgot-link">Forgot your password?</a>
                </div>
              )}

              <button type="submit" className="auth-button" disabled={isLoading}>
                {isLoading ? (isLogin ? "Signing In..." : "Signing Up...") : (isLogin ? "Sign In" : "Sign Up")}
              </button>
            </form>

            <div className="auth-divider"><span>or continue with</span></div>

            <div className="social-login">
              {["Google", "GitHub", "Facebook", "Twitter"].map((provider) => (
                <button
                  key={provider}
                  type="button"
                  className={`social-button ${provider.toLowerCase()}`}
                  onClick={() => handleSocialLogin(provider)}
                  disabled={isLoading}
                >
                  <i className={`fab fa-${provider.toLowerCase()}`}></i>
                </button>
              ))}
            </div>

            <div className="auth-footer">
              <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button type="button" onClick={toggleForm} className="toggle-button" disabled={isLoading}>
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SigninLogin;
