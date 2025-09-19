import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../../AuthContext";
import "./Logout.css";

const Logout = () => {
  const { logout } = useAuthentication();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleConfirm = () => {
    logout();
    navigate("/"); // redirect to home after logout
  };

  return (
    <div className="logout-container">
      {step === 1 && (
        <>
          <h1>Are you sure you want to log out?</h1>
          <p>Logging out will end your current session.</p>
          <div className="logout-buttons">
            <button className="btn confirm" onClick={() => setStep(2)}>
              Yes, log me out
            </button>
            <button className="btn cancel" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h1>Final confirmation</h1>
          <p>Do you really want to log out? We’ll miss you!</p>
          <div className="logout-buttons">
            <button className="btn confirm" onClick={handleConfirm}>
              Log Out
            </button>
            <button className="btn cancel" onClick={() => setStep(1)}>
              Go Back
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Logout;
