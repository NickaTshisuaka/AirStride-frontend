import React, { useState, useEffect } from "react";
import "./AccountSettings.css";

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [profileImage, setProfileImage] = useState(null);
  const [firstName, setFirstName] = useState("Nicka");
  const [lastName, setLastName] = useState("Tshisuaka");

  // Persist theme globally
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const getInitials = () => {
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  };

  return (
    <div className="account-container">
      <h1>Account Settings</h1>
      <p className="account-tagline">
        Manage your profile, preferences, and appearance
      </p>

      {/* Top Tab Navigation */}
      <div className="tab-nav">
        {["profile", "password", "notifications", "appearance"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="account-content">
        {activeTab === "profile" && (
          <div className="account-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" />
                ) : (
                  <span className="initials">{getInitials()}</span>
                )}
              </div>
              <div className="avatar-buttons">
                <label className="btn">
                  Upload New
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                </label>
                <button
                  className="btn delete"
                  onClick={() => setProfileImage(null)}
                >
                  Delete Avatar
                </button>
              </div>
            </div>
            <form>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email"  />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel"  />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  
                />
              </div>
              <button className="save-btn">Save Changes</button>
            </form>
          </div>
        )}

        {activeTab === "password" && (
          <div className="account-card">
            <h2>Change Password</h2>
            <form>
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" />
              </div>
              <button className="save-btn">Update Password</button>
            </form>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="account-card">
            <h2>Notification Preferences</h2>
            <label>
              <input type="checkbox" defaultChecked /> Email Notifications
            </label>
            <label>
              <input type="checkbox" /> SMS Notifications
            </label>
            <label>
              <input type="checkbox" defaultChecked /> Product Updates
            </label>
          </div>
        )}

        {activeTab === "appearance" && (
          <div className="account-card">
            <h2>Appearance</h2>
            <p>Toggle between Light and Dark Mode</p>
            <label className="switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <span className="slider"></span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
