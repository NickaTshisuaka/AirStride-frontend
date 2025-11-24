// src/pages/AuthenticationPages/SigninLogin.jsx
import React, { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext.jsx";
import { auth, signInWithGoogle } from "../../firebaseAuth.js";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SigninLogin.css";

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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isPhoneSent, setIsPhoneSent] = useState(false);

  const { login, signup, currentUser, loading } = useAuth();
  const navigate = useNavigate();

  const recaptchaRef = useRef(null);
  const confirmationResultRef = useRef(null);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      const container = document.getElementById("recaptcha-container");
      if (container) {
        try {
          window.recaptchaVerifier = new RecaptchaVerifier(
            "recaptcha-container",
            {
              size: "invisible",
              callback: (response) => {
                console.log("reCAPTCHA solved", response);
              },
            },
            auth
          );
          recaptchaRef.current = window.recaptchaVerifier;
        } catch (error) {
          console.error("RecaptchaVerifier initialization error:", error);
        }
      }
    }

    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (error) {
          console.error("Error clearing recaptcha:", error);
        }
        window.recaptchaVerifier = null;
        recaptchaRef.current = null;
      }
    };
  }, []);

  if (!loading && currentUser) {
    return <Navigate to="/home" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const sendVerificationCode = async () => {
    if (!phoneNumber) {
      setError("Enter a phone number");
      return;
    }

    if (!window.recaptchaVerifier) {
      setError("reCAPTCHA not ready yet. Please wait.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      confirmationResultRef.current = confirmationResult;
      window.confirmationResult = confirmationResult;
      setIsPhoneSent(true);
      toast.success("OTP sent! Check your phone.");
    } catch (err) {
      console.error("Error sending SMS:", err);
      let msg = "Failed to send OTP. Try again.";
      if (err.code === "auth/invalid-phone-number") {
        msg = "Invalid phone number format. Use +27XXXXXXXXX";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Too many attempts. Try again later.";
      } else if (err.code === "auth/quota-exceeded") {
        msg = "SMS quota exceeded. Try again later.";
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setError("Enter the OTP code");
      return;
    }

    if (!confirmationResultRef.current && !window.confirmationResult) {
      setError("No OTP request found. Please resend.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const confirmResult = confirmationResultRef.current || window.confirmationResult;
      const result = await confirmResult.confirm(otp);
      const user = result.user;

      localStorage.setItem("email", user.phoneNumber);
      localStorage.setItem("firstName", user.displayName || user.phoneNumber);

      toast.success("Phone verified successfully!");
      setTimeout(() => navigate("/home", { replace: true }), 800);
    } catch (err) {
      console.error("Invalid OTP:", err);
      setError("Invalid OTP. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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

        localStorage.setItem("email", formData.email);
        localStorage.setItem("firstName", displayName);

        toast.success(`🎉 Welcome back, ${displayName}!`);
        setTimeout(() => navigate("/home", { replace: true }), 800);
      } else {
        await signup(formData.email, formData.password);

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
    setPhoneNumber("");
    setOtp("");
    setIsPhoneSent(false);
  };

  const handleSocialLogin = async (provider) => {
    setError("");
    setIsLoading(true);
    try {
      let authProvider;
      switch (provider) {
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
        localStorage.setItem("email", result.user.email);
        localStorage.setItem(
          "firstName",
          result.user.displayName || result.user.email.split("@")[0]
        );
        toast.success(`Welcome, ${result.user.displayName || "User"}!`);
        setTimeout(() => navigate("/home", { replace: true }), 800);
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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      const user = await signInWithGoogle();

      localStorage.setItem("email", user.email);
      localStorage.setItem("firstName", user.displayName || user.email.split("@")[0]);

      toast.success(`🎉 Welcome, ${user.displayName || "User"}!`);
      setTimeout(() => navigate("/home", { replace: true }), 800);
    } catch (err) {
      console.error("Google sign-in failed:", err);
      setError("Google Sign-In failed. Try again.");
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
                  <a href="#" className="forgot-link">
                    Forgot your password?
                  </a>
                </div>
              )}

              <button type="submit" className="auth-button" disabled={isLoading}>
                {isLoading ? (isLogin ? "Signing In..." : "Signing Up...") : isLogin ? "Sign In" : "Sign Up"}
              </button>
            </form>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <div className="social-login">
              <button
                type="button"
                className="social-button google"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                Sign in with Google
              </button>
              {["GitHub", "Facebook", "Twitter"].map((provider) => (
                <button
                  key={provider}
                  type="button"
                  className={`social-button ${provider.toLowerCase()}`}
                  onClick={() => handleSocialLogin(provider)}
                  disabled={isLoading}
                >
                  {provider}
                </button>
              ))}
            </div>

            <div className="phone-login">
              <h3>Or sign in with your phone</h3>
              <div id="recaptcha-container"></div>
              {!isPhoneSent ? (
                <>
                  <input
                    type="tel"
                    placeholder="+27123456789"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="auth-input"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={sendVerificationCode}
                    className="auth-button"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send OTP"}
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="auth-input"
                    disabled={isLoading}
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={verifyOtp}
                    className="auth-button"
                    disabled={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPhoneSent(false);
                      setOtp("");
                      setError("");
                    }}
                    className="toggle-button"
                    disabled={isLoading}
                    style={{ marginTop: "10px" }}
                  >
                    Resend OTP
                  </button>
                </>
              )}
            </div>

            <div className="auth-footer">
              <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={toggleForm}
                  className="toggle-button"
                  disabled={isLoading}
                >
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