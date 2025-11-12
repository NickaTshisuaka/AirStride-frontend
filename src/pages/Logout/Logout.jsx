import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import "./Logout.css";

// Define a reasonable delay for the "grace period" before final logout
const LOGOUT_GRACE_PERIOD_MS = 3000; // 3 seconds

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  // State: 1 = Initial Confirmation, 2 = Logging Out (Loader), 3 = Logged Out (Optional)
  const [step, setStep] = useState(1);
  const [isCancelling, setIsCancelling] = useState(false);
  const logoutTimerRef = useRef(null);

  // Function to execute the final logout
  const performLogout = () => {
    logout();
    navigate("/"); // redirect to home after successful logout
  };

  // Handler for the initial confirmation button
  const handleConfirmLogout = () => {
    setStep(2); // Move to the logging out step
    // Set a timer for the actual logout after the grace period
    logoutTimerRef.current = setTimeout(performLogout, LOGOUT_GRACE_PERIOD_MS);
  };

  // Handler for canceling the logout during the loading state
  const handleCancelLoading = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current); // Stop the scheduled logout
    }
    setIsCancelling(true); // Start the visual cancellation process

    // Wait a brief moment to show the 'Cancelling...' message, then go back
    setTimeout(() => {
      navigate(-1); // Go back to the previous page
    }, 500);
  };

  // Cleanup: Clear the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="logout-container">
      {/* --- Step 1: Confirmation --- */}
      {step === 1 && (
        <>
          <h1>Are you sure you're ready to go?</h1>
          <p>You will be logged out of your account on all devices.</p>
          <div className="logout-buttons">
            <button className="btn confirm" onClick={handleConfirmLogout}>
              Yes, Log Me Out
            </button>
            <button className="btn cancel" onClick={() => navigate(-1)}>
              Stay Logged In
            </button>
          </div>
        </>
      )}

      {/* --- Step 2: Logging Out (Loader and Cancel) --- */}
      {step === 2 && (
        <>
          {!isCancelling ? (
            <>
              <div className="loader"></div>
              <h1>Logging You Out...</h1>
              <p>This will take just a moment. Click cancel to stop.</p>
              <div className="logout-buttons">
                <button className="btn cancel" onClick={handleCancelLoading}>
                  Cancel Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <h1>Cancelling Logout...</h1>
              <p>Taking you back now.</p>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Logout;