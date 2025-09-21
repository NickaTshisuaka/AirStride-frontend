import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthentication } from "./AuthContext";
import Lottie from "lottie-react";
import MarathonAnimation from "./assets/animations/Marathon.json";
import HeartbeatAnimation from "./assets/animation2/Heartbeat.json";
import "./SigninLogin.css";

// Base backend URL
const BASE_URL = "http://98.89.166.198:3001";

// Intro animation wrapper
const IntroAnimation = () => (
  <div className="animation-wrapper">
    <Lottie animationData={MarathonAnimation} loop={false} />
  </div>
);

// Background looping animation
const BackgroundAnimation = () => (
  <div className="auth-bg">
    <Lottie animationData={HeartbeatAnimation} loop={true} />
  </div>
);

const SigninLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showAnimation, setShowAnimation] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [showHeartbeat, setShowHeartbeat] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login,  isAuthenticated, loading } = useAuthentication();
  const navigate = useNavigate();

  // Animation timers
  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 4500);
    const hideTimer = setTimeout(() => {
      setShowAnimation(false);
      setShowHeartbeat(true);
    }, 5000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Redirect logged-in users
  if (!loading && isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  // API helper for POST requests
  const postAPI = async (endpoint, body) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Network error");
    }
    return res.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        if (!formData.email || !formData.password) {
          setError("Please fill in all fields");
          setIsLoading(false);
          return;
        }

        const result = await postAPI("/users/login", {
          email: formData.email,
          password: formData.password,
        });

        // Save token & user in AuthContext
        login(result.token, result.user);
        navigate("/home", { replace: true });
      } else {
        // Signup
        if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
          setError("Please fill in all fields");
          setIsLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters long");
          setIsLoading(false);
          return;
        }

        await postAPI("/users/signup", {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });

        // Switch to login form
        setIsLogin(true);
        setFormData({
          email: formData.email,
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
        });
        setError("Signup successful! Please log in.");
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setError(err.message || "An unexpected error occurred");
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

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login clicked`);
    setError("Social login not implemented yet");
  };

  return (
    <>
      {showAnimation && (
        <div className={`animation-overlay ${fadeOut ? "fade-out" : ""}`}>
          <IntroAnimation />
        </div>
      )}

      {!showAnimation && (
        <div className="auth-container gradient-bg">
          {showHeartbeat && <BackgroundAnimation />}
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
                    <div className="input-group">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First Name"
                        required
                        className="auth-input"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="input-group">
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        required
                        className="auth-input"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                <div className="input-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    required
                    className="auth-input"
                    disabled={isLoading}
                  />
                </div>

                <div className="input-group">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    required
                    className="auth-input"
                    disabled={isLoading}
                  />
                </div>

                {!isLogin && (
                  <div className="input-group">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm Password"
                      required
                      className="auth-input"
                      disabled={isLoading}
                    />
                  </div>
                )}

                {isLogin && (
                  <div className="forgot-password">
                    <a href="#" className="forgot-link">Forgot your password?</a>
                  </div>
                )}

                <button type="submit" className="auth-button" disabled={isLoading}>
                  {isLoading ? (isLogin ? "Signing In..." : "Signing Up...") : isLogin ? "Sign In" : "Sign Up"}
                </button>
              </form>

              <div className="auth-divider"><span>or continue with</span></div>

              <div className="social-login">
                {["Google","GitHub","Facebook","Twitter","LinkedIn","Instagram","TikTok"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`social-button ${p.toLowerCase()}`}
                    onClick={() => handleSocialLogin(p)}
                  >
                    <i className={`fab fa-${p.toLowerCase()}`}></i>
                  </button>
                ))}
              </div>

              <div className="auth-footer">
                <p>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button type="button" onClick={toggleForm} disabled={isLoading}>
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SigninLogin;
